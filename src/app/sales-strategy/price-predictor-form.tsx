
"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { predictPrice, type PredictPriceOutput } from "@/ai/flows/predict-price";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Calculator, Upload, IndianRupee, Wand2 } from "lucide-react";


const PredictPriceFormSchema = z.object({
  productDescription: z.string().min(1, "Please enter a description."),
  craftingTime: z.coerce.number().min(0, "Please enter a valid time."),
  materialCost: z.coerce.number().min(0, "Please enter a valid cost."),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

type FormValues = z.infer<typeof PredictPriceFormSchema>;

export function PricePredictorForm() {
  const [prediction, setPrediction] = useState<PredictPriceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(PredictPriceFormSchema),
     defaultValues: {
      productDescription: "",
      craftingTime: 0,
      materialCost: 0,
      skillLevel: "Intermediate",
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: FormValues) {
    if (!imagePreview) {
      toast({ title: "No Image", description: "Please upload a photo of your product.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setPrediction(null);

    try {
      const result = await predictPrice({
        ...values,
        productImageUri: imagePreview,
      });
      setPrediction(result);
    } catch (error) {
      console.error("Price prediction error:", error);
      toast({
        title: "Error Predicting Price",
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
            <CardTitle className="font-headline flex items-center gap-2"><Wand2 className="w-6 h-6 text-primary"/> AI Price Predictor</CardTitle>
            <CardDescription>
              Get a fair price suggestion for your craft based on AI analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormItem>
                <FormLabel>Product Photo</FormLabel>
                <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg bg-muted">
                {imagePreview ? (
                    <div className="relative">
                        <Image src={imagePreview} alt="Preview" width={150} height={150} className="object-cover rounded-md max-h-36 w-auto"/>
                        <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-auto px-2 py-1 text-xs" onClick={() => setImagePreview(null)}>Remove</Button>
                    </div>
                ) : (
                        <label htmlFor="price-predictor-file" className="cursor-pointer flex flex-col items-center justify-center">
                            <Upload className="w-8 h-8 text-muted-foreground"/>
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 4MB)</p>
                            <Input id="price-predictor-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                )}
                </div> 
            </FormItem>
            <FormField
              control={form.control}
              name="productDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Hand-embroidered cushion cover, 16x16 inches, cotton fabric, with floral motifs." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid sm:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="materialCost"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Material Cost (₹)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 400" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="craftingTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Crafting Time (hrs)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g., 6" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="skillLevel"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Skill Level</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select skill level" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                                <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {isLoading && (
                 <div className="space-y-4 pt-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            )}
            {!isLoading && !prediction && (
                <div className="text-center text-muted-foreground p-8 border rounded-lg mt-4 h-64 flex flex-col items-center justify-center">
                    <Calculator className="mx-auto h-16 w-16 mb-2 opacity-50" />
                    <p>Your price prediction will appear here.</p>
                </div>
            )}
            {prediction && (
                <div className="space-y-4 border rounded-lg p-4 mt-4">
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-primary"/> Suggested Price Range</h3>
                        <p className="text-3xl font-bold font-headline text-center py-2">
                           ₹{prediction.priceRange.min.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ₹{prediction.priceRange.max.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Price Breakdown</h3>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                            <li className="flex justify-between"><span>Material Cost:</span> <span>₹{prediction.breakdown.materialCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></li>
                            <li className="flex justify-between"><span>Labor Cost:</span> <span>₹{prediction.breakdown.laborCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></li>
                            <li className="flex justify-between"><span>Artistic Premium:</span> <span>₹{prediction.breakdown.artisticPremium.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Market Comparison</h3>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{prediction.marketComparison}</p>
                    </div>
                </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !imagePreview}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              Predict Price
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
