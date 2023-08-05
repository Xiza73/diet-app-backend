import { ErrorHandler, ResponseBase, ResponseData } from "../helpers";
import { RecipeModel, Schedule, ScheduleModel } from "../models";
import { isValidObjectId } from "mongoose";
import { ScheduleType } from "../interfaces";
import { getRecipe } from "./recipe.dao";

export const createSchedule = async ({
  recipeId,
  scheduleType,
  date,
}: {
  recipeId: string;
  scheduleType: ScheduleType;
  date: Date;
}) => {
  try {
    if (!recipeId || !scheduleType || !date)
      return new ErrorHandler(400, "Missing required fields");

    if (!isValidObjectId(recipeId))
      return new ErrorHandler(400, "Invalid recipe id");

    const existScheduled = await ScheduleModel.findOne({
      scheduleType,
      date,
    });

    if (existScheduled)
      return new ErrorHandler(400, "Recipe already scheduled for this date");

    const recipeFound = await RecipeModel.findById(recipeId);
    if (!recipeFound) return new ErrorHandler(400, "Recipe not found");

    const schedule = await ScheduleModel.create({
      recipe: recipeId,
      scheduleType,
      date,
    });

    return new ResponseData(201, "Schedule created", schedule);
  } catch (error) {
    return new ErrorHandler(500, error.message || "Error creating schedule");
  }
};

export const getSchedules = async ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  try {
    if (!startDate || !endDate)
      return new ErrorHandler(400, "Missing required fields");

    const schedules = await ScheduleModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
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

    const schedule: Schedule = await ScheduleModel.findById(id);
    if (!schedule) return new ErrorHandler(400, "Schedule not found");

    const recipeResponse = await getRecipe({ id: schedule.recipe.id });
    if (recipeResponse instanceof ErrorHandler)
      return new ErrorHandler(400, "Recipe not found");

    return new ResponseData(200, "Schedule found", {
      id: schedule.id,
      scheduleType: schedule.scheduleType,
      date: schedule.date,
      recipe: recipeResponse.data,
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
