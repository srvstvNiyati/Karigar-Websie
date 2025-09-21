'use server';

/**
 * @fileOverview AI agent to authenticate the cultural roots of a design.
 *
 * - authenticateDesign - A function that handles the design authentication process.
 * - AuthenticateDesignInput - The input type for the authenticateDesign function.
 * - AuthenticateDesignOutput - The return type for the authenticateDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuthenticateDesignInputSchema = z.object({
  designImageUri: z
    .string()
    .describe(
      "A photo of the design/artwork, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  artisanNotes: z.string().optional().describe('Any notes or claims from the artisan about the design\'s origin.'),
});
export type AuthenticateDesignInput = z.infer<typeof AuthenticateDesignInputSchema>;

const AuthenticateDesignOutputSchema = z.object({
  isAuthentic: z.boolean().describe('Whether the AI determines the design to be authentic to the claimed cultural roots.'),
  culturalOrigin: z.string().describe('The identified cultural origin (e.g., "Jaipur Blue Pottery", "Kanchipuram Silk Weaving").'),
  confidenceScore: z.number().describe('A confidence score (0-1) for the authentication.'),
  report: z.string().describe('A detailed report explaining the reasoning, including visual elements, patterns, and historical context.'),
  certificateData: z.object({
      artisanName: z.string().describe('The name of the artisan.'),
      craftName: z.string().describe('The name of the craft.'),
      dateOfAuthentication: z.string().describe('The date of authentication.'),
      certificateId: z.string().describe('A unique ID for the certificate.'),
  }).describe('Data for generating the digital heritage certificate.'),
});
export type AuthenticateDesignOutput = z.infer<typeof AuthenticateDesignOutputSchema>;


const prompt = ai.definePrompt({
    name: 'authenticateDesignPrompt',
    input: {schema: AuthenticateDesignInputSchema},
    output: {schema: AuthenticateDesignOutputSchema},
    prompt: `You are an AI expert in traditional Indian art and crafts. Your task is to authenticate the cultural roots of an artisan's design based on an uploaded image and notes.

Analyze the provided image for its design, patterns, motifs, color palette, and techniques. Compare these elements against a vast knowledge base of traditional Indian art forms.

Artisan's Notes: {{{artisanNotes}}}
Design Image: {{media url=designImageUri}}

Based on your analysis:
1. Determine if the design is an authentic representation of a specific traditional craft.
2. Identify the specific cultural origin (e.g., "Warli Painting," "Pattachitra," "Bandhani").
3. Provide a confidence score for your assessment.
4. Generate a detailed report explaining your reasoning.
5. If authentic, prepare the data for a digital heritage certificate. For the certificate, invent a plausible artisan name if none is provided, and generate a unique certificate ID.

Return the result in the specified JSON format.
`,
});

const authenticateDesignFlow = ai.defineFlow(
  {
    name: 'authenticateDesignFlow',
    inputSchema: AuthenticateDesignInputSchema,
    outputSchema: AuthenticateDesignOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function authenticateDesign(input: AuthenticateDesignInput): Promise<AuthenticateDesignOutput> {
  return authenticateDesignFlow(input);
}
