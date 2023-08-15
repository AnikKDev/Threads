import mongoose, { Schema, model, models } from "mongoose";
import { IThread } from "./interface/thread.interface";

const threadSchema = new Schema<IThread>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    parentId: {
      type: String,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Thread = models.Thread || model("Thread", threadSchema);
export default Thread;
