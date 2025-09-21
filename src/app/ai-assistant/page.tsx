
"use client";

import dynamic from 'next/dynamic';
import { SidebarTrigger } from "@/components/app-sidebar";
import { AiAssistantIcon } from "@/components/ai-assistant-icon";
import { Skeleton } from '@/components/ui/skeleton';

const ChatAssistant = dynamic(
  () => import('@/components/chat-assistant').then(mod => mod.ChatAssistant),
  { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-full" />
  }
);


export default function AiAssistantPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <header className="flex items-center gap-4 mb-6">
        
        <AiAssistantIcon className="w-12 h-12 text-primary" />
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Voice Assistant
            </h1>
            <p className="text-muted-foreground">
            Supports Hindi, English & 10+ Indian languages
            </p>
        </div>
      </header>
      <div className="flex-1 border rounded-lg overflow-hidden">
        <ChatAssistant />
      </div>
    </div>
  );
}
