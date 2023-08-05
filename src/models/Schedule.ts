import { model, Schema, Document } from "mongoose";
import { Recipe } from ".";
import { ObjectId } from "../config";
import { ScheduleType } from "../interfaces";

export interface Schedule extends Document {
  _id: string;
  recipe: Recipe;
  scheduleType: ScheduleType[];
  date: Date;
}

const ScheduleSchema: Schema = new Schema(
  {
    recipe: {
      type: ObjectId,
      ref: "Recipe",
      required: true,
    },
    scheduleType: {
      type: String,
      required: true,
      enum: Object.values(ScheduleType),
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ScheduleModel = model<Schedule>("Schedule", ScheduleSchema);
