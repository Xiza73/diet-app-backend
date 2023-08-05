import { Router } from "express";
import * as scheduleController from "../controller/schedule.controller";

const scheduleRouter: Router = Router();

scheduleRouter.post("/", scheduleController.createSchedule);
scheduleRouter.get("/", scheduleController.getSchedules);
scheduleRouter.get("/:id", scheduleController.getSchedule);
scheduleRouter.delete("/:id", scheduleController.deleteSchedule);

export default scheduleRouter;