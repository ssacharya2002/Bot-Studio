import prisma from "@/lib/prisma";
import { s3 } from "@/lib/s3";
import { currentUser } from "@clerk/nextjs/server";
import path from "path";
import fs from 'fs';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { deleteDocumentsByPdfUuid } from "@/lib/supabaseFuntions";
import SupabaseClient from "@/lib/supabase";


export async function PATCH(req: Request, { params }: { params: { botId: string } }) {


    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    // const userId = user.id;


    const body = await req.json();

    const { name, avatar, pdfKey, active, email } = body;


    if (!name || !avatar || !pdfKey || !active || !email) {
        return new Response("Missing required fields", { status: 400 });
    }

    const filePath = `pdf/${pdfKey}.pdf`

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


    const result = await deleteDocumentsByPdfUuid(pdfKey);

    if (result.success) {
        console.log("Documents deleted successfully");

    }



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
        const openAIApiKey = process.env.OPENAI_API_KEY!;
        // Create OpenAIEmbeddings instance once
        const openAIEmbeddingInstance = new OpenAIEmbeddings({ openAIApiKey });

        interface Doc {
            pageContent: string;
            metadata?: any; // Add this line
        }


        // Generate embeddings and prepare data for insertion
        const embeddings = await Promise.all(
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



        // Insert embeddings into Supabase table
        const { data, error } = await SupabaseClient
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


    const bot = await prisma.bot.update({
        where: {
            id: params.botId,
        },
        data: {
            name,
            avatar,
            pdfKey,
            active,
            email
        }
    });


    return new Response(JSON.stringify(bot));


}


export async function DELETE(req: Request, { params }: { params: { botId: string } }) {


    const user = await currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = user.id;


    const bot = await prisma.bot.delete({
        where: {
            id: params.botId,
            userId
        },
    }
    );

    await deleteDocumentsByPdfUuid(bot.pdfKey);


    return new Response(JSON.stringify({ Success: true }), { status: 200 });
}