import { useEffect, useState } from "react";
import { Globe, Check, Plus, X } from "lucide-react";
import axios from "axios";
import { backendURL } from "../../App";


const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// 
const DAY_NAME_TO_INDEX = Object.fromEntries(
  DAY_NAMES.map((name, i) => [name, i])
);

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const VISIBLE_DAYS = [1, 2, 3, 4, 5, 6, 0];

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
];


const TIME_OPTIONS = (() => {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      opts.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );
    }
  }
  return opts;
})();

const formatTime = (time24) => {
  if (!time24) return "";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
};

// "09:00" or "09:00:00" → minutes since midnight (for comparison)
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AvailabilityTab() {
  // availability: { [dayIndex: number]: Array<{ id?: number, start: string, end: string }> }
  // id is kept from the backend so we know which rows already exist
  const [availability, setAvailability] = useState({});
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Load ────────────────────────────────────────────────────────────────────
  const getAvailability = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${backendURL}/api/v1/availability`);

      if (response.data.success) {
        const rows = response.data.data;
        const grouped = {};

        rows.forEach((row) => {
          // Backend may return day_of_week as "Monday" (string) or a number
          const dayIndex =
            typeof row.day_of_week === "string"
              ? DAY_NAME_TO_INDEX[row.day_of_week]
              : Number(row.day_of_week);

          if (dayIndex === undefined || isNaN(dayIndex)) return; // skip bad rows

          if (!grouped[dayIndex]) grouped[dayIndex] = [];

          grouped[dayIndex].push({
            id: row.id,                         // keep DB id for DELETE
            start: row.start_time.slice(0, 5), // "09:00:00" → "09:00"
            end: row.end_time.slice(0, 5),
          });

          // Use the timezone from the first row that has one
          if (row.timezone && !grouped._tz) {
            grouped._tz = row.timezone;
          }
        });

        if (grouped._tz) {
          setTimezone(grouped._tz);
          delete grouped._tz;
        }

        setAvailability(grouped);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAvailability();
  }, []);

  // ── Toggles & edits ─────────────────────────────────────────────────────────
  const toggleDay = (day) => {
    setAvailability((prev) => {
      const updated = { ...prev };
      if (updated[day]) {
        delete updated[day];
      } else {
        updated[day] = [{ start: "09:00", end: "17:00" }];
      }
      return updated;
    });
  };

  const updateSlot = (day, index, field, value) => {
    setAvailability((prev) => {
      const updated = { ...prev, [day]: [...prev[day]] };
      updated[day][index] = { ...updated[day][index], [field]: value };
      return updated;
    });
  };

  const addSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "09:00", end: "17:00" }],
    }));
  };

  const removeSlot = (day, index) => {
    setAvailability((prev) => {
      const updated = { ...prev };
      updated[day] = updated[day].filter((_, i) => i !== index);
      if (updated[day].length === 0) delete updated[day];
      return updated;
    });
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    for (const day of Object.keys(availability)) {
      const slots = availability[day];

      // 1. Start must be before end
      for (const slot of slots) {
        if (toMinutes(slot.start) >= toMinutes(slot.end)) {
          return `End time must be after start time (${DAY_NAMES[day]})`;
        }
      }

      // 2. No overlaps
      const sorted = [...slots].sort(
        (a, b) => toMinutes(a.start) - toMinutes(b.start)
      );

      for (let i = 0; i < sorted.length - 1; i++) {
        const currentEnd = toMinutes(sorted[i].end);
        const nextStart = toMinutes(sorted[i + 1].start);
        if (currentEnd > nextStart) {
          return `Time slots overlap on ${DAY_NAMES[day]}`;
        }
      }
    }
    return null; // valid
  };

  // ── Save  (DELETE existing → POST fresh) ────────────────────────────────────
  const handleSave = async () => {
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      // 1. Collect every id that currently exists in the DB
      const existingIds = [];
      Object.values(availability).forEach((slots) => {
        slots.forEach((slot) => {
          if (slot.id !== undefined && slot.id !== null) {
            existingIds.push(slot.id);
          }
        });
      });

      // 2. Delete all existing rows in parallel
      if (existingIds.length > 0) {
        await Promise.all(
          existingIds.map((id) =>
            axios.delete(`${backendURL}/api/v1/availability/${id}`)
          )
        );
      }

      // 3. Build fresh payload (no ids — these are all new rows)
      const payload = [];
      Object.keys(availability).forEach((day) => {
        availability[day].forEach((slot) => {
          payload.push({
            day_of_week: Number(day),
            start_time: slot.start,
            end_time: slot.end,
            timezone,
          });
        });
      });

      // 4. POST all fresh slots in parallel
      const responses = await Promise.all(
        payload.map((p) =>
          axios.post(`${backendURL}/api/v1/availability/`, p, {
            headers: { "Content-Type": "application/json" },
          })
        )
      );

      const allOk = responses.every((r) => r.data.success);

      if (allOk) {
        // 5. Reload from server so local state has fresh DB ids
        //    (needed so the NEXT save can delete them correctly)
        await getAvailability();

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError("Some slots failed to save. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-400 flex items-center gap-2">
        <svg
          className="animate-spin h-4 w-4 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        Loading availability…
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Set your weekly recurring hours
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: saved ? "#00A878" : "#006BFF" }}
        >
          {saving ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : saved ? (
            <>
              <Check size={15} />
              Saved!
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <X size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
        {/* TIMEZONE */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Globe size={15} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Timezone</span>
          <select
            className="ml-auto px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none text-gray-700"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* DAYS */}
        <div className="divide-y divide-gray-50">
          {VISIBLE_DAYS.map((day) => {
            const active = !!availability[day];
            const slots = availability[day] || [];

            return (
              <div
                key={day}
                className={`px-5 py-4 transition-colors ${active ? "bg-white" : "bg-gray-50/50"
                  }`}
              >
                <div className="flex items-start gap-4">
                  {/* TOGGLE */}
                  <button
                    onClick={() => toggleDay(day)}
                    className="mt-0.5 w-10 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200"
                    style={{ background: active ? "#006BFF" : "#D1D5DB" }}
                    aria-label={`Toggle ${DAY_NAMES[day]}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${active ? "translate-x-5" : "translate-x-1"
                        }`}
                    />
                  </button>

                  {/* DAY LABEL */}
                  <span
                    className={`text-sm font-semibold w-10 mt-0.5 flex-shrink-0 ${active ? "text-gray-800" : "text-gray-400"
                      }`}
                  >
                    {DAY_LABELS[day]}
                  </span>

                  {/* SLOTS */}
                  {!active ? (
                    <span className="text-sm text-gray-400 mt-0.5">
                      Unavailable
                    </span>
                  ) : (
                    <div className="flex-1 space-y-2">
                      {slots.map((slot, idx) => (
                        <TimeSlotRow
                          key={idx}
                          slot={slot}
                          onChangeStart={(val) =>
                            updateSlot(day, idx, "start", val)
                          }
                          onChangeEnd={(val) =>
                            updateSlot(day, idx, "end", val)
                          }
                          onRemove={() => removeSlot(day, idx)}
                        />
                      ))}

                      <button
                        onClick={() => addSlot(day)}
                        className="flex items-center gap-1 text-xs font-medium hover:underline mt-1"
                        style={{ color: "#006BFF" }}
                      >
                        <Plus size={12} />
                        Add interval
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Time Slot Row ────────────────────────────────────────────────────────────

function TimeSlotRow({ slot, onChangeStart, onChangeEnd, onRemove }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <TimeSelect value={slot.start} onChange={onChangeStart} />
      <span className="text-gray-400 text-sm">–</span>
      <TimeSelect value={slot.end} onChange={onChangeEnd} />
      <button
        onClick={onRemove}
        className="p-1 text-gray-300 hover:text-red-400 transition-colors"
        aria-label="Remove slot"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Time Select ─────────────────────────────────────────────────────────────

function TimeSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none text-gray-700"
    >
      {TIME_OPTIONS.map((t) => (
        <option key={t} value={t}>
          {formatTime(t)}
        </option>
      ))}
    </select>
  );
}