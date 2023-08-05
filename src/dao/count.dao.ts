import { ErrorHandler, ResponseData } from "../helpers";
import { Unity } from "../interfaces";
import { Ingredient, Schedule, ScheduleModel } from "../models";

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
  recipe: RecievedRecipe[];
}

export const countIngredients = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
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
        },
      },
      {
        $lookup: {
          from: "recipes",
          localField: "recipe",
          foreignField: "_id",
          as: "recipe",
        },
      },
      {
        $unwind: "$recipe",
      },
      {
        $lookup: {
          from: "ingredients",
          localField: "recipe.ingredients",
          foreignField: "_id",
          as: "recipe.ingredients",
        },
      },
      {
        $unwind: "$recipe.ingredients",
      },
      {
        $lookup: {
          from: "foods",
          localField: "recipe.ingredients.food",
          foreignField: "_id",
          as: "recipe.ingredients.food",
        },
      },
      {
        $unwind: "$recipe.ingredients.food",
      },
      {
        $group: {
          _id: "$_id",
          date: { $first: "$date" },
          scheduleType: { $first: "$scheduleType" },
          recipe: {
            $push: {
              _id: "$recipe._id",
              name: "$recipe.name",
              ingredients: {
                _id: "$recipe.ingredients._id",
                foodId: "$recipe.ingredients.food._id",
                name: "$recipe.ingredients.food.name",
                quantity: "$recipe.ingredients.quantity",
                secondaryQuantity: "$recipe.ingredients.secondaryQuantity",
                unity: "$recipe.ingredients.food.unity",
                secondaryUnity: "$recipe.ingredients.food.secondaryUnity",
              },
            },
          },
        },
      },
    ]);

    const ingredients: CountIngredient[] = [];
    schedules.forEach((schedule: RecievedSchedule) => {
      schedule.recipe.forEach((recipe: RecievedRecipe) => {
        const index = ingredients.findIndex(
          (i) => i.foodId.toString() === recipe.ingredients.foodId.toString()
        );
        if (index >= 0) {
          ingredients[index].quantity += recipe.ingredients.quantity;
        } else {
          ingredients.push({
            _id: recipe.ingredients._id,
            foodId: recipe.ingredients.foodId,
            name: recipe.ingredients.name,
            quantity: recipe.ingredients.quantity,
            unity: recipe.ingredients.unity,
            ...(recipe.ingredients.secondaryQuantity && {
              secondaryQuantity: recipe.ingredients.secondaryQuantity,
            }),
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
