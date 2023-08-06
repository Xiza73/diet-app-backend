import express, { Application, Response, Request, NextFunction } from "express";
import "./database";
import "./passport";
import morgan from "morgan";
import { ErrorHandler } from "./helpers";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import router from "./router";
import passport from "passport";
import { PassportMiddleware } from "./middlewares";
import cookieParser from "cookie-parser";
import session from "express-session";
import { logger } from "./utils";

dotenv.config();

const app: Application = express();
const passportMiddleware = new PassportMiddleware();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET || "my_secret"));
app.use(
  session({
    secret: process.env.JWT_SECRET || "my_secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
passport.use(passportMiddleware.strategy());
app.use(passport.session());

app.use("/", router);
app.use((err: ErrorHandler, _: Request, res: Response, __: NextFunction) => {
  return res.status(err.statusCode || 500).json({
    status: "error",
    statusCode: err.statusCode,
    message: err.message,
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(app.get("port"), () => {
  logger(`Server on port http://localhost:${app.get("port")}`);
});
