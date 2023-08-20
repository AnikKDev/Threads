import { Schema, model, models } from "mongoose";
import { IUser } from "./interface/user.interface";
import { ICommunity } from "./interface/community.interface";

const communitySchema = new Schema<ICommunity>(
  {
    id: {
      type: String,
      required: true,
    },
    userName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    threads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Community = models.Community || model("Community", communitySchema);
export default Community;
