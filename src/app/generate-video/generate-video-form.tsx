
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateShortVideoForSocialMedia } from "@/ai/flows/generate-short-videos-for-social-media";
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
import { useToast } from "@/hooks/use-toast";
import { Rocket, Loader2, Wand2, Video, Film, Upload, Camera, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  prompt: z.string().min(10, "Please provide a detailed prompt (at least 10 characters)."),
  photo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateVideoForm() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
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
        setPhotoPreview(reader.result as string);
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
        setPhotoPreview(dataUrl);
      }
      setIsCameraOpen(false);
    }
  };


  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setVideoUrl(null);

    try {
      const result = await generateShortVideoForSocialMedia({
        prompt: values.prompt,
        photoDataUri: photoPreview ?? undefined
      });
      
      if (result.videoDataUri) {
        setVideoUrl(result.videoDataUri);
      } else {
        throw new Error("Video generation failed to return a URL.");
      }
    } catch (error) {
      console.error("Video generation error:", error);
      toast({
        title: "Error Generating Video",
        description: "Something went wrong. This is an experimental feature and may fail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-primary" />
                  Describe Your Video
                </CardTitle>
                <CardDescription>
                  Provide a prompt and an optional photo to generate a short video.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A cinematic shot of a potter's hands shaping clay on a wheel, with soft morning light."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Photo (Optional)</FormLabel>
                      <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg bg-muted">
                          {photoPreview ? (
                              <div className="relative">
                                  <Image src={photoPreview} alt="Preview" width={200} height={200} className="object-cover rounded-md max-h-48 w-auto"/>
                                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setPhotoPreview(null)}>Remove</Button>
                              </div>
                          ) : (
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <p className="mb-4 text-sm text-muted-foreground">Upload a photo or use your camera</p>
                                  <div className="flex gap-4">
                                          <Button asChild variant="outline">
                                          <label htmlFor="video-gen-file" className="cursor-pointer">
                                              <Upload className="mr-2"/> Upload File
                                              <Input id="video-gen-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                          </label>
                                          </Button>
                                          <Button type="button" variant="outline" onClick={() => setIsCameraOpen(true)}>
                                              <Camera className="mr-2"/> Use Camera
                                          </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-4">PNG, JPG, or WEBP (MAX. 4MB)</p>
                              </div>
                          )}
                        </div>
                      <FormDescription>
                        Upload a photo to influence the video's style and content.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Rocket className="mr-2 h-4 w-4" />
                  )}
                  Generate Video
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Generated Video</CardTitle>
            <CardDescription>
              Your AI-generated video will appear here. Generation may take up to a minute.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="aspect-video w-full max-w-md rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {isLoading && (
                <div className="text-center text-muted-foreground p-4">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4">Generating video... this can take a moment.</p>
                </div>
              )}
              {!isLoading && videoUrl && (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              {!isLoading && !videoUrl && (
                <div className="text-center text-muted-foreground p-4">
                  <Film className="mx-auto h-16 w-16 mb-2 opacity-50" />
                  <p>Your video is just a click away.</p>
                </div>
              )}
            </div>
          </CardContent>
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
