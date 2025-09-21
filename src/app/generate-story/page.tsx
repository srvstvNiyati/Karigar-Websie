"use client";

import dynamic from 'next/dynamic';
import { SidebarTrigger } from "@/components/app-sidebar";

const GenerateStoryForm = dynamic(
  () => import('./generate-story-form').then(mod => mod.GenerateStoryForm),
  { ssr: false }
);

export default function GenerateStoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Storyteller
          </h1>
          <p className="text-muted-foreground">
            Record your product's story and get it translated instantly.
          </p>
        </div>
      </header>

      <GenerateStoryForm />
    </div>
  );
}
