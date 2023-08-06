import { NextFunction, Request, Response } from "express";
import * as authService from "../dao/auth.dao";
import { controllerResponse } from "../helpers";
import { clientMiddleware } from "../helpers/ClientHandler";
import { getClientId } from "../utils";

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  const response = await authService.signIn(body);

  return controllerResponse(response, res, next);
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  const response = await authService.signUp(body);

  return controllerResponse(response, res, next);
};

export const refreshToken = clientMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await authService.refreshToken(getClientId(req));

    return controllerResponse(response, res, next);
  }
);
