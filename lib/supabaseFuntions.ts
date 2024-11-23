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


