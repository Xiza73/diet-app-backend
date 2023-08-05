import express, { Application, Response, Request, NextFunction } from "express";
import "./database";
import morgan from "morgan";
import { ErrorHandler } from "./helpers";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import router from "./router";

dotenv.config();

const app: Application = express();

// settings
app.set("port", process.env.PORT || 3000);

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// routes
app.use("/", router);
app.use((err: ErrorHandler, _: Request, res: Response, __: NextFunction) => {
  return res.status(err.statusCode || 500).json({
    status: "error",
    statusCode: err.statusCode,
    message: err.message,
  });
});

// static files
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_: Request, res: Response) => {
  // send hello world to the client
  res.send("Hello World");
});

// listen
app.listen(app.get("port"), () => {
  console.log(`Server on port http://localhost:${app.get("port")}`);
});
