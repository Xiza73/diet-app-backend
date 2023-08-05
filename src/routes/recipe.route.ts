import { Router } from "express";
import * as recipeController from "../controller/recipe.controller";

const recipeRouter: Router = Router();

recipeRouter.post("/", recipeController.createRecipe);
recipeRouter.get("/", recipeController.getRecipes);
recipeRouter.get("/:id", recipeController.getRecipe);

export default recipeRouter;
