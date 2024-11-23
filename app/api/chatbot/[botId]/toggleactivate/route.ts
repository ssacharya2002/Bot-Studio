import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request, { params }: { params: { botId: string } }) {


    console.log("hello from toggleactivate");
    


    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = user.id;

    const bot = await prisma.bot.findUnique({
        where: {
            id: params.botId,
            userId
        }
    })

    console.log("bot", bot);
    


    if (!bot) {
        return new Response("Bot not found", { status: 404 });
    }

    const updatedBot = await prisma.bot.update({
        where: {
            id: params.botId,
            userId
        },
        data: {
            active: !bot.active
        }
    })

    console.log("updatedBot", updatedBot);
    

    return new Response(JSON.stringify(updatedBot), { status: 200 });

}