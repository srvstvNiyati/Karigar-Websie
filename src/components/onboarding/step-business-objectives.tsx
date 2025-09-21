
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const objectives = [
  { id: "increase-sales", label: "Increase sales" },
  { id: "expand-markets", label: "Expand to new markets" },
  { id: "preserve-tradition", label: "Preserve tradition" },
  { id: "digital-marketing", label: "Improve digital marketing" },
  { id: "training-support", label: "Get training support" },
  { id: "collaboration", label: "Find collaboration opportunities" },
];

export function StepBusinessObjectives() {
  const form = useFormContext();

  return (
    <div className="space-y-8">
        <FormField
          control={form.control}
          name="objectives"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg font-semibold">What are your main business goals?</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {objectives.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="objectives"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                        >
                           <FormControl>
                                <Checkbox
                                    className="peer sr-only"
                                    id={item.id}
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value) => value !== item.id
                                            )
                                            );
                                    }}
                                />
                           </FormControl>
                           <label
                                htmlFor={item.id}
                                className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                                {item.label}
                            </label>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
}
