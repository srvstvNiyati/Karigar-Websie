
'use server';

/**
 * @fileOverview An AI agent to generate product images with a 3D view.
 *
 * - generateProductImages - A function that handles the product image generation process.
 * - GenerateProductImagesInput - The input type for the generateProductImages function.
 * - GenerateProductImagesOutput - The return type for the generateProductImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductImagesInputSchema = z.object({
  productDescription: z.string().describe('The detailed description of the product.'),
  stylePreference: z.string().describe('The preferred style for the generated image (e.g., minimalist, rustic, modern).'),
  viewPreference: z.string().describe('The preferred view for the generated image (e.g., front, side, 3D).'),
  productImageUri: z.string().optional().describe('An optional image of the product to use as a reference.'),
});
export type GenerateProductImagesInput = z.infer<typeof GenerateProductImagesInputSchema>;

const GenerateProductImagesOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated product image.'),
});
export type GenerateProductImagesOutput = z.infer<typeof GenerateProductImagesOutputSchema>;

export async function generateProductImages(input: GenerateProductImagesInput): Promise<GenerateProductImagesOutput> {
  return generateProductImagesFlow(input);
}

const generateProductImagesFlow = ai.defineFlow(
  {
    name: 'generateProductImagesFlow',
    inputSchema: GenerateProductImagesInputSchema,
    outputSchema: GenerateProductImagesOutputSchema,
  },
  async input => {
    const prompt: any[] = [
        {text: `Generate a product image with the following description: ${input.productDescription}, style: ${input.stylePreference}, view: ${input.viewPreference}. Make it photorealistic.`},
    ];

    if (input.productImageUri) {
        prompt.push({media: {url: input.productImageUri}});
    }

    const {media} = await ai.generate({
      model: input.productImageUri ? 'googleai/gemini-2.5-flash-image-preview' : 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt,
       ...(input.productImageUri && {config: {responseModalities: ['TEXT', 'IMAGE']}})
    });

    if (!media || !media.url) {
      throw new Error('Could not generate image.');
    }

    return {imageUrl: media.url};
  }
);
