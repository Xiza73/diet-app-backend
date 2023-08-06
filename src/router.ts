import { Router } from "express";
import foodRouter from "./routes/food.route";
import ingredientRouter from "./routes/ingredient.route";
import recipeRouter from "./routes/recipe.route";
import scheduleRouter from "./routes/schedule.route";
import countRouter from "./routes/count.route";
import authRouter from "./routes/auth.route";

const router: Router = Router();

router.use("/api/food", foodRouter);
router.use("/api/ingredient", ingredientRouter);
router.use("/api/recipe", recipeRouter);
router.use("/api/schedule", scheduleRouter);
router.use("/api/count", countRouter);
router.use("/api/auth", authRouter);

export default router;
