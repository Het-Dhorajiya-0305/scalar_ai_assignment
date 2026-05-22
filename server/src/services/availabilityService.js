import { pool } from "../config/db.js";


// CREATE AVAILABILITY
const createAvailability = async ({ day_of_week, start_time, end_time, timezone }) => {


    if (start_time >= end_time) {
        throw new Error("Start time must be before end time");
    }


    const [result] = await pool.query(
        `
        INSERT INTO availability
        (
            day_of_week,
            start_time,
            end_time,
            timezone
        )
        VALUES (?, ?, ?, ?)
        `,
        [day_of_week, start_time, end_time, timezone || "Asia/Kolkata"]
    );

    const [availability] = await pool.query(
        `
        SELECT *
        FROM availability
        WHERE id = ?
        `,
        [result.insertId]
    );

    return availability[0];
};



// GET ALL AVAILABILITY
const getAllAvailability = async () => {

    const [availability] = await pool.query(
        `
        SELECT *
        FROM availability
        ORDER BY FIELD(
            day_of_week,
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        )
        `
    );

    return availability;
};



// GET AVAILABILITY BY ID
const getAvailabilityById = async (id) => {

    const [availability] = await pool.query(
        `
        SELECT *
        FROM availability
        WHERE id = ?
        `,
        [id]
    );

    return availability[0];
};



// UPDATE AVAILABILITY
const updateAvailability = async (id, data) => {

    const { day_of_week, start_time, end_time, timezone } = data;

    console.log(day_of_week);

    // CHECK AVAILABILITY EXISTS
    const [existingAvailability] = await pool.query(
        `
        SELECT *
        FROM availability
        WHERE id = ?
        `,
        [id]
    );

    if (existingAvailability.length === 0) {
        return null;
    }

    if (start_time >= end_time) {
        throw new Error("Start time must be before end time");
    }


    await pool.query(
        `
        UPDATE availability
        SET
            day_of_week = ?,
            start_time = ?,
            end_time = ?,
            timezone = ?
        WHERE id = ?
        `,
        [
            day_of_week,
            start_time,
            end_time,
            timezone,
            id,
        ]
    );

    const [updatedAvailability] = await pool.query(
        `
        SELECT *
        FROM availability
        WHERE id = ?
        `,
        [id]
    );

    return updatedAvailability[0];
};



// DELETE AVAILABILITY
const deleteAvailability = async (id) => {

    const [existingAvailability] = await pool.query(
        `
        SELECT *
        FROM availability
        WHERE id = ?
        `,
        [id]
    );

    if (existingAvailability.length === 0) {
        return false;
    }

    await pool.query(
        `
        DELETE FROM availability
        WHERE id = ?
        `,
        [id]
    );

    return true;
};


export { createAvailability, getAllAvailability, getAvailabilityById, updateAvailability, deleteAvailability };