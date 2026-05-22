import { pool } from "../config/db.js";
import * as meetingService from "../services/meetingService.js";
import sendEmail from "../utils/sendEmail.js";



// GET UPCOMING MEETINGS
const getUpcomingMeetings = async (req, res) => {
    try {

        const meetings = await meetingService.getUpcomingMeetings();

        res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};



// GET PAST MEETINGS
const getPastMeetings = async (req, res) => {
    try {

        const meetings = await meetingService.getPastMeetings();

        res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


const rescheduleMeeting = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const {
            booking_date,
            start_time,
        } = req.body;

        const [meeting] = await pool.query(
            `
      SELECT *
      FROM bookings
      WHERE id = ?
      `,
            [id]
        );

        if (!meeting.length) {

            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        await pool.query(
            `
      UPDATE bookings
      SET booking_date = ?,
          start_time = ?
      WHERE id = ?
      `,
            [
                booking_date,
                start_time,
                id,
            ]
        );

        const booking = meeting[0];

        await sendEmail({
            to: booking.invitee_email,

            subject: "Meeting Rescheduled",

            html: `
        <h2>Meeting Rescheduled</h2>

        <p>Hello ${booking.invitee_name},</p>

        <p>Your meeting has been rescheduled.</p>

        <p>
          <b>New Date:</b> ${booking_date}
        </p>

        <p>
          <b>New Time:</b> ${start_time}
        </p>
      `,
        });

        res.status(200).json({
            success: true,
            message: "Meeting rescheduled",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};



export { getUpcomingMeetings, getPastMeetings, rescheduleMeeting };