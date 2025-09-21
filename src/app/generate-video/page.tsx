import { GenerateVideoForm } from "./generate-video-form";
import { SidebarTrigger } from "@/components/app-sidebar";

export default function GenerateVideoPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Video Generation
          </h1>
          <p className="text-muted-foreground">
            Turn your ideas into short, engaging videos for social media.
          </p>
        </div>
      </header>

      <GenerateVideoForm />
    </div>
  );
}
