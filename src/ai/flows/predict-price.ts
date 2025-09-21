'use server';
/**
 * @fileOverview AI agent to predict a fair price for an artisan's product.
 *
 * - predictPrice - A function that handles the price prediction process.
 * - PredictPriceInput - The input type for the predictPrice function.
 * - PredictPriceOutput - The return type for the predictPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictPriceInputSchema = z.object({
  productImageUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productDescription: z.string().describe('Detailed description of the product, including materials, size, and special features.'),
  craftingTime: z.number().describe('Time taken to create the product in hours.'),
  materialCost: z.number().describe('Cost of raw materials for the product.'),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).describe('The skill level of the artisan.'),
});
export type PredictPriceInput = z.infer<typeof PredictPriceInputSchema>;

const PredictPriceOutputSchema = z.object({
  priceRange: z.object({
    min: z.number().describe('The minimum suggested price.'),
    max: z.number().describe('The maximum suggested price.'),
  }).describe('The suggested price range for the product.'),
  breakdown: z.object({
    materialCost: z.number().describe('The estimated material cost.'),
    laborCost: z.number().describe('The estimated labor cost based on crafting time and skill level.'),
    artisticPremium: z.number().describe('A premium for artistic value, uniqueness, and skill.'),
  }).describe('A breakdown of the suggested price.'),
  marketComparison: z.string().describe('A brief analysis of how the suggested price compares to similar products in online marketplaces.'),
});
export type PredictPriceOutput = z.infer<typeof PredictPriceOutputSchema>;

const prompt = ai.definePrompt({
    name: 'predictPricePrompt',
    input: {schema: PredictPriceInputSchema},
    output: {schema: PredictPriceOutputSchema},
    prompt: `You are an AI expert in pricing strategies for handcrafted goods. Your task is to predict a fair price for an artisan's product.

Analyze the provided image, description, and crafting details. Consider the following factors:
- Type of craft (identified from image and description)
- Material cost
- Crafting time and skill level (to determine labor cost)
- Market demand for similar items
- Uniqueness and artistic value

All currency values should be in Indian Rupees (₹).

Artisan's Inputs:
- Product Image: {{media url=productImageUri}}
- Product Description: {{{productDescription}}}
- Crafting Time: {{{craftingTime}}} hours
- Material Cost: ₹{{{materialCost}}}
- Skill Level: {{{skillLevel}}}

Based on your analysis:
1.  Calculate a suggested price range (min and max) in INR.
2.  Provide a price breakdown in INR:
    - Material Cost: Use the provided value.
    - Labor Cost: Estimate a fair hourly wage based on skill level and craft type (e.g., Expert potter might be ₹800/hr, Beginner weaver ₹300/hr). Multiply by crafting time.
    - Artistic Premium: Add a premium based on the perceived uniqueness, complexity, and artistic merit from the image and description.
3.  Provide a short market comparison summary (e.g., "This price is competitive with similar hand-thrown ceramic mugs on platforms like Etsy, which average around ₹XX.").

Return the result in the specified JSON format.
`,
});

const predictPriceFlow = ai.defineFlow(
  {
    name: 'predictPriceFlow',
    inputSchema: PredictPriceInputSchema,
    outputSchema: PredictPriceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function predictPrice(input: PredictPriceInput): Promise<PredictPriceOutput> {
  return predictPriceFlow(input);
}
