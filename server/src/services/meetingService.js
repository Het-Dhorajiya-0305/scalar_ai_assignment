import { pool } from "../config/db.js";



// GET UPCOMING MEETINGS
const getUpcomingMeetings = async () => {

    const [meetings] = await pool.query(
        `
        SELECT
            bookings.*,
            event_types.title AS event_title,
            event_types.duration,
            event_types.slug AS event_slug
        FROM bookings
        JOIN event_types
        ON bookings.event_type_id = event_types.id
        WHERE
            booking_date >= CURDATE()
            AND bookings.status = 'scheduled'
        ORDER BY
            booking_date ASC,
            start_time ASC
        `
    );

    return meetings;
};



// GET PAST MEETINGS
const getPastMeetings = async () => {

    const [meetings] = await pool.query(
        `
        SELECT
            bookings.*,
            event_types.title AS event_title,
            event_types.duration,
            event_types.slug AS event_slug
        FROM bookings
        JOIN event_types
        ON bookings.event_type_id = event_types.id
        WHERE
            booking_date < CURDATE()
        ORDER BY
            booking_date DESC,
            start_time DESC
        `
    );

    return meetings;
};



// CANCEL MEETING
const cancelMeeting = async (id) => {

    const [existingMeeting] = await pool.query(
        `
        SELECT *
        FROM bookings
        WHERE id = ?
        `,
        [id]
    );

    if (existingMeeting.length === 0) {
        return null;
    }

    await pool.query(
        `
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = ?
        `,
        [id]
    );

    const [updatedMeeting] = await pool.query(
        `
        SELECT *
        FROM bookings
        WHERE id = ?
        `,
        [id]
    );

    return updatedMeeting[0];
};


const rescheduleMeeting = async (
    id,
    booking_date,
    start_time
) => {

    await pool.query(
        `
      UPDATE bookings
      SET
        booking_date = ?,
        start_time = ?
      WHERE id = ?
      `,
        [
            booking_date,
            start_time,
            id,
        ]
    );

    return true;
};

export { getUpcomingMeetings, getPastMeetings, cancelMeeting, rescheduleMeeting }