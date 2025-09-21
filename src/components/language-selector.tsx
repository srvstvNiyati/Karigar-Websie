
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { indianLanguages } from "@/lib/languages"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSelector() {
  const [open, setOpen] = React.useState(false)
  const { language, setLanguage } = useLanguage();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between"
        >
          <Globe className="mr-2" />
          {indianLanguages.find((lang) => lang.code === language)?.name || "Language"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {indianLanguages.map((lang) => (
              <CommandItem
                key={lang.code}
                value={lang.name}
                onSelect={(currentValue) => {
                  setLanguage(lang.code)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    language === lang.code ? "opacity-100" : "opacity-0"
                  )}
                />
                {lang.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
