import { NextFunction, Request, Response } from "express";
import * as scheduleService from "../dao/schedule.dao";
import { controllerResponse } from "../helpers";

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { recipeId, scheduleType, date } = req.body;

  const response = await scheduleService.createSchedule({
    recipeId,
    scheduleType,
    date,
  });

  return controllerResponse(response, res, next);
};

export const getSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;
  const startDate = new Date(query?.startDate?.toString());
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(query?.endDate?.toString());
  endDate.setHours(23, 59, 59, 999);

  const response = await scheduleService.getSchedules({
    ...(query?.startDate && { startDate }),
    ...(query?.endDate && { endDate }),
  });

  return controllerResponse(response, res, next);
};

export const getSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const response = await scheduleService.getSchedule({ id });

  return controllerResponse(response, res, next);
};

export const deleteSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const response = await scheduleService.deleteSchedule({ id });

  return controllerResponse(response, res, next);
};
