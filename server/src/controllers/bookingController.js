import * as bookingService from "../services/bookingService.js";
import sendEmail from "../utils/sendEmail.js";


// ── Helpers ──────────────────────────────────────────────────────────────────

// Format "13:00:00" → "1:00 PM"
const formatTime = (time24) => {
    if (!time24) return time24;
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h}:${mStr} ${period}`;
};

// Format "2026-05-25" → "Monday, May 25 2026"
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const emailStyles = `
    font-family: Arial, sans-serif;
    max-width: 480px;
    margin: 0 auto;
    padding: 32px 24px;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
`;

const detailBoxStyles = `
    background: #f9fafb;
    border-left: 4px solid #2563eb;
    padding: 16px 20px;
    border-radius: 0 8px 8px 0;
    margin: 16px 0;
`;


// ── CREATE BOOKING ────────────────────────────────────────────────────────────
const createBooking = async (req, res) => {
    try {
        const {
            event_type_id,
            invitee_name,
            invitee_email,
            booking_date,
            start_time,
        } = req.body;

        if (!event_type_id || !invitee_name || !invitee_email || !booking_date || !start_time) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const booking = await bookingService.createBooking({
            event_type_id,
            invitee_name,
            invitee_email,
            booking_date,
            start_time,
        });

        await sendEmail({
            to: invitee_email,
            subject: "Meeting Confirmed ✅",
            html: `
<div style="${emailStyles}">
  <h2 style="color:#2563eb;margin:0 0 8px">Meeting Confirmed</h2>
  <p style="color:#6b7280;margin:0 0 20px">Your meeting has been scheduled successfully.</p>

  <div style="${detailBoxStyles}">
    <p style="margin:0 0 8px"><b>Name:</b> ${booking.invitee_name}</p>
    <p style="margin:0 0 8px"><b>Date:</b> ${formatDate(booking.booking_date)}</p>
    <p style="margin:0 0 8px"><b>Time:</b> ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}</p>
  </div>

  <p style="color:#6b7280;font-size:14px">Thank you for scheduling. See you then!</p>
</div>`,
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });

    } catch (error) {
        // Friendly message for double-booking attempts
        if (error.message === "This time slot is already booked") {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// ── GET ALL BOOKINGS ──────────────────────────────────────────────────────────
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// ── GET BOOKING BY ID ─────────────────────────────────────────────────────────
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await bookingService.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// ── CANCEL BOOKING ────────────────────────────────────────────────────────────
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Delegate entirely to the service (fixes: was using bare `db`, wrong
        // variable names, and duplicating logic that already lives in the service)
        const booking = await bookingService.cancelBooking(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Send cancellation email using fields from the returned booking object
        await sendEmail({
            to: booking.invitee_email,
            subject: "Meeting Cancelled ❌",   // was wrongly "Meeting Confirmed"
            html: `
<div style="${emailStyles}">
  <h2 style="color:#dc2626;margin:0 0 8px">Meeting Cancelled</h2>
  <p style="color:#6b7280;margin:0 0 20px">
    Hello ${booking.invitee_name}, your meeting has been cancelled.
  </p>

  <div style="${detailBoxStyles.replace("#2563eb", "#dc2626")}">
    <p style="margin:0 0 8px"><b>Date:</b> ${formatDate(booking.booking_date)}</p>
    <p style="margin:0 0 8px"><b>Time:</b> ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}</p>
  </div>

  <p style="color:#6b7280;font-size:14px">
    If this was a mistake, please reschedule at your convenience.
  </p>
</div>`,
        });

        res.status(200).json({
            success: true,
            message: "Meeting cancelled successfully",
            data: booking,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// ── GET AVAILABLE SLOTS ───────────────────────────────────────────────────────
const getAvailableSlots = async (req, res) => {
    try {
        const { slug } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date query parameter is required",
            });
        }

        const slots = await bookingService.getAvailableSlots(slug, date);

        res.status(200).json({
            success: true,
            count: slots.length,
            data: slots,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


export {
    createBooking,
    getAllBookings,
    getBookingById,
    cancelBooking,
    getAvailableSlots,
};