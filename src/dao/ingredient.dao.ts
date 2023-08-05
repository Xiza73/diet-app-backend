import { isValidObjectId } from "mongoose";
import { ErrorHandler, ResponseBase, ResponseData } from "../helpers";
import { IngredientModel } from "../models";
import { createObjectId } from "../config";

export const createIngredient = async ({
  foodId,
  quantity,
  secondaryQuantity,
}: {
  foodId: string;
  quantity: number;
  secondaryQuantity: number;
}) => {
  try {
    if (!foodId || !quantity)
      return new ErrorHandler(400, "Missing required fields");

    if (!isValidObjectId(foodId))
      return new ErrorHandler(400, "Invalid food id");

    const ingredient = new IngredientModel({
      food: createObjectId(foodId),
      quantity,
      secondaryQuantity,
    });
    await ingredient.save();

    return new ResponseBase(200, "Ingredient created successfully");
  } catch (error) {
    return new ErrorHandler(500, error?.message || "Error creating ingredient");
  }
};

export const getIngredient = async ({ id }: { id: string }) => {
  try {
    const ingredient = await IngredientModel.findById(id).populate("food");

    if (!ingredient) return new ErrorHandler(400, "Ingredient not found");

    return new ResponseData(200, "Ingredient found", {
      id: ingredient._id,
      foodId: ingredient.food._id,
      name: ingredient.food.name,
      quantity: ingredient.quantity,
      secondaryQuantity: ingredient.secondaryQuantity,
      unity: ingredient.food.unity,
      secondaryUnity: ingredient.food.secondaryUnity,
    });
  } catch (error) {
    return new ErrorHandler(500, error?.message || "Error getting ingredient");
  }
};
