import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId  } = await auth();

  if (!userId) {
    return RedirectToSignIn({});
  }

  const bots = await prisma.bot.findMany({
    where:{
        userId
    }
  })

  if(!bots){    
    return redirect("/");
  }


  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </div>
  );
}
