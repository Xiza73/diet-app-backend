import { Router } from "express";
import * as foodController from "../controller/food.controller";
import passport from "passport";

const foodRouter: Router = Router();

foodRouter.post("/", passport.authenticate("jwt"), foodController.createFood);
foodRouter.get("/", passport.authenticate("jwt"), foodController.getFoods);
foodRouter.get("/:id", passport.authenticate("jwt"), foodController.getFood);

export default foodRouter;
