import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import { GetPdfUrl } from "@/lib/s3";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import PDFViewer from "./components/pdf-viewer";
import ChatComponent from "./components/ChatComponent";
import { Chat } from "./components/chat-component";

async function page({ params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params;

  const { userId } = await auth();

  if (!userId) {
    return RedirectToSignIn({});
  }

  const bot = await prisma.bot.findUnique({
    where: {
      id: botId,
      userId,
    },
  });

  if (!bot) {
    return redirect("/");
  }

  const pdfUrl = GetPdfUrl(bot.pdfKey);

  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <div className="flex flex-1">

      <div className=" grid grid-cols-2 flex-row flex-1  h-[calc(100vh-80px)]">
        <PDFViewer pdf_url={pdfUrl} />
        <ChatComponent botId={botId} bot={bot} />
        {/* <Chat /> */}
      </div>
      </div>
    </div>
  );
}

export default page;
