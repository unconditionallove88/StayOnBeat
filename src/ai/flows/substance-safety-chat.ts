
'use server';
/**
 * @fileOverview A Genkit flow for answering substance safety questions with conversational memory and recovery reminders.
 * Deeply integrated with Pulse Lab data and monitored by Pulse Guardian.
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
  substance: z.string().describe('The substance(s) the user has already taken or is asking about from Pulse Lab.'),
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
  prompt: `You are the StayOnBeat Safety Advisor, acting as the voice of the Pulse Guardian.
Your goal is to provide clinical yet compassionate harm reduction advice based on the user's Pulse Lab logs and health profile.

Context from Pulse Lab & Guardian:
- Current Session Intake: {{{substance}}}
- User Meds: {{#each userProfile.medications}}{{{this}}}, {{/each}}
- Conditions: {{#each userProfile.healthConditions}}{{{this}}}, {{/each}}

User Question: {{{question}}}

{{#if history}}
Previous Conversation:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}
{{/if}}

CRITICAL HARM REDUCTION GUIDELINES:
1. If the user asks about MIXING substances (e.g., Alcohol + GHB, Stimulant + Stimulant, SSRIs + MDMA), provide an immediate, unambiguous **CRITICAL WARNING** in all-caps.
2. Reference their specific Pulse Lab intake in every response to show you are "connected."
3. Mention that your analysis is monitored by the Pulse Guardian protocol.
4. Always include hydration and electrolyte reminders for physical sessions.
5. Limit responses to 4 concise bullet points. 
6. Use standard Sentence case. 
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
