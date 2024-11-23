import prisma from "@/lib/prisma";
import ListOfBots from "./components/ListofBots";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const chatBots = await prisma.bot.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <ListOfBots chatBots={chatBots} />
    </div>
  );
}

export default page;
