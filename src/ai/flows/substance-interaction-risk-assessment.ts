
'use server';
/**
 * @fileOverview A Genkit flow for assessing substance interaction risks based on user health profiles and intended substance intake.
 *
 * - substanceInteractionRiskAssessment - A function that handles the substance interaction risk assessment process.
 * - SubstanceInteractionRiskAssessmentInput - The input type for the substanceInteractionRiskAssessment function.
 * - SubstanceInteractionRiskAssessmentOutput - The return type for the substanceInteractionRiskAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubstanceInteractionRiskAssessmentInputSchema = z.object({
  healthConditions: z.array(z.string()).describe('A list of the user\'s current health conditions (e.g., "asthma", "heart disease", "diabetes").'),
  medications: z.array(z.string()).describe('A list of medications the user is currently taking (e.g., "SSRI", "insulin", "blood pressure medication").'),
  substancesToTake: z.array(z.string()).describe('A list of substances the user plans to take (e.g., "Alcohol", "MDMA", "Cannabis", "2-MMC", "4-MMC", "3-MMC", "GHB", "Cocaine").'),
  age: z.number().int().min(18).describe('The user\'s age in years.'),
  weightKg: z.number().positive().describe('The user\'s weight in kilograms.'),
});
export type SubstanceInteractionRiskAssessmentInput = z.infer<typeof SubstanceInteractionRiskAssessmentInputSchema>;

const SubstanceInteractionRiskAssessmentOutputSchema = z.object({
  overallRiskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Overall risk level for the combination of substances and health profile.'),
  summary: z.string().describe('A concise summary of the risk assessment.'),
  detailedExplanation: z.string().describe('A detailed explanation of potential interactions, their mechanisms, and health implications.'),
  harmReductionRecommendations: z.array(z.string()).describe('Actionable harm reduction strategies and safety tips specific to the assessed risks.'),
  drugInteractions: z.array(z.object({
    drug1: z.string().describe('The first substance or medication involved in the interaction.'),
    drug2: z.string().describe('The second substance or medication involved in the interaction.'),
    severity: z.enum(['Minor', 'Moderate', 'Major']).describe('The severity of the interaction.'),
    effect: z.string().describe('The potential effect or outcome of this interaction.'),
  })).describe('Specific drug-drug or drug-medication interactions found.'),
});
export type SubstanceInteractionRiskAssessmentOutput = z.infer<typeof SubstanceInteractionRiskAssessmentOutputSchema>;

export async function substanceInteractionRiskAssessment(input: SubstanceInteractionRiskAssessmentInput): Promise<SubstanceInteractionRiskAssessmentOutput> {
  return substanceInteractionRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'substanceInteractionRiskAssessmentPrompt',
  input: {schema: SubstanceInteractionRiskAssessmentInputSchema},
  output: {schema: SubstanceInteractionRiskAssessmentOutputSchema},
  prompt: `You are an expert in pharmacology, toxicology, and harm reduction.

You will provide a comprehensive, personalized, and actionable risk assessment.

User's Health Profile:
- Age: {{{age}}}
- Weight: {{{weightKg}}} kg
- Conditions: {{#each healthConditions}}{{{this}}}, {{/each}}
- Medications: {{#each medications}}{{{this}}}, {{/each}}

Substances: {{#each substancesToTake}}{{{this}}}, {{/each}}

Specific Risks to Check (CRITICAL):
- SSRIs/SNRIs + MDMA/3-MMC/4-MMC: Critical Serotonin Syndrome risk.
- Alcohol + GHB/Benzos: Extreme respiratory failure risk.
- Stimulant + Stimulant: Cardiovascular emergency risk.
- MDMA Dosage: Max 1.5mg/kg. Flag if exceeded.

Response Format:
- Use standard Sentence case for descriptions.
- Use **BOLD ALL-CAPS** strictly for **CRITICAL WARNINGS** or **SUBSTANCE NAMES**.
- Summary must be under 30 words.`,
});

const substanceInteractionRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'substanceInteractionRiskAssessmentFlow',
    inputSchema: SubstanceInteractionRiskAssessmentInputSchema,
    outputSchema: SubstanceInteractionRiskAssessmentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
