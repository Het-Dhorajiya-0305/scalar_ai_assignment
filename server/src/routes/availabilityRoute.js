import { Router } from "express";
import * as availabilityController from "../controllers/availabilityController.js";


const availabilityRouter = Router();

availabilityRouter.post("/", availabilityController.createAvailability);
availabilityRouter.get("/", availabilityController.getAllAvailability);
availabilityRouter.get("/:id", availabilityController.getAvailabilityById);
availabilityRouter.put("/:id", availabilityController.updateAvailability);
availabilityRouter.delete("/:id", availabilityController.deleteAvailability);


export default availabilityRouter;