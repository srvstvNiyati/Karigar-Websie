
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { generateProductImages } from "@/ai/flows/generate-product-images";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Loader2, Wand2, GalleryVertical, Download, Upload, Camera, Video, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  productDescription: z.string().min(10, "Please provide a detailed description (at least 10 characters)."),
  stylePreference: z.string().min(1, "Please select a style."),
  viewPreference: z.string().min(1, "Please select a view."),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateImageForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
      stylePreference: "modern",
      viewPreference: "front",
    },
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      if (isCameraOpen) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      }
    }
    setupCamera();

    return () => {
      // Cleanup: stop video stream when component unmounts or camera is closed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [isCameraOpen, toast]);

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

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/webp');
        setImagePreview(dataUrl);
      }
      setIsCameraOpen(false);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setImageUrl(null);

    try {
      const result = await generateProductImages({
        ...values,
        productImageUri: imagePreview ?? undefined,
      });
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      } else {
        throw new Error("Image generation failed to return a URL.");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Error Generating Image",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-product-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Wand2 className="w-6 h-6 text-primary"/> Describe Your Product</CardTitle>
                <CardDescription>
                  Provide details about your product and let our AI create a
                  stunning image for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A handcrafted ceramic mug, glazed in a deep ocean blue with a sturdy, comfortable handle."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Reference Image (Optional)</FormLabel>
                  <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg bg-muted">
                    {imagePreview ? (
                        <div className="relative">
                            <Image src={imagePreview} alt="Preview" width={200} height={200} className="object-cover rounded-md max-h-48 w-auto"/>
                            <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setImagePreview(null)}>Remove</Button>
                        </div>
                    ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p className="mb-4 text-sm text-muted-foreground">Upload an image or use your camera</p>
                            <div className="flex gap-4">
                                  <Button asChild variant="outline">
                                    <label htmlFor="image-gen-file" className="cursor-pointer">
                                        <Upload className="mr-2"/> Upload File
                                        <Input id="image-gen-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                  </Button>
                                  <p className="text-muted-foreground flex items-center">OR</p>
                                  <Button type="button" variant="outline" onClick={() => setIsCameraOpen(true)}>
                                      <Camera className="mr-2"/> Use Camera
                                  </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">PNG, JPG, or WEBP (MAX. 4MB)</p>
                        </div>
                    )}
                  </div>
                </FormItem>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stylePreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style Preference</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="minimalist">Minimalist</SelectItem>
                            <SelectItem value="rustic">Rustic</SelectItem>
                            <SelectItem value="modern">Modern</SelectItem>
                            <SelectItem value="vintage">Vintage</SelectItem>
                            <SelectItem value="bohemian">Bohemian</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="viewPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>View Preference</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a view" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="front">Front View</SelectItem>
                            <SelectItem value="side">Side View</SelectItem>
                            <SelectItem value="top">Top View</SelectItem>
                            <SelectItem value="3D">3D Perspective</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Rocket className="mr-2 h-4 w-4" />
                  )}
                  Generate Image
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Generated Image</CardTitle>
            <CardDescription>
              Your AI-generated product image will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="aspect-square w-full max-w-md rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {isLoading && <Skeleton className="w-full h-full" />}
              {!isLoading && imageUrl && (
                <Image
                  src={imageUrl}
                  alt="AI generated product"
                  width={512}
                  height={512}
                  className="object-cover w-full h-full"
                />
              )}
              {!isLoading && !imageUrl && (
                <div className="text-center text-muted-foreground p-4">
                  <GalleryVertical className="mx-auto h-16 w-16 mb-2 opacity-50" />
                  <p>Your image is just a click away.</p>
                </div>
              )}
            </div>
          </CardContent>
           {imageUrl && !isLoading && (
            <CardFooter>
              <Button onClick={handleDownload} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Video/> Camera Capture</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
            {hasCameraPermission === null && <Loader2 className="w-8 h-8 animate-spin" />}
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser settings to use this feature.
                    </AlertDescription>
                </Alert>
            )}
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleTakePhoto} disabled={!hasCameraPermission}>
              <Camera className="mr-2"/> Take Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </>
  );
}
