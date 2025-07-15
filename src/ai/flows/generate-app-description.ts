'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an app description based on its name.
 *
 * - generateAppDescription - A function that handles the generation of an app description.
 * - GenerateAppDescriptionInput - The input type for the generateAppDescription function.
 * - GenerateAppDescriptionOutput - The return type for the generateAppDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the app.'),
});
export type GenerateAppDescriptionInput = z.infer<typeof GenerateAppDescriptionInputSchema>;

const GenerateAppDescriptionOutputSchema = z.object({
  description: z.string().describe('A generated one or two-sentence description for the app.'),
});
export type GenerateAppDescriptionOutput = z.infer<typeof GenerateAppDescriptionOutputSchema>;

export async function generateAppDescription(input: GenerateAppDescriptionInput): Promise<GenerateAppDescriptionOutput> {
  return generateAppDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppDescriptionPrompt',
  input: {schema: GenerateAppDescriptionInputSchema},
  output: {schema: GenerateAppDescriptionOutputSchema},
  prompt: `You are a creative mobile app marketer.

  Given the following app name, please generate a concise and engaging one or two-sentence marketing description for it. The app is targeted at a Nepali audience.

  App Name: {{{name}}}

  Please return the description as a single string.
  `,
});

const generateAppDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAppDescriptionFlow',
    inputSchema: GenerateAppDescriptionInputSchema,
    outputSchema: GenerateAppDescriptionOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('AI App Description Generation Error:', error);
      // Return an empty string if the AI fails
      return { description: '' };
    }
  }
);
