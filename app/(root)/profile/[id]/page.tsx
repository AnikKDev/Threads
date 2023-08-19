import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadsTab from "@/components/shared/ThreadsTab";

type Props = {
  params: {
    id: string;
  };
};

export default async function Profile({ params }: Props) {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onBoarded) redirect("/onboarding");
  return (
    <section>
      <ProfileHeader
        accountId={userInfo?.id}
        authUserId={user.id}
        username={userInfo?.userName}
        name={userInfo?.name}
        imgUrl={userInfo?.image}
        bio={userInfo?.bio}
      />

      <div className="mt-9">
        {/* tabs */}
        <Tabs defaultValue="threads" className="w-full">
          {/* tablist */}
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.label} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  className="object-contain"
                  width={24}
                  height={24}
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              className="w-full text-light-1"
              key={`content-${tab.label}`}
              value={tab.value}
            >
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo?.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
