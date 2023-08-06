import { ErrorHandler, ResponseBase, ResponseData } from "../helpers";
import { RecipeModel, IngredientModel, FoodModel, Ingredient } from "../models";
import mongoose from "../database";
import { haveRepeatedValues, isValidArray } from "../utils";
import { createObjectId } from "../config";
import { isValidObjectId } from "mongoose";

export const createRecipe = async ({
  name,
  description,
  foodIds,
  quantities,
  secondaryQuantities,
  clientId,
}: {
  name: string;
  description?: string;
  foodIds: string[];
  quantities: number[];
  secondaryQuantities: number[];
  clientId: string;
}) => {
  const session = await mongoose.startSession();

  try {
    if (!name || !foodIds || !quantities)
      return new ErrorHandler(400, "Missing required fields");

    if (
      !isValidArray(foodIds) ||
      !isValidArray(quantities) ||
      !Array.isArray(secondaryQuantities || [])
    )
      return new ErrorHandler(400, "Invalid array fields");

    if (haveRepeatedValues(foodIds))
      return new ErrorHandler(400, "Food ids must be unique");

    if (foodIds.length !== quantities.length)
      return new ErrorHandler(
        400,
        "Food ids and quantities must have the same length"
      );

    await session.withTransaction(async () => {
      const ingredients: Ingredient[] = [];
      for (let i = 0; i < foodIds.length; i++) {
        const foodFound = await FoodModel.findById(foodIds[i]).session(session);
        if (!foodFound) return new ErrorHandler(400, "Food not found");

        const [ingredient] = await IngredientModel.create(
          [
            {
              food: foodIds[i],
              quantity: quantities[i],
              secondaryQuantity: secondaryQuantities?.[i],
            },
          ],
          { session }
        );
        ingredients.push(ingredient);
      }

      await RecipeModel.create(
        [
          {
            name,
            ...(description && { description }),
            ingredients,
            client: clientId,
          },
        ],
        { session }
      );
    });

    return new ResponseBase(200, "Recipe created successfully");
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error creating recipe");
  }
};

export const getRecipe = async ({ id }: { id: string }) => {
  try {
    if (!id) return new ErrorHandler(400, "Missing required fields");
    if (!isValidObjectId(id)) return new ErrorHandler(400, "Invalid ObjectId");

    const recipe = await RecipeModel.aggregate([
      {
        $match: {
          _id: createObjectId(id),
        },
      },
      {
        $lookup: {
          from: "ingredients",
          localField: "ingredients",
          foreignField: "_id",
          as: "ingredients",
        },
      },
      {
        $unwind: "$ingredients",
      },
      {
        $lookup: {
          from: "foods",
          localField: "ingredients.food",
          foreignField: "_id",
          as: "ingredients.food",
        },
      },
      {
        $unwind: "$ingredients.food",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          schedule: { $first: "$schedule" },
          ingredients: {
            $push: {
              _id: "$ingredients._id",
              foodId: "$ingredients.food._id",
              name: "$ingredients.food.name",
              quantity: "$ingredients.quantity",
              secondaryQuantity: "$ingredients.secondaryQuantity",
              unity: "$ingredients.food.unity",
              secondaryUnity: "$ingredients.food.secondaryUnity",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          schedule: 1,
          ingredients: 1,
        },
      },
    ]);

    if (!recipe || !recipe[0]) return new ErrorHandler(400, "Recipe not found");

    return new ResponseData(200, "Recipe found", recipe[0]);
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error getting recipe");
  }
};

export const getRecipes = async (data: {
  page: number;
  limit: number;
  clientId: string;
}) => {
  try {
    const page = data?.page || 1;
    const limit = data?.limit || 10;
    const [recipeResponse] = await RecipeModel.aggregate([
      {
        $match: {
          client: createObjectId(data.clientId),
        },
        $facet: {
          recipes: [
            {
              $skip: (page - 1) * limit,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: "ingredients",
                localField: "ingredients",
                foreignField: "_id",
                as: "ingredients",
              },
            },
            {
              $unwind: "$ingredients",
            },
            {
              $lookup: {
                from: "foods",
                localField: "ingredients.food",
                foreignField: "_id",
                as: "ingredients.food",
              },
            },
            {
              $unwind: "$ingredients.food",
            },
            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
                schedule: { $first: "$schedule" },
                ingredients: {
                  $push: {
                    _id: "$ingredients._id",
                    foodId: "$ingredients.food._id",
                    name: "$ingredients.food.name",
                    quantity: "$ingredients.quantity",
                    secondaryQuantity: "$ingredients.secondaryQuantity",
                    unity: "$ingredients.food.unity",
                    secondaryUnity: "$ingredients.food.secondaryUnity",
                  },
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                schedule: 1,
                ingredients: 1,
              },
            },
          ],
          total: [
            {
              $count: "total",
            },
          ],
        },
      },
      {
        $unwind: "$total",
      },
      {
        $project: {
          recipes: 1,
          total: "$total.total",
        },
      },
    ]);

    if (!recipeResponse) return new ErrorHandler(400, "Recipes not found");

    return new ResponseData(200, "Recipes found", {
      recipes: recipeResponse.recipes,
      hasMore: recipeResponse.total > page * limit,
    });
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error getting recipes");
  }
};
