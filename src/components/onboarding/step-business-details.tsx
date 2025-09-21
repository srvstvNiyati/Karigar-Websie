
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function StepBusinessDetails() {
  const form = useFormContext();

  return (
    <div className="space-y-8">
        <FormField
          control={form.control}
          name="craftType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">What is your primary craft or art form?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your craft..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="handloom">Handloom</SelectItem>
                  <SelectItem value="pottery">Pottery</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="woodwork">Woodwork</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="embroidery">Embroidery</SelectItem>
                   <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">How many years of experience do you have?</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessScale"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg font-semibold">What is the scale of your business?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <FormItem>
                    <FormControl>
                        <RadioGroupItem value="individual" id="individual" className="peer sr-only"/>
                    </FormControl>
                    <label htmlFor="individual" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        Individual
                    </label>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                         <RadioGroupItem value="family-run" id="family-run" className="peer sr-only"/>
                    </FormControl>
                     <label htmlFor="family-run" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        Family-run
                    </label>
                  </FormItem>
                   <FormItem>
                    <FormControl>
                        <RadioGroupItem value="cooperative" id="cooperative" className="peer sr-only"/>
                    </FormControl>
                     <label htmlFor="cooperative" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                       Cooperative
                    </label>
                  </FormItem>
                   <FormItem>
                    <FormControl>
                        <RadioGroupItem value="small-enterprise" id="small-enterprise" className="peer sr-only"/>
                    </FormControl>
                    <label htmlFor="small-enterprise" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                         Small Enterprise
                    </label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
}
