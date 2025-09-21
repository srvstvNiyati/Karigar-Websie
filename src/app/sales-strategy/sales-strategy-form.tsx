"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { suggestSalesStrategy } from "@/ai/flows/suggest-sales-strategy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Rocket, Lightbulb, BarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  productData: z.string().min(10, "Please provide product data."),
  businessData: z.string().min(10, "Please provide business data."),
  growthRate: z.coerce.number().min(0, "Growth rate must be positive."),
  materialsUsed: z.string().min(10, "Please describe materials used."),
});

type FormValues = z.infer<typeof formSchema>;
type StrategyOutput = {
  suggestedStrategy: string;
  reasoning: string;
};

export function SalesStrategyForm() {
  const [strategy, setStrategy] = useState<StrategyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productData: "",
      businessData: "",
      growthRate: 0,
      materialsUsed: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setStrategy(null);

    try {
      const result = await suggestSalesStrategy(values);
      setStrategy(result);
    } catch (error) {
      console.error("Sales strategy error:", error);
      toast({
        title: "Error Generating Strategy",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Rocket className="w-6 h-6 text-primary" /> AI Sales Strategist</CardTitle>
              <CardDescription>
                Fill in your business details to receive a custom sales strategy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="productData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descriptions, pricing, variations..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Performance</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Revenue, expenses, profit margins..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="growthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Growth Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="materialsUsed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materials Used</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List of materials, costs, sourcing..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {isLoading && (
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
                )}
                {!isLoading && !strategy && (
                <div className="text-center text-muted-foreground p-8 border rounded-lg mt-4 h-64 flex flex-col items-center justify-center">
                    <Lightbulb className="mx-auto h-16 w-16 mb-2 opacity-50" />
                    <p>Your custom strategy will appear here.</p>
                </div>
                )}
                {strategy && (
                <div className="space-y-4 border rounded-lg p-4 mt-4">
                    <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary"/> Suggested Strategy</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{strategy.suggestedStrategy}</p>
                    </div>
                    <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2"><BarChart className="w-5 h-5 text-primary"/> Reasoning</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{strategy.reasoning}</p>
                    </div>
                </div>
                )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Rocket className="mr-2 h-4 w-4" />
                )}
                Suggest Strategy
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
  );
}
