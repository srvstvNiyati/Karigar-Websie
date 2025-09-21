'use server';

/**
 * @fileOverview Analyzes product data, business data, growth rate, and materials used to suggest a tailored sales strategy for artisans.
 *
 * - suggestSalesStrategy - A function that suggests a sales strategy based on provided data.
 * - SalesStrategyInput - The input type for the suggestSalesStrategy function.
 * - SalesStrategyOutput - The return type for the suggestSalesStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesStrategyInputSchema = z.object({
  productData: z.string().describe('Detailed information about the artisan\'s products, including descriptions, pricing, and variations.'),
  businessData: z.string().describe('Overall business performance data, such as revenue, expenses, and profit margins.'),
  growthRate: z.number().describe('The current growth rate of the business, expressed as a percentage.'),
  materialsUsed: z.string().describe('A list of materials used in the products, including costs and sourcing information.'),
});
export type SalesStrategyInput = z.infer<typeof SalesStrategyInputSchema>;

const SalesStrategyOutputSchema = z.object({
  suggestedStrategy: z.string().describe('A tailored sales strategy based on the provided data, including specific recommendations for pricing, marketing, and sales channels.'),
  reasoning: z.string().describe('Explanation of why the suggested strategy is appropriate, based on the input data.'),
});
export type SalesStrategyOutput = z.infer<typeof SalesStrategyOutputSchema>;

export async function suggestSalesStrategy(input: SalesStrategyInput): Promise<SalesStrategyOutput> {
  return suggestSalesStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSalesStrategyPrompt',
  input: {schema: SalesStrategyInputSchema},
  output: {schema: SalesStrategyOutputSchema},
  prompt: `You are an expert in sales and marketing strategies for artisans. Based on the following information, provide a tailored sales strategy to improve their sales performance.

Product Data: {{{productData}}}
Business Data: {{{businessData}}}
Growth Rate: {{{growthRate}}}%
Materials Used: {{{materialsUsed}}}

Consider all factors and suggest concrete actions the artisan can take to improve sales.  Explain your reasoning for each suggestion.
`,
});

const suggestSalesStrategyFlow = ai.defineFlow(
  {
    name: 'suggestSalesStrategyFlow',
    inputSchema: SalesStrategyInputSchema,
    outputSchema: SalesStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
