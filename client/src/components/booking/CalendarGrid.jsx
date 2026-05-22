import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import axios from "axios";

import { backendURL } from "../../App";

import {
  MONTH_NAMES,
  getDaysInMonth,
  getFirstDayOfMonth,
  isDatePast,
  formatTime,
  formatMonthDay,
  buildDateStr,
  toDateStr,
} from "../../utils/timeHelpers";



const DAYS = [
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
  "Su",
];



export default function CalendarGrid({
  event,
  selectedDate,
  onDateSelect,
  onSlotSelect,
}) {

  const today = new Date();



  const [calYear, setCalYear] =
    useState(
      today.getFullYear()
    );

  const [calMonth, setCalMonth] =
    useState(
      today.getMonth()
    );



  const [availableSlots, setAvailableSlots] =
    useState([]);

  const [loadingSlots, setLoadingSlots] =
    useState(false);



  const daysInMonth =
    getDaysInMonth(
      calYear,
      calMonth
    );

  const firstDay =
    getFirstDayOfMonth(
      calYear,
      calMonth
    );

  const todayStr =
    toDateStr(today);



  // LOAD AVAILABLE SLOTS
  const getAvailableSlots =
    async () => {

      if (!selectedDate) return;

      try {

        setLoadingSlots(true);

        const response =
          await axios.get(
            `${backendURL}/api/v1/booking/slots/${event.slug}?date=${selectedDate}`
          );



        if (
          response.data.success
        ) {

          setAvailableSlots(
            response.data.data
          );
        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoadingSlots(false);
      }
    };



  // LOAD SLOTS WHEN DATE CHANGES
  useEffect(() => {

    getAvailableSlots();

  }, [selectedDate]);



  // PREVIOUS MONTH
  const prevMonth = () => {

    if (calMonth === 0) {

      setCalYear((y) => y - 1);

      setCalMonth(11);

    } else {

      setCalMonth((m) => m - 1);
    }
  };



  // NEXT MONTH
  const nextMonth = () => {

    if (calMonth === 11) {

      setCalYear((y) => y + 1);

      setCalMonth(0);

    } else {

      setCalMonth((m) => m + 1);
    }
  };



  return (

    <div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">

        <h2 className="font-semibold text-gray-900">
          {MONTH_NAMES[calMonth]} {calYear}
        </h2>



        <div className="flex gap-1">

          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>



          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronRight size={16} />
          </button>

        </div>

      </div>



      <div className="flex gap-4">

        {/* CALENDAR */}
        <div className="flex-1">

          {/* WEEK DAYS */}
          <div className="grid grid-cols-7 mb-2">

            {DAYS.map((d) => (

              <div
                key={d}
                className="text-center text-xs font-medium text-gray-400 py-1"
              >
                {d}
              </div>

            ))}

          </div>



          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-0.5">

            {Array.from({
              length: firstDay,
            }).map((_, i) => (

              <div key={i} />

            ))}



            {Array.from({
              length: daysInMonth,
            }).map((_, i) => {

              const day = i + 1;

              const dateStr =
                buildDateStr(
                  calYear,
                  calMonth,
                  day
                );

              const isPast =
                isDatePast(dateStr);

              const isSelected =
                selectedDate === dateStr;

              const isToday =
                dateStr === todayStr;



              return (

                <DayCell
                  key={day}
                  day={day}
                  disabled={isPast}
                  isSelected={isSelected}
                  isToday={isToday}
                  accentColor={event.color}
                  onClick={() =>
                    !isPast &&
                    onDateSelect(dateStr)
                  }
                />

              );
            })}

          </div>

        </div>



        {/* SLOT PANEL */}
        {selectedDate && (

          <TimeSlotPanel
            selectedDate={selectedDate}
            slots={availableSlots}
            loading={loadingSlots}
            accentColor={event.color}
            onSelect={onSlotSelect}
          />

        )}

      </div>

    </div>
  );
}



function DayCell({
  day,
  disabled,
  isSelected,
  isToday,
  accentColor,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      disabled={disabled}
      className={`aspect-square rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center ${disabled ? "text-gray-200 cursor-not-allowed" : "hover:scale-105"} ${isSelected ? "text-white shadow-md scale-105" : ""} ${isToday && !isSelected ? "ring-2 font-bold" : ""}`}
      style={{
        background:
          isSelected
            ? accentColor
            : undefined,

        color:
          isSelected
            ? "white"
            : undefined,
      }}
    >
      {day}
    </button>
  );
}



function TimeSlotPanel({
  selectedDate,
  slots,
  loading,
  accentColor,
  onSelect,
}) {

  console.log("Available slots for", selectedDate, slots);

  return (

    <div className="w-36 flex-shrink-0">

      <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
        {formatMonthDay(selectedDate)}
      </p>



      {loading ? (

        <p className="text-xs text-gray-400 text-center py-4">
          Loading...
        </p>

      ) : slots.length === 0 ? (

        <p className="text-xs text-gray-400 text-center py-4">
          No slots available
        </p>

      ) : (

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">

          {slots.map((slot) => (

            <button
              key={slot}
              onClick={() =>
                onSelect(slot)
              }
              className="w-full py-2.5 px-3 text-sm font-medium rounded-lg border-2 transition-all duration-150"
              style={{
                borderColor:
                  accentColor,

                color:
                  accentColor,
              }}
            >
              {formatTime(slot)}
            </button>

          ))}

        </div>

      )}

    </div>
  );
}