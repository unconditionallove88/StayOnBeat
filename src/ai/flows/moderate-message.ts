
'use server';

/**
 * @fileOverview A Genkit flow for moderating chat messages in "The Witnesses" space.
 * Features: Slang detection for substances, illegal activity monitoring, and collective care enforcement.
 * 
 * - moderateMessage - Checks if a message violates community guidelines or safety protocols.
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
  prompt: `You are the Pulse Guardian AI Moderator for "The Witnesses" community chat.
The community is based on "Unconditional Love" and "Collective Care."

Your primary objective is to maintain a safe sanctuary. You must scan for and immediately flag:
1. ILLEGAL ACTIVITIES: Selling, buying, or promoting substances.
2. MASKED DRUG NAMES (SLANG):
   - 2-MMC / 3-MMC / 4-MMC: "meow meow", "meuw meuw", "m-cat", "drone", "bubbles", "mephy".
   - GHB / GBL: "G", "Gina", "Liquid X".
   - MDMA / Ecstasy: "Molly", "M", "Mandy", "E".
   - Cocaine: "C", "Coke", "Snow", "White".
   - Ketamine: "K", "Special K", "Kitty".
3. HATE SPEECH: Any homophobia, racism, sexism, or discrimination.
4. AGGRESSION: Bullying, unkindness, or divisive political rhetoric.

Message to evaluate: "{{{text}}}"

If the message is unsafe, set isSafe to false and provide a reason grounded in care.
If it is safe, set isSafe to true.
Use standard Sentence case for the reason.`,
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
