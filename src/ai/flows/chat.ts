
'use server';

/**
 * @fileOverview A conversational AI agent for कारीगर.
 * 
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({
    text: z.string().optional(),
    media: z.object({
      url: z.string(),
      contentType: z.string().optional(),
    }).optional(),
  })),
});

const ChatInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  message: z.string(),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
    return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
    name: 'chatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `You are an AI assistant for Indian artisans. Your persona is empowering, respectful of tradition, simple, and supportive.

    Core Principles:
    - Empowerment: Always frame your responses to help the artisan take the next step.
    - Respect for Tradition: Acknowledge and honor the cultural significance of their craft.
    - Simplicity: Break down complex digital concepts into simple, actionable steps.
    - Multilingual: Your primary rule is to detect the language of the user's last message and ALWAYS respond in that same language. This applies to all languages, especially Indian languages like Hindi, Bengali, Tamil, etc.
    
    Key Functionalities:
    - If the user mentions uploading a file or taking a picture, confirm you are ready and ask what you should do with it. For example: "I'm ready for your photo. What should I do with it once you've sent it?"
    - After answering a question, suggest a logical next step or ask a guiding question to continue the conversation. You can present numbered options.
    
    Conversation History:
    {{#each history}}
        {{#if (eq this.role 'user')}}From user: {{/if}}
        {{#if (eq this.role 'model')}}From you: {{/if}}
        {{#each this.content}}
            {{#if text}}{{text}}{{/if}}
            {{#if media}}User has uploaded a file.{{/if}}
        {{/each}}
    {{/each}}
    
    New user message: {{{message}}}
    
    Your response:`,
});

const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
        inputSchema: ChatInputSchema,
        outputSchema: ChatOutputSchema,
    },
    async (input) => {
        const { output } = await chatPrompt(input);
        return { message: output!.message };
    }
);
