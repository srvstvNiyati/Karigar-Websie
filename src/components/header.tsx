

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, Bell } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { DevicePreviewControls } from "./device-preview-controls";
import { LanguageSelector } from "./language-selector";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

export function Header({ onExit }: { onExit?: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Logo className="mr-6" />
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="w-5 h-5" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No new notifications.</p>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="w-5 h-5" />
                  <span className="sr-only">Open Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xs">
                <SheetHeader className="mb-4">
                  <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 p-4">
                  <div className="space-y-2">
                      <p className="text-sm font-medium">Theme</p>
                      <div className="flex items-center justify-between p-2 rounded-lg border">
                          <p className="text-sm">Appearance</p>
                          <ThemeToggle />
                      </div>
                  </div>
                   <DevicePreviewControls />
                </div>
              </SheetContent>
            </Sheet>
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="#">Sign In</Link>
            </Button>
             <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-500 text-primary-foreground hover:from-orange-500 hover:to-yellow-600">
                <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                 <div className="border-t pt-4">
                  <LanguageSelector />
                 </div>
                <div className="border-t pt-4 flex flex-col space-y-2">
                    <Button variant="ghost" asChild>
                        <Link href="#">Sign In</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Get Started</Link>
                    </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
