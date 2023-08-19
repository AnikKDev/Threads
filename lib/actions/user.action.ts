"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectedToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

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

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectedToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    // query
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };
    if (searchString.trim() !== "") {
      query.$or = [
        { userName: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // sort
    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skipAmount + users.length;
    return {
      users,
      isNext,
    };
  } catch (error: any) {
    throw new Error("failed to fetch users", error.message);
  }
}

export async function getActivity(userId: string) {
  try {
    connectedToDB();
    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image id",
    });

    return replies;
  } catch (error: any) {
    throw new Error(
      "failed to connect to database and error getting activities",
      error.message
    );
  }
}
