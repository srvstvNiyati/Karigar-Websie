import { GenerateImageForm } from "./generate-image-form";
import { SidebarTrigger } from "@/components/app-sidebar";

export default function GenerateImagePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI Image Generation
          </h1>
          <p className="text-muted-foreground">
            Create compelling 3D product visuals from a simple description.
          </p>
        </div>
      </header>

      <GenerateImageForm />
    </div>
  );
}
