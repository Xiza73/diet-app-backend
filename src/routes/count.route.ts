import { Router } from "express";
import * as countController from "../controller/count.controller";
import passport from "passport";

const countRouter: Router = Router();

countRouter.get(
  "/ingredients",
  passport.authenticate("jwt"),
  countController.countIngredients
);

export default countRouter;
