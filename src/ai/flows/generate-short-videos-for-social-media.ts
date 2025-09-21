'use server';
/**
 * @fileOverview AI flow for generating short videos for social media marketing.
 *
 * - generateShortVideoForSocialMedia - A function that generates a short video based on a text prompt and optional photo.
 * - GenerateShortVideoForSocialMediaInput - The input type for the generateShortVideoForSocialMedia function.
 * - GenerateShortVideoForSocialMediaOutput - The return type for the generateShortVideoForSocialMedia function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as fs from 'fs';
import { Readable } from 'stream';
import { MediaPart } from 'genkit';

const GenerateShortVideoForSocialMediaInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired video content.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo to use as a reference for the video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type GenerateShortVideoForSocialMediaInput = z.infer<typeof GenerateShortVideoForSocialMediaInputSchema>;

const GenerateShortVideoForSocialMediaOutputSchema = z.object({
  videoDataUri: z.string().describe('The generated video as a data URI (MP4 format).'),
});

export type GenerateShortVideoForSocialMediaOutput = z.infer<typeof GenerateShortVideoForSocialMediaOutputSchema>;

export async function generateShortVideoForSocialMedia(input: GenerateShortVideoForSocialMediaInput): Promise<GenerateShortVideoForSocialMediaOutput> {
  return generateShortVideoForSocialMediaFlow(input);
}

const generateShortVideoForSocialMediaFlow = ai.defineFlow(
  {
    name: 'generateShortVideoForSocialMediaFlow',
    inputSchema: GenerateShortVideoForSocialMediaInputSchema,
    outputSchema: GenerateShortVideoForSocialMediaOutputSchema,
  },
  async input => {
    let operation;
    if (input.photoDataUri) {
      const base64Image = input.photoDataUri.split(',')[1];

      let initialOperation = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
        prompt: [
          {
            text: input.prompt,
          },
          {
            media: {
              contentType: input.photoDataUri.substring(5, input.photoDataUri.indexOf(';')),
              url: input.photoDataUri,
            },
          },
        ],
        config: {
          durationSeconds: 5,
          aspectRatio: '9:16',
          personGeneration: 'allow_adult',
        },
      });

      operation = initialOperation.operation;

    } else {
      let initialOperation = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
        prompt: input.prompt,
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });

      operation = initialOperation.operation;
    }

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

      // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    const videoDataUri = `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`;

    return { videoDataUri: videoDataUri };
  }
);
