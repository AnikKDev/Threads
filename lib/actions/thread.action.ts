"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectedToDB } from "../mongoose";

type Params = {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
};
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  connectedToDB();

  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null, //communityId
      path,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error) {
    throw new Error("error creating thread");
  }
}
