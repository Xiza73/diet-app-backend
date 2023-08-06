import { Router } from "express";
import * as scheduleController from "../controller/schedule.controller";
import passport from "passport";

const scheduleRouter: Router = Router();

scheduleRouter.post(
  "/",
  passport.authenticate("jwt"),
  scheduleController.createSchedule
);
scheduleRouter.get(
  "/",
  passport.authenticate("jwt"),
  scheduleController.getSchedules
);
scheduleRouter.get(
  "/:id",
  passport.authenticate("jwt"),
  scheduleController.getSchedule
);
scheduleRouter.delete(
  "/:id",
  passport.authenticate("jwt"),
  scheduleController.deleteSchedule
);

export default scheduleRouter;
