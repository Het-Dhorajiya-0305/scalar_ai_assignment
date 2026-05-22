import { Router } from "express";

import * as meetingController from "../controllers/meetingController.js";

const meetingRouter = Router();



meetingRouter.get("/upcoming", meetingController.getUpcomingMeetings);
meetingRouter.get("/past", meetingController.getPastMeetings);
meetingRouter.patch("/:id/reschedule",meetingController.rescheduleMeeting);


export default meetingRouter;