import { NextFunction, Request, Response } from "express";
import * as foodService from "../dao/food.dao";
import { controllerResponse } from "../helpers";

export const createFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, unity, secondaryUnity, price } = req.body;

  const response = await foodService.createFood({
    name,
    unity,
    secondaryUnity,
    price
  });

  return controllerResponse(response, res, next);
};

export const getFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const response = await foodService.getFood({ id });

  return controllerResponse(response, res, next);
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit } = req.query;
  const response = await foodService.getFoods({
    page: Number(page),
    limit: Number(limit),
  });

  return controllerResponse(response, res, next);
};
