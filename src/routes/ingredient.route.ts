import { Router } from "express";
import * as ingredientController from "../controller/ingredient.controller";

const ingredientRouter: Router = Router();

ingredientRouter.post("/", ingredientController.createIngredient);
ingredientRouter.get("/:id", ingredientController.getIngredient);

export default ingredientRouter;
