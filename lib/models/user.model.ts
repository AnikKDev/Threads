import { Schema, model, models } from "mongoose";
import { IUser } from "./interface/user.interface";

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
    },
    userName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,
    threads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    onBoarded: {
      type: Boolean,
      default: false,
    },
    communities: [
      {
        type: Schema.Types.ObjectId,
        ref: "community",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);
export default User;
