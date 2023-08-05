import { model, Schema, Document } from "mongoose";
import { Unity } from "../interfaces";

export interface Food extends Document {
  _id: string;
  name: string;
  unity: Unity;
  secondaryUnity: Unity;
}

const FoodSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    unity: {
      type: String,
      required: true,
      trim: true,
      enum: Object.values(Unity),
    },
    secondaryUnity: {
      type: String,
      required: false,
      trim: true,
      enum: Object.values(Unity),
    },
    price: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const FoodModel = model<Food>("Food", FoodSchema);
