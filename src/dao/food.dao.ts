import { isValidObjectId } from "mongoose";
import { ErrorHandler, ResponseBase, ResponseData } from "../helpers";
import { Unity } from "../interfaces";
import { FoodModel } from "../models";

export const createFood = async ({
  name,
  unity,
  secondaryUnity,
  price,
}: {
  name: string;
  unity: Unity;
  secondaryUnity: Unity;
  price?: number;
}) => {
  try {
    if (!name || !unity) return new ErrorHandler(400, "Missing required fields");

    const food = new FoodModel({
      name,
      unity,
      secondaryUnity,
      ...(price && { price }),
    });
    await food.save();

    return new ResponseBase(200, "Food created successfully");
  } catch (error) {
    return new ErrorHandler(500, error?.message || "Error creating food");
  }
};

export const getFood = async ({ id }: { id: string }) => {
  try {
    if (!id) return new ErrorHandler(400, "Missing required fields");
    if (!isValidObjectId(id)) return new ErrorHandler(400, "Invalid ObjectId");

    const food = await FoodModel.findById(id);

    if (!food) return new ErrorHandler(400, "Food not found");

    return new ResponseData(200, "Food found", food);
  } catch (error) {
    return new ErrorHandler(500, error?.message || "Error getting food");
  }
};

export const getFoods = async (data: { page: number; limit: number }) => {
  try {
    const page = data?.page || 1;
    const limit = data?.limit || 10;

    const foods = await FoodModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await FoodModel.countDocuments();
    const hasMore = total > page * limit;

    return new ResponseData(200, "Foods found", { foods, hasMore });
  } catch (error) {
    return new ErrorHandler(500, error?.message || "Error getting foods");
  }
};
