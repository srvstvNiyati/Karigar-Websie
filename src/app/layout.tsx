
"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChatAssistant } from "@/components/chat-assistant";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DashboardHeader } from "@/components/dashboard-header";
import { usePathname } from "next/navigation";
import { DevicePreviewProvider, useDevicePreview } from "@/contexts/device-preview-context";
import { DevicePreviewControls } from "@/components/device-preview-controls";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageProvider } from "@/contexts/language-context";

function LayoutContent({ children }: { children: ReactNode }) {
    const { width } = useDevicePreview();
    const isMobile = useIsMobile();
    
    const [effectiveWidth, setEffectiveWidth] = useState('100%');
    
    useEffect(() => {
        if (isMobile === undefined) return;
        setEffectiveWidth(isMobile ? '100%' : width);
    }, [isMobile, width]);
    
    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-col flex-1 overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto bg-muted/40 p-4 lg:p-6 transition-all duration-300 ease-in-out">
                    <div
                        className={cn(
                            "mx-auto transition-all duration-500 ease-in-out",
                            effectiveWidth !== '100%' && "shadow-2xl ring-1 ring-black/10 rounded-lg overflow-hidden"
                        )}
                        style={{ maxWidth: effectiveWidth }}
                    >
                        <div className={cn(effectiveWidth !== '100%' && "bg-background")}>
                            <div className="p-6 lg:p-8 fade-in">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;700&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@700&display=swap" rel="stylesheet" />
            </head>
            <body className="font-body antialiased" />
        </html>
    );
  }
  
  const isDashboard = pathname !== '/';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DevicePreviewProvider>
            <LanguageProvider>
              {isDashboard ? (
                  <LayoutContent>{children}</LayoutContent>
              ) : (
                  <div className="flex flex-col min-h-screen">
                      <Header />
                      <main className="flex-1">
                          {children}
                      </main>
                      <Footer />
                  </div>
              )}
              
              <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" className="rounded-full w-14 h-14 shadow-lg transition-transform duration-300 hover:scale-110">
                      <MessageCircle className="w-6 h-6" />
                      <span className="sr-only">Open AI Assistant</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-lg p-0">
                    <SheetHeader className="p-4 border-b">
                      <SheetTitle className="font-headline">AI Assistant</SheetTitle>
                    </SheetHeader>
                    <div className="h-[calc(100svh-4.5rem)]">
                      <ChatAssistant />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <Toaster />
            </LanguageProvider>
          </DevicePreviewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
