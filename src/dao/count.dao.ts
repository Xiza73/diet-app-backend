import { createObjectId } from "../config";
import { ErrorHandler, ResponseData } from "../helpers";
import { Unity } from "../interfaces";
import { ScheduleModel } from "../models";

interface CountIngredient {
  _id: string;
  foodId: string;
  name: string;
  quantity: number;
  unity: Unity;
  secondaryQuantity?: number;
  secondaryUnity?: Unity;
}

interface RecievedRecipe {
  _id: string;
  name: string;
  ingredients: CountIngredient;
}

interface RecievedSchedule {
  _id: string;
  recipes: RecievedRecipe[];
}

export const countIngredients = async ({
  startDate,
  endDate,
  clientId,
}: {
  startDate: Date;
  endDate: Date;
  clientId: string;
}) => {
  try {
    if (!startDate || !endDate)
      return new ErrorHandler(400, "Missing required fields");

    const schedules = await ScheduleModel.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          client: createObjectId(clientId),
        },
      },
      {
        $lookup: {
          from: "recipes",
          localField: "recipes",
          foreignField: "_id",
          as: "recipes",
        },
      },
      {
        $unwind: "$recipes",
      },
      {
        $lookup: {
          from: "ingredients",
          localField: "recipes.ingredients",
          foreignField: "_id",
          as: "recipes.ingredients",
        },
      },
      {
        $unwind: "$recipes.ingredients",
      },
      {
        $lookup: {
          from: "foods",
          localField: "recipes.ingredients.food",
          foreignField: "_id",
          as: "recipes.ingredients.food",
        },
      },
      {
        $unwind: "$recipes.ingredients.food",
      },
      {
        $group: {
          _id: "$_id",
          date: { $first: "$date" },
          scheduleType: { $first: "$scheduleType" },
          recipes: {
            $push: {
              _id: "$recipes._id",
              name: "$recipes.name",
              ingredients: {
                _id: "$recipes.ingredients._id",
                foodId: "$recipes.ingredients.food._id",
                name: "$recipes.ingredients.food.name",
                quantity: "$recipes.ingredients.quantity",
                secondaryQuantity: "$recipes.ingredients.secondaryQuantity",
                unity: "$recipes.ingredients.food.unity",
                secondaryUnity: "$recipes.ingredients.food.secondaryUnity",
              },
            },
          },
        },
      },
    ]);

    const ingredients: CountIngredient[] = [];
    schedules.forEach((schedule: RecievedSchedule) => {
      schedule.recipes.forEach((recipe: RecievedRecipe) => {
        const index = ingredients.findIndex(
          (i) => i.foodId.toString() === recipe.ingredients.foodId.toString()
        );
        if (index >= 0) {
          ingredients[index].quantity += recipe.ingredients.quantity;
          ingredients[index].secondaryQuantity +=
            recipe.ingredients.secondaryQuantity;
        } else {
          ingredients.push({
            _id: recipe.ingredients._id,
            foodId: recipe.ingredients.foodId,
            name: recipe.ingredients.name,
            quantity: recipe.ingredients.quantity,
            unity: recipe.ingredients.unity,
            secondaryQuantity: recipe.ingredients.secondaryQuantity,
            ...(recipe.ingredients.secondaryUnity && {
              secondaryUnity: recipe.ingredients.secondaryUnity,
            }),
          });
        }
      });
    });

    return new ResponseData(200, "Ingredients counted", ingredients);
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error counting ingredients");
  }
};
