import { Plus, Clock, Video, Calendar, Link, Check, Edit2, Trash2, X, Axis3DIcon } from "lucide-react";


function EventCard({ et, copiedId, onView, onCopy, onEdit, onDelete }) {

    const color = (et && et.color) ? et.color : "#006BFF";
    
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-1.5 w-full" style={{ background: color }} />
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-base">{et.title}</h3>
                        <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                            <Clock size={13} />
                            <span>{et.duration} min</span>
                        </div>
                    </div>
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}18` }}
                    >
                        <Video size={16} style={{ color }} />
                    </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{et.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={onView}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity "
                        style={{ background: color }}
                    >
                        <Calendar size={12} /> View Page
                    </button>

                    <button
                        onClick={onCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        {copiedId === et.id ? (
                            <><Check size={12} className="text-green-500" /> Copied!</>
                        ) : (
                            <><Link size={12} /> Copy Link</>
                        )}
                    </button>

                    <button
                        onClick={onEdit}
                        className="ml-auto p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Modal({ children, onClose, maxWidth = "max-w-md" }) {
    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

function ModalHeader({ title, onClose }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
}

function ModalFooter({ onCancel, onConfirm, confirmLabel }) {
    return (
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
            <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: "#006BFF" }}
            >
                {confirmLabel}
            </button>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            {children}
        </div>
    );
}


export { EventCard, Modal, ModalFooter, ModalHeader, Field };