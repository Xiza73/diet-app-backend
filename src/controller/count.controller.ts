import { NextFunction, Request, Response } from "express";
import * as countService from "../dao/count.dao";
import { controllerResponse } from "../helpers";
import { clientMiddleware } from "../helpers/ClientHandler";
import { getClientId } from "../utils";

export const countIngredients = clientMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const startDate = new Date(query?.startDate?.toString());
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(query?.endDate?.toString());
    endDate.setHours(23, 59, 59, 999);

    const response = await countService.countIngredients({
      ...(query?.startDate && { startDate }),
      ...(query?.endDate && { endDate }),
      clientId: getClientId(req),
    });

    return controllerResponse(response, res, next);
  }
);
