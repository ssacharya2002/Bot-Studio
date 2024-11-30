import prisma from "@/lib/prisma";
import { RedisClient } from "@/lib/redis";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
    req: Request,
    { params }: { params: { botId: Promise<string> } }
): Promise<Response> {

    const botId = await params.botId

    try {
        // Validate botId
        if (!botId || typeof botId !== "string") {
            return new Response(JSON.stringify({ error: "Invalid bot ID" }), {
                status: 400,
                headers: corsHeaders,
            });
        }
        let bot = null;
        const cachedBotInfo = await RedisClient.get(`botInfo:${botId}`)

        if (cachedBotInfo) {
            try {
                bot = JSON.parse(cachedBotInfo);
                console.log("BotInfo fetched from cache");
            } catch (error) {
                console.error("Error parsing cached bot:", error);
                // If there's an error parsing, we'll fetch from DB
            }
        }

        if (!bot) {
            // Fetch bot details
            bot = await prisma.bot.findUnique({
                where: {
                    id: botId,
                },
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            });

            if (bot) {
                await RedisClient.set(`botInfo:${botId}`, JSON.stringify(bot));

                console.log("Bot cached in Redis");

            }

        }

        // Check if bot exists
        if (!bot) {
            return new Response(JSON.stringify({ error: "Bot not found" }), {
                status: 404,
                headers: corsHeaders,
            });
        }

        // Return bot details
        return new Response(JSON.stringify(bot), {
            status: 200,
            headers: corsHeaders,
        });
    } catch (error) {
        console.error("Error fetching bot details:", error);

        // Handle server errors
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: corsHeaders,
            }
        );
    }
}
