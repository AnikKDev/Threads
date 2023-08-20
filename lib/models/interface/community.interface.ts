import { Schema } from "mongoose";
import { IUser } from "./user.interface";

export type ICommunity = {
  id: string;
  userName: string;
  name: string;
  threads?: {}[];
  bio?: string;
  createdBy: Schema.Types.ObjectId | IUser;
  image?: string;
  members: (Schema.Types.ObjectId | IUser)[];
};
