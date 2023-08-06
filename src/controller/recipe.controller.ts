import { NextFunction, Request, Response } from "express";
import * as recipeService from "../dao/recipe.dao";
import { controllerResponse } from "../helpers";
import { clientMiddleware } from "../helpers/ClientHandler";
import { getClientId } from "../utils";

export const createRecipe = clientMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, foodIds, quantities, secondaryQuantities } =
      req.body;

    const response = await recipeService.createRecipe({
      name,
      description,
      foodIds,
      quantities,
      secondaryQuantities,
      clientId: getClientId(req),
    });

    return controllerResponse(response, res, next);
  }
);

export const getRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const response = await recipeService.getRecipe({ id });

  return controllerResponse(response, res, next);
};

export const getRecipes = clientMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const response = await recipeService.getRecipes({
      page: Number(page),
      limit: Number(limit),
      clientId: getClientId(req),
    });

    return controllerResponse(response, res, next);
  }
);
