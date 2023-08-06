import { Router } from "express";
import * as authController from "../controller/auth.controller";
import passport from "passport";

const authRouter: Router = Router();

authRouter.post("/signin", authController.signIn);
authRouter.post("/signup", authController.signUp);
authRouter.get(
  "/refresh/:clientId",
  passport.authenticate("jwt"),
  authController.refreshToken
);

export default authRouter;
