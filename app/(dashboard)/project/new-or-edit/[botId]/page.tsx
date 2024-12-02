import prisma from "@/lib/prisma";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import BotForm from "./components/BotForm";




const NewOrEdit = async({params}:{params: Promise<{ botId: string }>}) => {

  const { userId } = await auth();

  if (!userId) {
   return RedirectToSignIn({});
  }

  // const { botId } = await params;
  const botId = (await params).botId;

  const initialData = await prisma.bot.findMany({
    where: {
      userId: userId,
      id: botId
    },
  });

  console.log("initialData from page.tsx", initialData);
  console.log("botId from page.tsx", botId);
  console.log("userId from page.tsx", userId);
  
  
  



  return (
    <div>
      <BotForm initialData={initialData[0]} botId={botId} />
    </div>

  )
}

export default NewOrEdit