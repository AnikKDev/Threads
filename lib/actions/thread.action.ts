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
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectedToDB();

  try {
    // calculate number of posts to skip
    const skipVal = (pageNumber - 1) * pageSize;

    const postsQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipVal)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });
    const totalPosts = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await postsQuery.exec();
    const isNext = totalPosts > skipVal + posts.length;
    return { posts, isNext };
  } catch (error) {
    throw new Error("error creating thread");
  }
}
