import { model, Schema, Document } from "mongoose";
import { Ingredient } from ".";
import { ObjectId } from "../config";

export interface Recipe extends Document {
  _id: string;
  ingredients: Ingredient[];
  name: string;
  description: string;
}

const RecipeSchema: Schema = new Schema(
  {
    ingredients: [
      {
        type: ObjectId,
        ref: "Ingredient",
        required: true,
      },
    ],
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const RecipeModel = model<Recipe>("Recipe", RecipeSchema);
