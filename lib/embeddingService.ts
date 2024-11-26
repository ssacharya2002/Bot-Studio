
import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY
});

export async function generateEmbeddingVector(text:string) {
  try {
    const vector = await embeddings.embedQuery(text);
    return vector;
  } catch (error) {
    throw new Error('Failed to generate embedding vector',);
  }
}
