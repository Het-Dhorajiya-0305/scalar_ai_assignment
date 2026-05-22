import * as availabilityService from "../services/availabilityService.js";


// CREATE AVAILABILITY
const createAvailability = async (req, res) => {
    try {

        const { day_of_week, start_time, end_time, timezone } = req.body;

        if (!day_of_week || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Day, start time and end time are required",
            });
        }

        const availability = await availabilityService.createAvailability({ day_of_week, start_time, end_time, timezone });

        res.status(201).json({
            success: true,
            message: "Availability created successfully",
            data: availability,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
};



// GET ALL AVAILABILITY
const getAllAvailability = async (req, res) => {
    try {

        const availability = await availabilityService.getAllAvailability();

        res.status(200).json({
            success: true,
            count: availability.length,
            data: availability,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
};



// GET AVAILABILITY BY ID
const getAvailabilityById = async (req, res) => {
    try {
        const { id } = req.params;

        const availability = await availabilityService.getAvailabilityById(id);

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: "Availability not found",
            });
        }

        res.status(200).json({
            success: true,
            data: availability,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
};



// UPDATE AVAILABILITY
const updateAvailability = async (req, res) => {
    try {

        const { id } = req.params;
        const updatedAvailability = await availabilityService.updateAvailability(id, req.body);

        if (!updatedAvailability) {
            return res.status(404).json({
                success: false,
                message: "Availability not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Availability updated successfully",
            data: updatedAvailability,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
};



// DELETE AVAILABILITY
const deleteAvailability = async (req, res) => {
    try {

        const { id } = req.params;

        const deleted = await availabilityService.deleteAvailability(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Availability not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Availability deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
};



export {
    createAvailability,
    getAllAvailability,
    getAvailabilityById,
    updateAvailability,
    deleteAvailability,
};