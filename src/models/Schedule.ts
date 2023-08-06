import { model, Schema, Document } from "mongoose";
import { Client, Recipe } from ".";
import { ObjectId } from "../config";
import { ScheduleType } from "../interfaces";

export interface Schedule extends Document {
  _id: string;
  recipes: Recipe[];
  client: Client;
  scheduleType: ScheduleType[];
  date: Date;
}

const ScheduleSchema: Schema = new Schema(
  {
    recipes: [
      {
        type: ObjectId,
        ref: "Recipe",
        required: true,
      },
    ],
    client: { type: ObjectId, ref: "Client", required: true },
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
