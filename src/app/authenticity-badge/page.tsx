import { AuthenticityBadgeForm } from "./authenticity-badge-form";
import { SidebarTrigger } from "@/components/app-sidebar";

export default function AuthenticityBadgePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            AI-Authenticity Badge
          </h1>
          <p className="text-muted-foreground">
            Get your craft authenticated and receive a digital heritage certificate.
          </p>
        </div>
      </header>

      <AuthenticityBadgeForm />
    </div>
  );
}
