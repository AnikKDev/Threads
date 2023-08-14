"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectedToDB } from "../mongoose";

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
        onboarded: true,
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
