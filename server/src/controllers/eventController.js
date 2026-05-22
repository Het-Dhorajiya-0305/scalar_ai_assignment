import * as eventTypeService from "../services/eventService.js";


// CREATE EVENT TYPE
const createEventType = async (req, res) => {

  try {
    const { title, slug, duration, description,color } = req.body;

    if (!title || !slug || !duration) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and duration are required",
      });
    }

    const eventType = await eventTypeService.createEventType({
      title,
      slug,
      duration,
      description,
      color
    });

    res.status(201).json({
      success: true,
      message: "Event type created successfully",
      data: eventType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

// GET ALL EVENT TYPES
const getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await eventTypeService.getAllEventTypes();

    res.status(200).json({
      success: true,
      count: eventTypes.length,
      data: eventTypes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
};


// GET SINGLE EVENT TYPE
const getEventTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const eventType = await eventTypeService.getEventTypeById(id);

    if (!eventType) {
      return res.status(404).json({
        success: false,
        message: "Event type not found",
      });
    }

    res.status(200).json({
      success: true,
      data: eventType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// GET EVENT TYPE BY SLUG
const getEventTypeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const eventType = await eventTypeService.getEventTypeBySlug(slug);

    if (!eventType) {
      return res.status(404).json({
        success: false,
        message: "Event type not found",
      });
    }

    res.status(200).json({
      success: true,
      data: eventType,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// UPDATE EVENT TYPE
const updateEventType = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedEventType = await eventTypeService.updateEventType(
      id,
      req.body
    );

    if (!updatedEventType) {
      return res.status(404).json({
        success: false,
        message: "Event type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event type updated successfully",
      data: updatedEventType,
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// DELETE EVENT TYPE
const deleteEventType = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await eventTypeService.deleteEventType(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Event type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event type deleted successfully",
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

export {createEventType,getAllEventTypes,getEventTypeBySlug,getEventTypeById,updateEventType,deleteEventType};