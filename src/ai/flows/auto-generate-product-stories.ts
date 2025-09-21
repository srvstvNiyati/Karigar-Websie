'use server';

/**
 * @fileOverview A product story generation AI agent.
 *
 * - generateProductStories - A function that handles the product story generation process.
 * - GenerateProductStoriesInput - The input type for the generateProductStories function.
 * - GenerateProductStoriesOutput - The return type for the generateProductStories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductStoriesInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      'A voice recording or video of the artisan describing their product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  productDetails: z.string().describe('The name and description of the product.'),
  targetLanguages: z.array(z.string()).describe('The list of languages to translate the product story to.'),
});
export type GenerateProductStoriesInput = z.infer<typeof GenerateProductStoriesInputSchema>;

const StorySchema = z.object({
  craftDescription: z.string().describe("A detailed overview of the craft, its purpose, and aesthetic qualities."),
  makingTechniques: z.string().describe("Step-by-step or descriptive explanations of how the craft is made, including specific tools and materials."),
  historyOfCraft: z.string().describe("Any historical origins, evolution, or significant periods mentioned."),
  culturalReferences: z.string().describe("Connections to specific cultures, traditions, rituals, or social contexts."),
  aboutCraftsperson: z.string().describe("Information about the user's journey, passion, or personal connection to the craft."),
});

const GenerateProductStoriesOutputSchema = z.object({
  originalTranscription: z.string().describe('The transcription of the original voice recording or video.'),
  translatedStories: z.record(z.string(), z.string()).describe('A map of language code to the translated product story in that language.'),
  craftStory: StorySchema.optional().describe('A structured story of the craft if a video was provided.'),
  qrCodeUrl: z.string().optional().describe('A URL for a QR code linking to the craft story.'),
});
export type GenerateProductStoriesOutput = z.infer<typeof GenerateProductStoriesOutputSchema>;

export async function generateProductStories(input: GenerateProductStoriesInput): Promise<GenerateProductStoriesOutput> {
  return generateProductStoriesFlow(input);
}

const transcribeAndTranslatePrompt = ai.definePrompt({
  name: 'transcribeAndTranslatePrompt',
  input: {schema: GenerateProductStoriesInputSchema},
  prompt: `You are an AI assistant helping artisans create product stories for their products.

The artisan has provided a media file describing their product and its story. 
First, transcribe the media file to text. 
Then, using the transcription and product details, generate engaging product stories in the following languages:

{{#each targetLanguages}}
- {{this}}
{{/each}}

Make sure to take into consideration the product details when generating the product stories.

Product Details: {{{productDetails}}}
Media File: {{media url=mediaDataUri}}

Return ONLY the transcription of the original recording and the translated product stories in a JSON object with keys 'originalTranscription' and 'translatedStories'.`,
});

const videoStoryPrompt = ai.definePrompt({
    name: 'videoStoryPrompt',
    input: { schema: z.object({ mediaDataUri: z.string(), productDetails: z.string() }) },
    output: { schema: StorySchema },
    prompt: `You are an expert at creating compelling narratives from video. An artisan has uploaded a video about their craft. Analyze the video's audio and visual content to extract key information and synthesize it into a cohesive story.

From the video, extract the following information:
1. Craft Description: A detailed overview of the craft, its purpose, and aesthetic qualities.
2. Making Techniques: Explanations of how the craft is made, including tools and materials.
3. History of the Craft: Any historical origins or evolution mentioned.
4. Cultural References: Connections to specific traditions, rituals, or social contexts.
5. About the Craftsperson: The artisan's personal journey, passion, or connection to the craft.

Synthesize this information into a natural, engaging narrative.

Product Details: {{{productDetails}}}
Video File: {{media url=mediaDataUri}}

Return the structured story in the specified JSON format.`,
});


const generateProductStoriesFlow = ai.defineFlow(
  {
    name: 'generateProductStoriesFlow',
    inputSchema: GenerateProductStoriesInputSchema,
    outputSchema: GenerateProductStoriesOutputSchema,
  },
  async input => {
    const isVideo = input.mediaDataUri.startsWith('data:video');
    let craftStory: z.infer<typeof StorySchema> | undefined = undefined;
    let qrCodeUrl: string | undefined = undefined;

    // Common transcription and translation for both audio and video
    const { output: transcriptionOutput } = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: `Transcribe the following media file: {{media url=mediaDataUri}}`,
    });
    const originalTranscription = transcriptionOutput!.text!;
    
    const translatedStories: Record<string, string> = {};
    for (const lang of input.targetLanguages) {
        const { output: translationOutput } = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: `Translate the following text to ${lang}: "${originalTranscription}"`,
        });
        translatedStories[lang] = translationOutput!.text!;
    }

    if (isVideo) {
      // If it's a video, generate the structured story
      const { output } = await videoStoryPrompt({
          mediaDataUri: input.mediaDataUri,
          productDetails: input.productDetails,
      });
      craftStory = output;

      if (craftStory) {
        const storyText = `
        # ${input.productDetails}\n\n
        ## About the Craft\n
        ${craftStory.craftDescription}\n\n
        ## Making Techniques\n
        ${craftStory.makingTechniques}\n\n
        ## History\n
        ${craftStory.historyOfCraft}\n\n
        ## Cultural Significance\n
        ${craftStory.culturalReferences}\n\n
        ## About the Artisan\n
        ${craftStory.aboutCraftsperson}
        `;
        qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storyText)}`;
      }
    }

    return {
      originalTranscription,
      translatedStories,
      craftStory,
      qrCodeUrl,
    };
  }
);
