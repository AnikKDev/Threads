import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.action";
import PostThread from "@/components/forms/PostThread";
type Props = {};

export default async function CreateThread({}: Props) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  console.log(userInfo);
  // TODO: Have to fix this redirecting
  // if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={userInfo._id} />
    </>
  );
}
