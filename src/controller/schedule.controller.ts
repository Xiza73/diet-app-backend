import { NextFunction, Request, Response } from "express";
import * as scheduleService from "../dao/schedule.dao";
import { controllerResponse } from "../helpers";
import { clientMiddleware } from "../helpers/ClientHandler";
import { getClientId } from "../utils";

export const createSchedule = clientMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const { recipeIds, scheduleType, date } = req.body;

    const response = await scheduleService.createSchedule({
      recipeIds,
      clientId: getClientId(req),
      scheduleType,
      date,
    });

    return controllerResponse(response, res, next);
  }
);

export const getSchedules = clientMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const startDate = new Date(query?.startDate?.toString());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(query?.endDate?.toString());
    endDate.setHours(23, 59, 59, 999);

    const response = await scheduleService.getSchedules({
      ...(query?.startDate && { startDate }),
      ...(query?.endDate && { endDate }),
      clientId: getClientId(req),
    });

    return controllerResponse(response, res, next);
  }
);

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
