import { Types } from "mongoose";
import { IUser } from "./user.interface";

export type IThread = {
  text: string;
  author: Types.ObjectId | IUser;
  community: Types.ObjectId | {};
  parentId?: string;
  children?: Types.ObjectId[] | IThread[];
};
