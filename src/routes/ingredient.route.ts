import { Router } from "express";
import * as ingredientController from "../controller/ingredient.controller";
import passport from "passport";

const ingredientRouter: Router = Router();

ingredientRouter.post(
  "/",
  passport.authenticate("jwt"),
  ingredientController.createIngredient
);
ingredientRouter.get(
  "/:id",
  passport.authenticate("jwt"),
  ingredientController.getIngredient
);

export default ingredientRouter;
