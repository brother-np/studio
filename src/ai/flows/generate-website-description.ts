'use server';

/**
 * @fileOverview A Genkit flow to generate a marketing description for the NepaliAppHub website.
 *
 * - generateWebsiteDescription - A function that generates a description for the website.
 * - GenerateWebsiteDescriptionInput - The input type for the generateWebsiteDescription function.
 * - GenerateWebsiteDescriptionOutput - The return type for the generateWebsiteDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteDescriptionInputSchema = z.object({}).describe("An empty input object.");
export type GenerateWebsiteDescriptionInput = z.infer<typeof GenerateWebsiteDescriptionInputSchema>;

const GenerateWebsiteDescriptionOutputSchema = z.object({
  description: z.string().describe('A marketing description for the NepaliAppHub website.'),
});
export type GenerateWebsiteDescriptionOutput = z.infer<typeof GenerateWebsiteDescriptionOutputSchema>;

export async function generateWebsiteDescription(input: GenerateWebsiteDescriptionInput): Promise<GenerateWebsiteDescriptionOutput> {
  return generateWebsiteDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsiteDescriptionPrompt',
  input: {schema: GenerateWebsiteDescriptionInputSchema},
  output: {schema: GenerateWebsiteDescriptionOutputSchema},
  prompt: `You are a creative marketing copywriter. Your task is to write a compelling and concise description for a website called "NepaliAppHub".

Here are the key details about the website:
- **Name:** NepaliAppHub
- **Purpose:** It's a curated directory and discovery platform for mobile and desktop applications that are either made by developers from Nepal or are specifically targeted towards a Nepali audience.
- **Key Features:**
    - A homepage that showcases a collection of apps.
    - Users can search for apps by name.
    - Users can filter apps by categories like 'Finance', 'E-commerce', 'Utilities', 'Entertainment', 'Games', 'News', and 'Food & Drink'.
    - Each app has its own card with an icon, name, description, and category.
    - A "Download" button on each app card reveals download links for different platforms (like Android and Windows).
    - It has a clean, modern design with a red, white, and blue color scheme, inspired by the Nepali flag.
- **Target Audience:** Anyone interested in finding or promoting Nepali-centric applications.

Please generate a single, engaging paragraph that can be used on the website's homepage to welcome visitors and explain what the site is about. The tone should be professional, welcoming, and highlight the value of discovering community-focused apps.
  `,
});

const generateWebsiteDescriptionFlow = ai.defineFlow(
  {
    name: 'generateWebsiteDescriptionFlow',
    inputSchema: GenerateWebsiteDescriptionInputSchema,
    outputSchema: GenerateWebsiteDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
