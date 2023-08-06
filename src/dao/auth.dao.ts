import { ErrorHandler, ResponseData } from "../helpers";
import { Client, ClientModel } from "../models";
import jwt from "jsonwebtoken";
import { getEnvironment } from "../config";
import { isValidToken } from "../utils";
import { isValidObjectId } from "mongoose";

export const createToken = async (client: Client) => {
  try {
    const payload = {
      id: client._id,
    };
    const token = jwt.sign(payload, getEnvironment().JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });
    return token;
  } catch (err) {
    return new ErrorHandler(500, "Internal server error");
  }
};

export const signIn = async ({ clientToken }: { clientToken: string }) => {
  try {
    if (!clientToken) return new ErrorHandler(400, "Missing required fields");
    if (!isValidToken(clientToken))
      return new ErrorHandler(400, "Invalid token format");

    const clients = await ClientModel.find();
    const client = clients.find((client) =>
      client.compareClientToken(clientToken)
    );
    if (!client) return new ErrorHandler(404, "Client not found");

    const token = await createToken(client);

    return new ResponseData(200, "Client logged in", { token });
  } catch (err) {
    return new ErrorHandler(500, "Internal server error");
  }
};

export const signUp = async ({ clientToken }: { clientToken: string }) => {
  try {
    if (!clientToken) return new ErrorHandler(400, "Missing required fields");
    if (!isValidToken(clientToken))
      return new ErrorHandler(400, "Invalid token format");

    const clients = await ClientModel.find();
    const client = clients.find((client) =>
      client.compareClientToken(clientToken)
    );
    if (client) return new ErrorHandler(400, "Client already exists");

    const newClient = new ClientModel({ clientToken });
    await newClient.save();

    const token = await createToken(newClient);

    return new ResponseData(200, "Client created", { token });
  } catch (err) {
    return new ErrorHandler(500, "Internal server error");
  }
};

export const refreshToken = async (clientId: string) => {
  try {
    if (!clientId) return new ErrorHandler(400, "Missing required fields");
    if (!isValidObjectId(clientId))
      return new ErrorHandler(400, "Invalid id format");

    const client = await ClientModel.findById(clientId);
    if (!client) return new ErrorHandler(404, "Client not found");

    const token = await createToken(client);

    return new ResponseData(200, "Token refreshed", { token });
  } catch (err) {
    return new ErrorHandler(500, "Internal server error");
  }
};
