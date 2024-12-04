import prisma from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { currentUser } from "@clerk/nextjs/server";
import path from "path";
import fs from 'fs';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from '@langchain/openai';
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


export async function POST(req: Request) {

    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = user.id;

    console.log("userId", userId);

    const body = await req.json();

    const { name, avatar, pdfKey, active, email } = body;


    if (!name || !avatar || !pdfKey || !active || !email) {
        return new Response("Missing required fields", { status: 400 });
    }

    const filePath = `pdf/${pdfKey}.pdf`

    // parse the pdf and make embedding from it

    // download from s3

    try {
        const params = {
            Bucket: process.env.BUCKET_NAME! ?? "bot-studio-ssacharya",
            Key: pdfKey,
        };

        const s3Object = s3.getObject(params).createReadStream();

        // Ensure the directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Write the S3 object to a file with a promise
        await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(filePath);

            s3Object.pipe(writeStream);

            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        console.log('File downloaded successfully:', filePath);

    } catch (err) {
        console.error('Error downloading or saving the file:', err);
        return new Response("Something went wrong", { status: 500 });
    }

    console.log("before make embedding");



    // make embedding

    // env
    const sbApiKey = process.env.SUPABASE_API_KEY!;
    const sbUrl = process.env.SUPABASE_URL!;
    const openAIApiKey = process.env.OPENAI_API_KEY!;

    if (!sbApiKey || !sbUrl || !openAIApiKey) {
        throw new Error("Missing environment variable for Supabase or OpenAI API key");
    }

    console.log("sb and openai api key loaded");


    try {
        console.log("inside pdf load try");

        // Load PDF
        const singleDocPerFileLoader = new PDFLoader(filePath, {
            splitPages: false,
        });

        console.log("pdf loaded", filePath);


        const singleDoc = await singleDocPerFileLoader.load();
        const text = singleDoc[0].pageContent;

        console.log(text);


        // Split text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            separators: ['\n\n', '\n', ' ', ''],
            chunkOverlap: 50,
        });

        const documents = await splitter.createDocuments([text]);

        // Generate a unique UUID for this PDF document
        const uuid = pdfKey

        // Create OpenAIEmbeddings instance once
        const openAIEmbeddingInstance = new OpenAIEmbeddings({ openAIApiKey });

        interface Metadata {
            loc: {
              lines: {
                to: number;
                from: number;
              };
            };
          }

        interface Doc {
            pageContent: string;
            metadata?: Metadata; // Add this line
        }


        // Generate embeddings and prepare data for insertion
        const embeddings = await Promise.all(
            // @ts-expect-error TS2339
            documents.map(async (doc: Doc) => {
                const embedding = await openAIEmbeddingInstance.embedDocuments([doc.pageContent]);
                return {
                    uuid,
                    content: doc.pageContent,
                    metadata: doc.metadata || {}, // Ensure metadata is an object
                    embedding: embedding[0],
                };
            })
        );

        // Connect to Supabase
        const client = createClient(sbUrl, sbApiKey);

        // Insert embeddings into Supabase table
        const { error } = await client
            .from("document_embeddings")
            .insert(embeddings);

        if (error) {
            console.error("Error inserting embeddings:", error);
        } else {
            console.log("Embeddings inserted successfully:");
        }
    } catch (error) {
        console.log(error);

        return new Response("Something went wrong", { status: 500 });
    }

    // delete the pdf file

    try {
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(err);
        return new Response("Something went wrong", { status: 500 });
    }


    const bot = await prisma.bot.create({
        data: {
            name,
            userId,
            avatar,
            email,
            pdfKey,
            active
        },
    })

    return new Response(JSON.stringify(bot),{
        status: 200,
        headers: {
            "Content-Type": "application/json",
            ...corsHeaders // Spread the CORS headers
        },
    });

}