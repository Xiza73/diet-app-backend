import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface Client extends Document {
  _id: string;
  clientToken: string;
  compareClientToken: (clientToken: string) => Promise<boolean>;
}

const ClientSchema: Schema = new Schema(
  {
    clientToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ClientSchema.pre<Client>("save", async function (next) {
  if (!this.isModified("clientToken")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.clientToken, salt);
  this.clientToken = hash;
  next();
});

ClientSchema.methods.compareClientToken = async function (
  clientToken: string
): Promise<boolean> {
  return await bcrypt.compare(clientToken, this.clientToken);
};

export const ClientModel = model<Client>("Client", ClientSchema);
