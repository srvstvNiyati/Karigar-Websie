
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { navLinks, type NavLink } from "@/lib/nav-links";

export function AppSidebar() {
  return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
         <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b h-16 flex items-center">
              <Logo />
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="py-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <SheetClose asChild>
                      <SidebarLink link={link} />
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(className)}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
                 <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                 </SheetHeader>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b h-16 flex items-center">
                        <Logo />
                    </div>
                    <nav className="flex-1 overflow-y-auto">
                        <ul className="py-2">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <SheetClose asChild>
                                        <SidebarLink link={link} />
                                    </SheetClose>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    )
}

function SidebarLink({ link }: { link: NavLink }) {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  const linkContent = (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-md p-3 mx-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent/50"
      )}
    >
      {link.icon}
      <span>{link.label}</span>
    </Link>
  );

  return linkContent;
}
