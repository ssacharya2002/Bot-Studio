import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
// import prisma from "@/lib/prisma";
// import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ botId: string }>;
}) {
  const { userId } = await auth();

  const botId  = (await params).botId;
  console.log("botId", botId);
  

  if (!userId) {
    redirect("/sign-in");
  }

  const bot = await prisma.bot.findUnique({
    where: {
      id: botId,
      userId,
    },
  });

  if (!bot) {
    redirect("/");
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar bot={bot} />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </div>
  );
}
