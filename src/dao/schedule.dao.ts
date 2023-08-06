import { ErrorHandler, ResponseBase, ResponseData } from "../helpers";
import { RecipeModel, Schedule, ScheduleModel } from "../models";
import { isValidObjectId } from "mongoose";
import { ScheduleType } from "../interfaces";
import { getRecipe } from "./recipe.dao";
import { haveRepeatedValues, isValidArray } from "../utils";

export const createSchedule = async ({
  recipeIds,
  clientId,
  scheduleType,
  date,
}: {
  recipeIds: string[];
  clientId: string;
  scheduleType: ScheduleType;
  date: Date;
}) => {
  try {
    if (!recipeIds || !scheduleType || !date)
      return new ErrorHandler(400, "Missing required fields");

    const haveInvalidRecipeIds = recipeIds.some(
      (recipeId) => !isValidObjectId(recipeId)
    );

    if (haveInvalidRecipeIds)
      return new ErrorHandler(400, "Invalid recipe ids");

    if (haveRepeatedValues(recipeIds))
      return new ErrorHandler(400, "Food ids must be unique");

    if (!isValidArray(recipeIds))
      return new ErrorHandler(400, "Invalid recipe ids");

    const existScheduled = await ScheduleModel.findOne({
      scheduleType,
      date,
    });

    if (existScheduled)
      return new ErrorHandler(400, "Recipe already scheduled for this date");

    const schedule = await ScheduleModel.create({
      recipes: recipeIds,
      client: clientId,
      scheduleType,
      date,
    });

    return new ResponseData(200, "Schedule created successfully", {
      id: schedule.id,
      scheduleType: schedule.scheduleType,
      date: schedule.date,
    });
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error creating schedule");
  }
};

export const getSchedules = async ({
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

    const schedules = await ScheduleModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      client: clientId,
    });

    return new ResponseData(200, "Schedules found", schedules);
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error getting schedules");
  }
};

export const getSchedule = async ({ id }: { id: string }) => {
  try {
    if (!id) return new ErrorHandler(400, "Missing required fields");
    if (!isValidObjectId(id)) return new ErrorHandler(400, "Invalid ObjectId");

    const schedule: Schedule = await ScheduleModel.findById(id).populate(
      "recipes"
    );
    if (!schedule) return new ErrorHandler(400, "Schedule not found");

    /* const recipeResponse = await getRecipe({ id: schedule.recipe.id });
    if (recipeResponse instanceof ErrorHandler)
      return new ErrorHandler(400, "Recipe not found"); */

    const recipeResponse = await Promise.all(
      schedule.recipes.map((recipe) => getRecipe({ id: recipe._id }))
    );

    return new ResponseData(200, "Schedule found", {
      id: schedule.id,
      scheduleType: schedule.scheduleType,
      date: schedule.date,
      recipes: recipeResponse,
    });
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error getting schedule");
  }
};

export const deleteSchedule = async ({ id }: { id: string }) => {
  try {
    if (!id) return new ErrorHandler(400, "Missing required fields");
    if (!isValidObjectId(id)) return new ErrorHandler(400, "Invalid ObjectId");

    const schedule = await ScheduleModel.findByIdAndDelete(id);
    if (!schedule) return new ErrorHandler(400, "Schedule not found");

    return new ResponseBase(200, "Schedule deleted successfully");
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error deleting schedule");
  }
};
