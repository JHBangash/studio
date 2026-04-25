'use server';
/**
 * @fileOverview An AI agent that analyzes uploaded document content to suggest its type and extract key metadata.
 *
 * - extractDocumentMetadata - A function that handles the document metadata extraction process.
 * - ExtractDocumentMetadataInput - The input type for the extractDocumentMetadata function.
 * - ExtractDocumentMetadataOutput - The return type for the extractDocumentMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDocumentMetadataInputSchema = z.object({
  documentContent: z
    .string()
    .describe(
      "The content of the document to analyze. This can be text or a data URI if the document is an image/PDF. If it's a data URI, it must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractDocumentMetadataInput = z.infer<
  typeof ExtractDocumentMetadataInputSchema
>;

const ExtractDocumentMetadataOutputSchema = z.object({
  documentType: z
    .string()
    .describe(
      'The suggested type of the document (e.g., "Invoice", "Contract", "HR Form", "Receipt", "Agreement").'
    ),
  metadata: z
    .record(z.string(), z.string())
    .describe(
      'A dictionary of extracted key-value metadata pairs (e.g., {"Vendor Name": "Acme Corp", "Date": "2023-10-26", "Amount": "123.45"}).'
    ),
});
export type ExtractDocumentMetadataOutput = z.infer<
  typeof ExtractDocumentMetadataOutputSchema
>;

export async function extractDocumentMetadata(
  input: ExtractDocumentMetadataInput
): Promise<ExtractDocumentMetadataOutput> {
  return extractDocumentMetadataFlow(input);
}

const extractDocumentMetadataPrompt = ai.definePrompt({
  name: 'extractDocumentMetadataPrompt',
  input: {schema: ExtractDocumentMetadataInputSchema},
  output: {schema: ExtractDocumentMetadataOutputSchema},
  prompt: `You are an expert document analyst assistant. Your task is to analyze the provided document content and extract relevant information.

First, determine the most appropriate document type from the following common categories, or suggest a new one if none fit: "Invoice", "Contract", "HR Form", "Receipt", "Agreement", "Purchase Order", "Report", "Policy Document", "Proposal", "Legal Document", "Financial Statement", "Application".

Second, identify and extract key metadata fields as key-value pairs. Prioritize fields like: "Vendor Name", "Customer Name", "Date", "Amount", "Total Amount", "Due Date", "Contract ID", "Employee Name", "Project Name", "Client Name", "Effective Date", "Expiration Date", "Policy Number", "Reference Number", "Description", "Sender", "Recipient". Ensure the keys are descriptive strings (e.g., "Total Amount") and values are also strings.

Document Content: 

{{{documentContent}}}

Provide the output in a JSON object with 'documentType' and 'metadata' fields, exactly matching the schema provided.`,
});

const extractDocumentMetadataFlow = ai.defineFlow(
  {
    name: 'extractDocumentMetadataFlow',
    inputSchema: ExtractDocumentMetadataInputSchema,
    outputSchema: ExtractDocumentMetadataOutputSchema,
  },
  async input => {
    const {output} = await extractDocumentMetadataPrompt(input);
    if (!output) {
      throw new Error('Failed to extract document metadata.');
    }
    return output;
  }
);
