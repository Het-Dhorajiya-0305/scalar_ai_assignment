import { Router } from "express";
import * as bookingController from "../controllers/bookingController.js";
const bookingRouter = Router()


bookingRouter.post("/", bookingController.createBooking);
bookingRouter.get("/", bookingController.getAllBookings);
bookingRouter.get("/slots/:slug", bookingController.getAvailableSlots);
bookingRouter.get("/:id", bookingController.getBookingById);
bookingRouter.patch("/:id/cancel", bookingController.cancelBooking);


export default bookingRouter;