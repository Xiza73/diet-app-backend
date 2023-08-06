import mongoose, { ConnectOptions } from "mongoose";
import { getEnvironment } from "./config";
import { logger } from "./utils";

const dbOptions: ConnectOptions = {
  bufferCommands: true,
  autoIndex: true,
  autoCreate: true,
};

mongoose.connect(getEnvironment().DB_URL, dbOptions).then(
  () => {
    logger("Conectado a la base de datos");
  },
  (_) => {
    logger("Error al conectar con la base de datos");
  }
);

export default mongoose;
