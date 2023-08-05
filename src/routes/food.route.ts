import { Router } from "express";
import * as foodController from "../controller/food.controller";

const foodRouter: Router = Router();

foodRouter.post("/", foodController.createFood);
foodRouter.get("/", foodController.getFoods);
foodRouter.get("/:id", foodController.getFood);

export default foodRouter;
