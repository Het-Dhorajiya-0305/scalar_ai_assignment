import Router from "express";
import * as eventTypeController from "../controllers/eventController.js";


const eventRouter = Router();

eventRouter.post("/", eventTypeController.createEventType);


// GET ALL EVENT TYPES
eventRouter.get("/",eventTypeController.getAllEventTypes);


// GET EVENT TYPE BY SLUG
eventRouter.get("/slug/:slug",eventTypeController.getEventTypeBySlug);


// GET EVENT TYPE BY ID
eventRouter.get("/:id",eventTypeController.getEventTypeById);


// UPDATE EVENT TYPE
eventRouter.put("/:id",eventTypeController.updateEventType);


// DELETE EVENT TYPE
eventRouter.delete("/:id",eventTypeController.deleteEventType);


export default eventRouter;