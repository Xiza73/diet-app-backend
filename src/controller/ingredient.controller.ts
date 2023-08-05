import { Request, Response, NextFunction } from "express";
import * as ingredientService from "../dao/ingredient.dao";
import { controllerResponse } from "../helpers";

export const createIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodId, quantity, secondaryQuantity } = req.body;

  const response = await ingredientService.createIngredient({
    foodId,
    quantity,
    secondaryQuantity,
  });

  return controllerResponse(response, res, next);
};

export const getIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const response = await ingredientService.getIngredient({ id });

  return controllerResponse(response, res, next);
};
