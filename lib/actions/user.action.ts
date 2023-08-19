"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectedToDB } from "../mongoose";
import Thread from "../models/thread.model";

interface Params {
  userId: string;
  userName: string;
  bio: string;
  image: string;
  path: string;
  name: string;
}
export async function updateUser({
  userId,
  userName,
  bio,
  image,
  path,
  name,
}: Params): Promise<void> {
  connectedToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        userName: userName.toLowerCase(),
        name,
        bio,
        image,
        onBoarded: true,
      },
      {
        upsert: true,
      }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    throw new Error("Unable to update user");
  }
}

export async function fetchUser(userId: string) {
  try {
    connectedToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path:"communities",
    //   model: "community"
    // })
  } catch (error) {
    throw new Error("Unable to fetch user");
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectedToDB();
    // TODO: populate community
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return threads;
  } catch (error) {
    throw new Error("error getting threads");
  }
}
