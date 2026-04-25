"use server";

import { extractDocumentMetadata } from "@/ai/flows/extract-document-metadata";
import { z } from "zod";

const fileSchema = z.string().startsWith("data:application/pdf;base64,");

export async function extractMetadataAction(fileData: string) {
  try {
    // Basic validation, can be expanded
    if (!fileData || typeof fileData !== 'string') {
        throw new Error("Invalid file data provided.");
    }
    
    const result = await extractDocumentMetadata({ documentContent: fileData });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in extractMetadataAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during metadata extraction.";
    return { success: false, error: errorMessage };
  }
}
