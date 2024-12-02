import prisma from "@/lib/prisma";
import { GetPdfUrl } from "@/lib/s3";
// import { RedirectToSignIn } from "@clerk/nextjs/";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import PDFViewer from "./components/pdf-viewer";
import ChatComponent from "./components/ChatComponent";
async function page({ params }: { params: Promise<{ botId: string }> }) {
  // const { botId } = await params;

  const botId = (await params).botId;

  const { userId } = await auth();

  if (!userId) {
    // return RedirectToSignIn({});
    redirect("/sign-in");
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
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-purple-50">
      <div className="flex flex-row h-[calc(100vh-80px)]">
        <div
          className="basis-3/5 flex-shrink-0 hidden
    sm:flex"
        >
          <PDFViewer pdf_url={pdfUrl} />
        </div>
        <div className="basis-2/5 flex-grow">
          <ChatComponent botId={botId} bot={bot} />
        </div>
      </div>
    </div>
  );
}

export default page;
