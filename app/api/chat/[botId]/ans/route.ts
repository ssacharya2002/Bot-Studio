
import { generateEmbeddingVector } from "@/lib/embeddingService";
import prisma from "@/lib/prisma";
import { answerChainForInApp, standaloneQuestionChain } from "@/lib/promptService";
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
    const botId = (await params).botId;


    try {
        // Parse the JSON body
        const body = await req.json();
        // const { question, conv_history = "", uuid } = body;
        const { messages } = body;

        const question = messages[messages.length - 1].content;
        const conv_history = messages
            .slice(0, messages.length - 1)
            .map((m: Message) => `${m.role}:${m.content}`)
            .join(",");


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
        const contextDocuments = await matchDocumentEmbeddings(queryEmbedding, 5, {}, pdfuuid);

        const context = contextDocuments?.length
            ? contextDocuments.map((doc) => doc?.content).join("\n\n")
            : "";

        // Generate answer from the chain
        const answer = await answerChainForInApp.invoke({
            context,
            conv_history,
            question,
            contactEmail: bot.email,
            contactLink: `http://localhost:3000/contact/${botId}`,
            botName: bot.name
        });

        console.log("Generated Answer:", answer);


        const responsePayload = {
            role: "assistant",
            content: answer.toString(),
        };

        console.log("Response Payload:", responsePayload);

        return new Response(JSON.stringify(responsePayload), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                ...corsHeaders // Spread the CORS headers
            },
        });

    } catch (error) {
        console.error("Error:", error);

        // Handle errors gracefully
        return NextResponse.json(
            { error: "An error occurred while processing your request." },
            { status: 500, headers: corsHeaders }
        );
    }
}




// import { generateEmbeddingVector } from "@/lib/embeddingService";
// import prisma from "@/lib/prisma";
// import { answerChain, answerChainForInApp, standaloneQuestionChain } from "@/lib/promptService";
// import { RedisClient } from "@/lib/redis";
// import { matchDocumentEmbeddings } from "@/lib/supabaseFuntions";
// import { Message } from "ai/react";
// import { NextRequest, NextResponse } from "next/server";

// const corsHeaders = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//     return NextResponse.json({}, { headers: corsHeaders });
// }

// export async function POST(req: NextRequest, { params }: { params: { botId: string } }) {
//     const botId = params.botId;

//     try {
//         const { messages } = await req.json();
//         const question = messages[messages.length - 1].content;
//         const conv_history = messages
//             .slice(0, messages.length - 1)
//             .map((m: Message) => `${m.role}:${m.content}`)
//             .join(",");

//         // Bot fetching logic
//         let bot = null;
//         const cachedBot = await RedisClient.get(`bot:${botId}`);

//         if (cachedBot) {
//             try {
//                 bot = JSON.parse(cachedBot);
//             } catch (error) {
//                 console.error("Error parsing cached bot:", error);
//             }
//         }

//         if (!bot) {
//             bot = await prisma.bot.findUnique({
//                 where: { id: botId },
//             });

//             if (bot) {
//                 await RedisClient.set(
//                     `bot:${botId}`,
//                     JSON.stringify(bot)
//                 );
//             }
//         }

//         if (!bot) {
//             return NextResponse.json(
//                 { error: "Bot not found" },
//                 { status: 404, headers: corsHeaders }
//             );
//         }

//         // Generate standalone question
//         const standalone_qs = await standaloneQuestionChain.invoke({
//             conv_history,
//             question,
//         });

//         // Generate embeddings and match documents
//         const queryEmbedding = await generateEmbeddingVector(standalone_qs);
//         const contextDocuments = await matchDocumentEmbeddings(queryEmbedding, 5, {}, bot.pdfKey);
//         const context = contextDocuments?.length
//             ? contextDocuments.map((doc) => doc?.content).join("\n\n")
//             : "";

//         // Generate answer
//         const answer = await answerChainForInApp.invoke({
//             context,
//             conv_history,
//             question,
//             contactEmail: bot.email,
//             contactLink: `http://localhost:3000/contact/${botId}`,
//         });

//         // Format response for AI SDK
//         return NextResponse.json(
//             {
//                 role: "assistant",
//                 content: answer,
//                 id: Date.now().toString(),
//             },
//             { headers: corsHeaders }
//         );

//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json(
//             { error: "An error occurred while processing your request." },
//             { status: 500, headers: corsHeaders }
//         );
//     }
// }