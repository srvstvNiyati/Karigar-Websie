
"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Upload, Link } from "lucide-react";

export function StepDataCollection() {
  const form = useFormContext();

  return (
    <div className="space-y-8">
        <FormField
          control={form.control}
          name="productImages"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Upload product images/videos</FormLabel>
              <FormControl>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG, GIF, MP4, MOV</p>
                        </div>
                        <Input 
                            id="dropzone-file" 
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={(e) => onChange(e.target.files)}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                        />
                    </label>
                </div> 
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="socialMediaLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Provide social media links or existing online presence</FormLabel>
                <div className="flex w-full items-center space-x-2">
                    <div className="relative flex-grow">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="url" placeholder="https://instagram.com/your_handle" {...field} className="pl-10" />
                    </div>
                    <Button type="button" variant="secondary">Connect</Button>
                </div>
              <FormMessage />
            </FormItem>
          )}
        />
         <div>
            <h3 className="text-lg font-semibold">Marketplace Integrations</h3>
            <p className="text-sm text-muted-foreground mb-4">Connect your existing marketplace accounts.</p>
            <div className="flex gap-4">
                <Button variant="outline">Connect Etsy</Button>
                <Button variant="outline">Connect Amazon Karigar</Button>
            </div>
         </div>
    </div>
  );
}
