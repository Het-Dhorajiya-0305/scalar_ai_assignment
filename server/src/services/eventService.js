import {pool} from "../config/db.js";

// CREATE EVENT TYPE
const createEventType = async ({
    title,
    slug,
    duration,
    description,
    color
}) => {

    // CHECK IF SLUG ALREADY EXISTS
    const [existingSlug] = await pool.query(
        "SELECT id FROM event_types WHERE slug = ?",
        [slug]
    );

    if (existingSlug.length > 0) {
        throw new Error("Slug already exists");
    }

    // INSERT EVENT TYPE
    const [result] = await pool.query(
        `
      INSERT INTO event_types
      (title, slug, duration, description, color)
      VALUES (?, ?, ?, ?, ?)
    `,
        [title, slug, duration, description || null, color || '#4F46E5']
    );

    // RETURN CREATED EVENT TYPE
    const [newEventType] = await pool.query(
        "SELECT * FROM event_types WHERE id = ?",
        [result.insertId]
    );

    return newEventType[0];
};



// GET ALL EVENT TYPES
const getAllEventTypes = async () => {

    const [eventTypes] = await pool.query(
        `
      SELECT *
      FROM event_types
      ORDER BY created_at DESC
    `
    );

    return eventTypes;
};



// GET EVENT TYPE BY ID
const getEventTypeById = async (id) => {

    const [eventType] = await pool.query(
        `
      SELECT *
      FROM event_types
      WHERE id = ?
    `,
        [id]
    );

    return eventType[0];
};



// GET EVENT TYPE BY SLUG
const getEventTypeBySlug = async (slug) => {

    const [eventType] = await pool.query(
        `
      SELECT *
      FROM event_types
      WHERE slug = ?
    `,
        [slug]
    );

    return eventType[0];
};



// UPDATE EVENT TYPE
const updateEventType = async (id, data) => {

    const { title, slug, duration, description, color } = data;

    // CHECK EVENT TYPE EXISTS
    const [existingEventType] = await pool.query(
        "SELECT * FROM event_types WHERE id = ?",
        [id]
    );

    if (existingEventType.length === 0) {
        return null;
    }

    // CHECK SLUG CONFLICT
    if (slug) {
        const [existingSlug] = await pool.query(
            `
        SELECT id
        FROM event_types
        WHERE slug = ?
        AND id != ?
      `,
            [slug, id]
        );

        if (existingSlug.length > 0) {
            throw new Error("Slug already exists");
        }
    }

    // UPDATE EVENT TYPE
    await pool.query(
        `
      UPDATE event_types
      SET
        title = ?,
        slug = ?,
        duration = ?,
        description = ?,
        color = ?
      WHERE id = ?
    `,
        [
            title,
            slug,
            duration,
            description,
            color,
            id,
        ]
    );

    // RETURN UPDATED EVENT TYPE
    const [updatedEventType] = await pool.query(
        "SELECT * FROM event_types WHERE id = ?",
        [id]
    );

    return updatedEventType[0];
};



// DELETE EVENT TYPE
const deleteEventType = async (id) => {

    // CHECK EVENT TYPE EXISTS
    const [existingEventType] = await pool.query(
        "SELECT * FROM event_types WHERE id = ?",
        [id]
    );

    if (existingEventType.length === 0) {
        return false;
    }

    // DELETE EVENT TYPE
    await pool.query(
        "DELETE FROM event_types WHERE id = ?",
        [id]
    );

    return true;
};



export { createEventType, getAllEventTypes, getEventTypeById, getEventTypeBySlug, updateEventType, deleteEventType }