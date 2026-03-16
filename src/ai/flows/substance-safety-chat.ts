'use server';
/**
 * @fileOverview A Genkit flow for answering substance safety questions with conversational memory and recovery reminders.
 *
 * - aiSafetyChat - A function that handles substance safety queries.
 * - AiSafetyChatInput - The input type for the aiSafetyChat function.
 * - AiSafetyChatOutput - The return type for the aiSafetyChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const AiSafetyChatInputSchema = z.object({
  substance: z.string().describe('The substance(s) the user has already taken or is asking about.'),
  question: z.string().describe('The user\'s specific safety question.'),
  history: z.array(ChatMessageSchema).optional().describe('Previous chat history for context.'),
  userProfile: z.object({
    medications: z.array(z.string()).describe('Current medications.'),
    healthConditions: z.array(z.string()).describe('Current health conditions.'),
  }),
});
export type AiSafetyChatInput = z.infer<typeof AiSafetyChatInputSchema>;

const AiSafetyChatOutputSchema = z.object({
  answer: z.string().describe('The safety advice provided by the AI.'),
});
export type AiSafetyChatOutput = z.infer<typeof AiSafetyChatOutputSchema>;

export async function aiSafetyChat(input: AiSafetyChatInput): Promise<AiSafetyChatOutput> {
  return aiSafetyChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSafetyChatPrompt',
  input: {schema: AiSafetyChatInputSchema},
  output: {schema: AiSafetyChatOutputSchema},
  prompt: `You are a harm reduction AI expert.
The user's current session intake is: {{{substance}}}

User Profile Context:
- Meds: {{#each userProfile.medications}}{{{this}}}, {{/each}}
- Conditions: {{#each userProfile.healthConditions}}{{{this}}}, {{/each}}

{{#if history}}
Previous Conversation:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}
{{/if}}

Current Question: {{{question}}}

Guidelines:
1. Provide highly concise, bulleted safety advice based on the SPECIFIC substances logged.
2. ALWAYS include a reminder about hydration (water) and electrolyte/nutrient support (magnesium or bananas) if relevant to stimulants or physical exertion.
3. Give clear, direct responses that prioritize immediate safety and interaction risks.
4. Limit responses to a maximum of 4 bullet points. 
5. Use standard Sentence case. 
6. Use **BOLD ALL-CAPS** strictly for **CRITICAL WARNINGS** or **SUBSTANCE NAMES**.
7. Keep the total response under 100 words.`,
});

const aiSafetyChatFlow = ai.defineFlow(
  {
    name: 'aiSafetyChatFlow',
    inputSchema: AiSafetyChatInputSchema,
    outputSchema: AiSafetyChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
