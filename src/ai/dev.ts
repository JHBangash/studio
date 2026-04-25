import { config } from 'dotenv';
config();

import '@/ai/flows/extract-document-metadata.ts';
import '@/ai/flows/summarize-document-for-review.ts';