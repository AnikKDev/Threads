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

export const fetchThreadById = async (id: string) => {
  connectedToDB();
  try {
    // TODO: populate community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: "User",
        select: "_id name id image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id parentId image name",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id parentId image name",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error) {
    throw new Error("Error fetchihng the thread");
  }
};

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectedToDB();
  try {
    // !the basic thing here is that, after commenting something on the thread, we are storing that comment as a new thread in the Tread model. the after saving that comment as a thread in the Tread model, we are taking that saved threads _id and pushing it to the children property of the thread whom it belongs to. the OG thread
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) {
      throw new Error("Thread not found");
    }
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    const savedCommentThread = await commentThread.save();
    originalThread.children.push(savedCommentThread._id);
    await originalThread.save();
    revalidatePath(path);
  } catch (error) {
    throw new Error("Error commenting to thread");
  }
}
