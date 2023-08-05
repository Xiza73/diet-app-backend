import { Router } from "express";
import * as countController from "../controller/count.controller";

const countRouter: Router = Router();

countRouter.get("/ingredients", countController.countIngredients);

export default countRouter;