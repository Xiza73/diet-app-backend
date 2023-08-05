import { Schema, Types } from "mongoose";
import { ErrorHandler } from "../helpers";

export const ObjectId = Schema.Types.ObjectId;
export const createObjectId = (id: string) => {
  try {
    return new Types.ObjectId(id);
  } catch (error) {
    throw new ErrorHandler(400, "Invalid ObjectId");
  }
};
