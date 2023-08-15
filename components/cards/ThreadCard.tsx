import { currentUser } from "@clerk/nextjs";
import React from "react";

type Props = {
  id: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  currentUser: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
};

export default function ThreadCard({
  id,
  author,
  comments,
  community,
  createdAt,
  parentId,
  content,
  isComment,
}: Props) {
  return (
    <article>
      <h2 className="text-small-regular text-light-2">{content}</h2>
    </article>
  );
}
