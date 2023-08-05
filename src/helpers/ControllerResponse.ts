import { NextFunction, Response } from "express";
import { ErrorHandler } from "./ErrorHandler";
import { ResponseBase } from "./ResponseBase";
import { ResponseData } from "./ResponseData";

export const controllerResponse = (
  response: ResponseBase | ResponseData | ErrorHandler,
  res: Response,
  next: NextFunction
) => {
  if ([200, 201].includes(response.statusCode)) return res.json(response);
  next(response);
  return;
};
