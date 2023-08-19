import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export default async function Search({}: Props) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");

  // fetch all the user
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
    </section>
  );
}
