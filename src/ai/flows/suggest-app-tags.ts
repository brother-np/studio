'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant keyword tags for submitted apps based on their description.
 *
 * - suggestAppTags - A function that handles the suggestion of app tags.
 * - SuggestAppTagsInput - The input type for the suggestAppTags function.
 * - SuggestAppTagsOutput - The return type for the suggestAppTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppTagsInputSchema = z.object({
  description: z.string().describe('The description of the app.'),
});
export type SuggestAppTagsInput = z.infer<typeof SuggestAppTagsInputSchema>;

const SuggestAppTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested keyword tags for the app.'),
});
export type SuggestAppTagsOutput = z.infer<typeof SuggestAppTagsOutputSchema>;

export async function suggestAppTags(input: SuggestAppTagsInput): Promise<SuggestAppTagsOutput> {
  return suggestAppTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAppTagsPrompt',
  input: {schema: SuggestAppTagsInputSchema},
  output: {schema: SuggestAppTagsOutputSchema},
  prompt: `You are an expert in identifying relevant keyword tags for mobile applications.

  Given the following app description, please suggest a list of keyword tags that would improve its searchability. The tags should be relevant to the app's functionality and target audience.

  Description: {{{description}}}

  Please return the tags as an array of strings.
  `,
});

const suggestAppTagsFlow = ai.defineFlow(
  {
    name: 'suggestAppTagsFlow',
    inputSchema: SuggestAppTagsInputSchema,
    outputSchema: SuggestAppTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
