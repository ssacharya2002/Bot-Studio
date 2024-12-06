
import { generateEmbeddingVector } from "@/lib/embeddingService";
import prisma from "@/lib/prisma";
import { answerChain, standaloneQuestionChain } from "@/lib/promptService";
import { RedisClient } from "@/lib/redis";
import { matchDocumentEmbeddings } from "@/lib/supabaseFuntions";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// Handle POST requests
export async function POST(req: NextRequest, { params }: { params: Promise<{ botId: string }> }) {
    const botId = (await params).botId

   
    try {
        // Parse the JSON body
        const body = await req.json();
        const { question, conv_history = "" } = body;

        console.log("Request Body:", body);

        // Try to get bot from Redis cache
        let bot = null;
        const time1 = Date.now();
        const cachedBot = await RedisClient.get(`bot:${botId}`);
       
        
        if (cachedBot) {
            // If found in cache, parse the JSON
            try {
                bot = JSON.parse(cachedBot);
                console.log("Bot fetched from cache");
            } catch (error) {
                console.error("Error parsing cached bot:", error);
                // If there's an error parsing, we'll fetch from DB
            }
        }

        // If not in cache or parse error, fetch from database
        if (!bot) {
            bot = await prisma.bot.findUnique({
                where: { id: botId },
            });

            if (bot) {
                // Store in Redis cache
                await RedisClient.set(
                    `bot:${botId}`,
                    JSON.stringify(bot)
                );
                console.log("Bot cached in Redis");
            }
        }

        const time2 = Date.now();
        console.log("Time taken to fetch from Redis:", time2 - time1);

        // If bot still not found, return 404
        if (!bot) {
            return NextResponse.json(
                { error: "Bot not found" },
                { status: 404, headers: corsHeaders }
            );
        }

        const pdfuuid = bot.pdfKey;

        // Generate standalone question embedding
        const standalone_qs = await standaloneQuestionChain.invoke({
            conv_history,
            question,
        });

        const queryEmbedding = await generateEmbeddingVector(standalone_qs);

        // Match documents based on embeddings
        const contextDocuments = await matchDocumentEmbeddings(queryEmbedding, 5, "", pdfuuid);

        const context = contextDocuments?.length
            ? contextDocuments.map((doc:{ content: string }) => doc?.content).join("\n\n")
            : "";

        // Generate answer from the chain
        const answer = await answerChain.invoke({
            context,
            conv_history,
            question,
            contactEmail: bot.email,
            contactLink: `${process.env.HOST}/contact/${botId}`,
            botName: bot.name
        });

        console.log("Generated Answer:", answer);

        // Return the generated answer
        return NextResponse.json({ answer }, { headers: corsHeaders });
    } catch (error) {
        console.error("Error:", error);

        // Handle errors gracefully
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500, headers: corsHeaders }
        );
    }
}
