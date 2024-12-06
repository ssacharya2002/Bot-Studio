import prisma from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { currentUser } from "@clerk/nextjs/server";
import path from "path";
import fs from "fs";
import { tmpdir } from "os";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
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

  const { id: userId } = user;
  const body = await req.json();
  const { name, avatar, pdfKey, active, email } = body;

  if (!name || !avatar || !pdfKey || !active || !email) {
    return new Response("Missing required fields", { status: 400 });
  }

  // Temporary file path for serverless environments
  const tempFilePath = path.join(tmpdir(), `${pdfKey}.pdf`);

  try {
    // Download the PDF from S3
    const params = {
      Bucket: process.env.BUCKET_NAME! ?? "bot-studio-ssacharya",
      Key: pdfKey,
    };

    const s3Object = s3.getObject(params).createReadStream();

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(tempFilePath);
      s3Object.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("PDF downloaded successfully:", tempFilePath);

    // Parse and process the PDF
    const pdfLoader = new PDFLoader(tempFilePath, { splitPages: false });
    const docs = await pdfLoader.load();
    const text = docs[0].pageContent;

    console.log("PDF content loaded successfully");

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ['\n\n', '\n', ' ', ''],
      chunkOverlap: 50,
    });

    const documents = await textSplitter.createDocuments([text]);

    // Generate embeddings
    const uuid = pdfKey;
    const embeddingsInstance = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const embeddings = await Promise.all(
      documents.map(async (doc) => {
        const embedding = await embeddingsInstance.embedDocuments([
          doc.pageContent,
        ]);
        return {
          uuid,
          content: doc.pageContent,
          metadata: doc.metadata || {},
          embedding: embedding[0],
        };
      })
    );

    console.log("Embeddings generated successfully");

    // Insert embeddings into Supabase
    const supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_API_KEY!
    );

    const { error } = await supabaseClient
      .from("document_embeddings")
      .insert(embeddings);

    if (error) {
      console.error("Error inserting embeddings:", error);
      return new Response("Failed to insert embeddings", { status: 500 });
    }

    console.log("Embeddings inserted successfully");

    // Create a bot entry in the database
    const bot = await prisma.bot.create({
      data: { name, userId, avatar, email, pdfKey, active },
    });

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);

    return new Response(JSON.stringify(bot), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    // Ensure cleanup of the temporary file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}
