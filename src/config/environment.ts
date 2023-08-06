import dotenv from "dotenv";
dotenv.config();

const environment = {
  DB_URL: process.env.DB_URL ?? " ",
  PORT: process.env.PORT ?? " ",
  JWT_SECRET: process.env.JWT_SECRET ?? " ",
};

export const getEnvironment = () => {
  return environment;
};
