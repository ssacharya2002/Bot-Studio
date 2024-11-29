import { AppSidebar } from "@/components/app-sidebar";
// import Navbar from "@/components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
// import prisma from "@/lib/prisma";
// import { RedirectToSignIn } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "../../welcome/components/Navbar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ botId: string }>;
}) {
  // const { userId } = await auth();
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const botId = (await params).botId;
  console.log("botId", botId);

  if (!user.id) {
    redirect("/sign-in");
  }

  // const userid = user.id

  const bot = await prisma.bot.findUnique({
    where: {
      id: botId,
      userId: user.id,
    },
  });

  if (!bot) {
    redirect("/");
  }

  return (
    <div className="">
      <SidebarProvider>
        <AppSidebar
          bot={bot}
          user={{
            name: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
          }}
        />
        <SidebarTrigger />
        <div className="flex flex-col w-full overflow-hidden">
          <Navbar />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
