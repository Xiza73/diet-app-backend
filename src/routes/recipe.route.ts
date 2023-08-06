import { Router } from "express";
import * as recipeController from "../controller/recipe.controller";
import passport from "passport";

const recipeRouter: Router = Router();

recipeRouter.post(
  "/",
  passport.authenticate("jwt"),
  recipeController.createRecipe
);
recipeRouter.get(
  "/",
  passport.authenticate("jwt"),
  recipeController.getRecipes
);
recipeRouter.get(
  "/:id",
  passport.authenticate("jwt"),
  recipeController.getRecipe
);

export default recipeRouter;
