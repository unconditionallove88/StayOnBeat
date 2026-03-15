'use server';

/**
 * @fileOverview A Genkit flow for moderating chat messages in "The Witnesses" space.
 * 
 * - moderateMessage - Checks if a message violates community guidelines.
 * - ModerationInput - The input type (text).
 * - ModerationOutput - The result (isSafe, reason).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ModerationInputSchema = z.object({
  text: z.string().describe('The message content to moderate.'),
});

const ModerationOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the message is safe to post.'),
  reason: z.string().optional().describe('Reason for rejection if unsafe.'),
  filteredText: z.string().describe('The original text, or a sanitized version.'),
});

export type ModerationInput = z.infer<typeof ModerationInputSchema>;
export type ModerationOutput = z.infer<typeof ModerationOutputSchema>;

export async function moderateMessage(input: ModerationInput): Promise<ModerationOutput> {
  return moderateMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateMessagePrompt',
  input: { schema: ModerationInputSchema },
  output: { schema: ModerationOutputSchema },
  prompt: `You are an AI moderator for a community chat called "The Witnesses." 
The community is based on "Unconditional Love" and "Collective Care."

Strictly prohibit and flag:
- Hate speech (homophobia, racism, sexism, etc.)
- Promoting or selling illegal drugs
- Solicitation of prostitution
- Political discussions or divisive political rhetoric
- Unkindness, bullying, or harassment
- Aggressiveness, anger, or hostility
- Intolerance toward others

Message to evaluate: "{{{text}}}"

If the message is unsafe or violates these guidelines, set isSafe to false and provide a kind but firm reason. 
If it's safe but contains mild profanity, you may sanitize it.`,
});

const moderateMessageFlow = ai.defineFlow(
  {
    name: 'moderateMessageFlow',
    inputSchema: ModerationInputSchema,
    outputSchema: ModerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
