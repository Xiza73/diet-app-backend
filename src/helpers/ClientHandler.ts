import { NextFunction, Response, Request } from "express";
import { ErrorHandler } from "./ErrorHandler";
import { isValidObjectId } from "mongoose";
import { getClientId } from "../utils";

type Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>>>;

export const clientMiddleware = (handler: Handler): Handler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const clientId = getClientId(req);

    if (!clientId) {
      next(new ErrorHandler(400, "Missing client-id"));
      return;
    }
    if (!isValidObjectId(clientId)) {
      next(new ErrorHandler(400, "Invalid id"));
      return;
    }

    return handler(req, res, next);
  };
};
