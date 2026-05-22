import { pool } from "../config/db.js";


// ── CREATE BOOKING ────────────────────────────────────────────────────────────
const createBooking = async ({
    event_type_id,
    invitee_name,
    invitee_email,
    booking_date,
    start_time,
}) => {
    // 1. Verify event type exists
    const [eventType] = await pool.query(
        `SELECT * FROM event_types WHERE id = ?`,
        [event_type_id]
    );

    if (eventType.length === 0) {
        throw new Error("Event type not found");
    }

    const duration = eventType[0].duration;

    // 2. Compute end_time from start_time + duration
    const [hours, minutes] = start_time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours   = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    const end_time   = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}:00`;

    // 3. Check for duplicate booking
    const [existingBooking] = await pool.query(
        `SELECT id FROM bookings
         WHERE booking_date = ?
         AND start_time = ?
         AND status = 'scheduled'`,
        [booking_date, start_time]
    );

    if (existingBooking.length > 0) {
        throw new Error("This time slot is already booked");
    }

    // 4. Insert — status defaults to 'scheduled' in the column definition
    //    but we set it explicitly to fix rows that were saved with NULL status
    const [result] = await pool.query(
        `INSERT INTO bookings
         (event_type_id, invitee_name, invitee_email, booking_date, start_time, end_time, status)
         VALUES (?, ?, ?, ?, ?, ?, 'scheduled')`,
        [event_type_id, invitee_name, invitee_email, booking_date, start_time, end_time]
    );

    // 5. Return the full row
    const [booking] = await pool.query(
        `SELECT * FROM bookings WHERE id = ?`,
        [result.insertId]
    );

    return booking[0];
};


// ── GET ALL BOOKINGS ──────────────────────────────────────────────────────────
const getAllBookings = async () => {
    const [bookings] = await pool.query(
        `SELECT
            bookings.*,
            event_types.title    AS event_title,
            event_types.duration AS event_duration
         FROM bookings
         JOIN event_types ON bookings.event_type_id = event_types.id
         ORDER BY booking_date DESC, start_time ASC`
    );

    return bookings;
};


// ── GET BOOKING BY ID ─────────────────────────────────────────────────────────
const getBookingById = async (id) => {
    const [booking] = await pool.query(
        `SELECT
            bookings.*,
            event_types.title    AS event_title,
            event_types.duration AS event_duration
         FROM bookings
         JOIN event_types ON bookings.event_type_id = event_types.id
         WHERE bookings.id = ?`,
        [id]
    );

    return booking[0] || null;
};


// ── CANCEL BOOKING ────────────────────────────────────────────────────────────
const cancelBooking = async (id) => {
    // 1. Fetch the booking first (need it to send the email in the controller)
    const [existing] = await pool.query(
        `SELECT * FROM bookings WHERE id = ?`,
        [id]
    );

    if (existing.length === 0) return null;

    // 2. Update status
    await pool.query(
        `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
        [id]
    );

    // 3. Return updated row
    const [updated] = await pool.query(
        `SELECT * FROM bookings WHERE id = ?`,
        [id]
    );

    return updated[0];
};


// ── GET AVAILABLE SLOTS ───────────────────────────────────────────────────────
const getAvailableSlots = async (slug, date) => {
    // 1. Fetch event type
    const [eventType] = await pool.query(
        `SELECT * FROM event_types WHERE slug = ?`,
        [slug]
    );

    if (eventType.length === 0) {
        throw new Error("Event type not found");
    }

    const duration = eventType[0].duration; // minutes

    // 2. Resolve day name  e.g. "Monday"
    const dayName = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
    });

    // 3. All availability intervals for that day
    const [availabilityRows] = await pool.query(
        `SELECT start_time, end_time
         FROM availability
         WHERE day_of_week = ?
         ORDER BY start_time ASC`,
        [dayName]
    );

    if (availabilityRows.length === 0) return [];

    // 4. All booked slots for that date in one query (no per-slot DB calls)
    const [bookedRows] = await pool.query(
        `SELECT start_time
         FROM bookings
         WHERE booking_date = ?
         AND status = 'scheduled'`,
        [date]
    );

    const bookedSet = new Set(bookedRows.map((b) => b.start_time));

    // 5. Generate slots across every interval
    const slots = [];

    for (const interval of availabilityRows) {
        let current = new Date(`1970-01-01T${interval.start_time}`);
        const end   = new Date(`1970-01-01T${interval.end_time}`);

        while (current < end) {
            const hh   = String(current.getHours()).padStart(2, "0");
            const mm   = String(current.getMinutes()).padStart(2, "0");
            const slot = `${hh}:${mm}:00`;

            if (!bookedSet.has(slot)) {
                slots.push(slot);
            }

            current.setMinutes(current.getMinutes() + duration);
        }
    }

    return slots;
};


export {
    createBooking,
    getAllBookings,
    getBookingById,
    cancelBooking,
    getAvailableSlots,
};