import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Plus, Clock, Video, Calendar, Link, Check, Edit2, Trash2, X, Axis3DIcon } from "lucide-react";
import axios from "axios";
import { backendURL } from "../../App";
import { EventCard, Field, Modal, ModalFooter, ModalHeader } from "./EventCard";
import slugify from "../../utils/slugify.js";



const COLOR_OPTIONS = ["#006BFF", "#00A878", "#7B2FBE", "#F97316", "#EC4899", "#EAB308"];
const DURATION_OPTIONS = [15, 20, 30, 45, 60, 90, 120];

const EMPTY_FORM = { title: "", duration: "30", description: "", color: "#006BFF" };



export default function EventTypesTab() {
  const { eventTypes, openBooking, setEventTypes } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // ── Handlers ─────────────────────────────────

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (et) => {

    setForm({
      title: et.title,
      duration: String(et.duration),
      description: et.description,
      color: et.color,
    });

    setEditId(et.id);

    setShowModal(true);
  };

  const getAllEvents = async () => {

    try {
      const response = await axios.get(
        `${backendURL}/api/v1/events/`
      );

      if (response.data.success) {
        setEventTypes(response.data.data);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const handleSubmit = async () => {

    if (!form.title.trim()) return;

    try {

      const payload = {
        ...form,
        duration: Number(form.duration),
        slug:slugify(form.title),
      };



      // UPDATE EVENT
      if (editId) {

        const response = await axios.put(`${backendURL}/api/v1/events/${editId}`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        }
        );

        if (response.data.success) {

          await getAllEvents();
        }
      }

      // CREATE EVENT
      else {  
        
        const response = await axios.post(
          `${backendURL}/api/v1/events/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          await getAllEvents();
        }
      }

      setShowModal(false);

      setForm(EMPTY_FORM);

      setEditId(null);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {

    try {

      const response = await axios.delete(`${backendURL}/api/v1/events/${id}`);

      if (response.data.success) {
        await getAllEvents();
        setDeleteConfirm(null);
      }


    } catch (error) {
      console.error(error);
    }
  };

  // const handleCopy = (slug, id) => {
  //   navigator.clipboard?.writeText(`https://calendify.app/${slug}`).catch(() => { });
  //   setCopiedId(id);
  //   setTimeout(() => setCopiedId(null), 2000);
  // };


  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // ─────────────────────────────────────────────
  return (
    <div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your booking event types</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: "#006BFF" }}
        >
          <Plus size={16} /> New Event Type
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventTypes.map((et) => (
          <EventCard
            key={et.id}
            et={et}
            copiedId={copiedId}
            onView={() => openBooking(et.slug)}
            onCopy={() => handleCopy(et.slug, et.id)}
            onEdit={() => openEdit(et)}
            onDelete={() => setDeleteConfirm(et.id)}
          />
        ))}

        {/* Ghost "add" card */}
        <button
          onClick={openNew}
          className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all min-h-[180px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
        >
          <Plus size={24} />
          <span className="text-sm font-medium">New Event Type</span>
        </button>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ModalHeader title={editId ? "Edit Event Type" : "New Event Type"} onClose={() => setShowModal(false)} />
          <div className="px-6 py-5 space-y-4">
            <Field label="Event Name">
              <input
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                placeholder="e.g. 30 Minute Strategy Call"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </Field>

            <Field label="Duration (minutes)">
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d} minutes</option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"
                rows={3}
                placeholder="What's this meeting about?"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </Field>

            <Field label="Color">
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setField("color", c)}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      background: c,
                      borderColor: form.color === c ? "#111" : "transparent",
                    }}
                  />
                ))}
              </div>
            </Field>
          </div>
          <ModalFooter
            onCancel={() => setShowModal(false)}
            onConfirm={handleSubmit}
            confirmLabel={editId ? "Save Changes" : "Create Event"}
          />
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} maxWidth="max-w-sm">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Event Type?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
