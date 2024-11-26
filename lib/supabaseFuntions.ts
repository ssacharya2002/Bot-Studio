import SupabaseClient from "./supabase";



interface DeleteDocumentsResult {
    success: boolean;
    message: string;
}

export const deleteDocumentsByPdfUuid = async (
    pdfUuid: string
): Promise<DeleteDocumentsResult> => {
    try {
        const { data, error } = await SupabaseClient.rpc('delete_document_embeddings', {
            pdf_uuid: pdfUuid,
        });

        if (error) {
            throw error;
        }

        return {
            success: true,
            message: `Documents associated with UUID ${pdfUuid} have been deleted.`,
        };
    } catch (error) {
        console.error('Error deleting document embeddings:', error);
        // throw new Error('Failed to delete document embeddings');
    }
}


export async function matchDocumentEmbeddings(queryEmbedding: number[], matchCount: number, filter: string, docUuid: string) {
  try {
    const { data, error } = await SupabaseClient.rpc('match_document_embeddings', {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      filter: filter,
      doc_uuid: docUuid
    });

    if (error) throw error;
    if(!data) return []
    return data;
  } catch (error) {
    throw new Error('Failed to match document embeddings');
  }
}

