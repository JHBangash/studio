'use server';
/**
 * @fileOverview A Genkit flow for summarizing document content, extracting key information, and identifying critical clauses.
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const SummarizeDocumentInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The full text content of the document to be summarized.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

// Output Schema
const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document.'),
  keyInformation: z
    .array(z.string())
    .describe('A list of key information points extracted from the document.'),
  criticalClauses: z
    .array(z.string())
    .describe('A list of critical clauses identified in the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

// Prompt definition
const summarizeDocumentPrompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `You are an expert document analyst. Your task is to provide a concise summary of the given document.
Additionally, you need to extract and list the most important key information points and any critical clauses present in the document.

Document Content:
{{{documentContent}}}

Please provide your response in the following structured format, including a summary, a list of key information, and a list of critical clauses.`,
});

// Flow definition
const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await summarizeDocumentPrompt(input);
    return output!;
  }
);

// Wrapper function
export async function summarizeDocument(
  input: SummarizeDocumentInput
): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}
