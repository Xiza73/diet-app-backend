import { Request } from "express";

export const isValidToken = (input: string): boolean => {
  const regex = /^[A-Za-z0-9]{16}$/;
  return regex.test(input);
};

export const getClientId = (req: Request): string =>
  req.headers["client-id"]?.toString() || "";
