import { model, Schema, Document } from "mongoose";
import { Food } from "./Food";
import { ObjectId } from "../config";

export interface Ingredient extends Document {
  _id: string;
  food: Food;
  quantity: number;
  secondaryQuantity: number;
}

const IngredientSchema: Schema = new Schema(
  {
    food: { type: ObjectId, ref: "Food", required: true },
    quantity: { type: Number, required: true },
    secondaryQuantity: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const IngredientModel = model<Ingredient>(
  "Ingredient",
  IngredientSchema
);
