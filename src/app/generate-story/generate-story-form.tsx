
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateProductStories } from "@/ai/flows/auto-generate-product-stories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, Rocket, Square, Languages, QrCode, Check, ChevronsUpDown, Upload, Camera, Video, AlertTriangle, Download } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const languages = [
    { name: 'Assamese', code: 'as' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Bodo', code: 'brx' },
    { name: 'Dogri', code: 'doi' },
    { name: 'English', code: 'en' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Kashmiri', code: 'ks' },
    { name: 'Konkani', code: 'gom' },
    { name: 'Maithili', code: 'mai' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Manipuri', code: 'mni' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Nepali', code: 'ne' },
    { name: 'Odia', code: 'or' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Sanskrit', code: 'sa' },
    { name: 'Santali', code: 'sat' },
    { name: 'Sindhi', code: 'sd' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Telugu', code: 'te' },
    { name: 'Urdu', code: 'ur' }
  ];

const formSchema = z.object({
  productDetails: z.string().min(5, "Please enter product details."),
  targetLanguages: z.array(z.string()).min(1, "Please select at least one language."),
});

type FormValues = z.infer<typeof formSchema>;
type StoryOutput = {
  originalTranscription: string;
  translatedStories: Record<string, string>;
  craftStory?: {
    craftDescription: string;
    makingTechniques: string;
    historyOfCraft: string;
    culturalReferences: string;
    aboutCraftsperson: string;
  };
  qrCodeUrl?: string;
};

export function GenerateStoryForm() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaDataUri, setMediaDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storyOutput, setStoryOutput] = useState<StoryOutput | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'audio' | 'video' | 'image' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDetails: "",
      targetLanguages: ["hi", "bn", "ta"],
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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [isCameraOpen, toast]);

  const generateQrCode = (lang: string, story: string) => {
    const newQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(story)}`;
    setQrCodes(prev => ({...prev, [lang]: newQrCodeUrl}));
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setMediaDataUri(reader.result as string);
          setMediaPreview(reader.result as string);
          setMediaType('audio');
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setMediaDataUri(null);
      setMediaPreview(null);
      setMediaType(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setMediaDataUri(dataUrl);
        setMediaPreview(dataUrl);

        if (file.type.startsWith('audio/')) {
            setMediaType('audio');
        } else if (file.type.startsWith('video/')) {
            setMediaType('video');
        } else if (file.type.startsWith('image/')) {
            setMediaType('image');
        } else {
            toast({ title: "Unsupported file type", description: "Please upload an audio, video or image file.", variant: "destructive" });
        }
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
        setMediaDataUri(dataUrl);
        setMediaPreview(dataUrl);
        setMediaType('image');
      }
      setIsCameraOpen(false);
    }
  };

  const handleDownloadQr = () => {
    if (!storyOutput?.qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = storyOutput.qrCodeUrl;
    link.download = 'craft-story-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  async function onSubmit(values: FormValues) {
    if (!mediaDataUri) {
        toast({ title: "No Media", description: "Please record or upload your story first.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setStoryOutput(null);
    setQrCodes({});

    try {
      const result = await generateProductStories({
        ...values,
        mediaDataUri: mediaDataUri,
      });
      setStoryOutput(result);
    } catch (error) {
      console.error("Story generation error:", error);
      toast({ title: "Error Generating Stories", description: "Something went wrong. Please try again.", variant: "destructive" });
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
              <CardTitle className="font-headline">Tell Your Story</CardTitle>
              <CardDescription>Record audio or upload a video of your product's story, select languages, and let AI do the rest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormItem>
                <FormLabel>1. Provide Your Story (Audio or Video)</FormLabel>
                <div className="p-4 bg-muted rounded-lg space-y-4">
                    <div className="flex items-center gap-4">
                        <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={isRecording ? handleStopRecording : handleStartRecording}>
                            {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </Button>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{isRecording ? "Recording..." : "Record Audio"}</p>
                            <p className="text-xs text-muted-foreground">{isRecording ? "Click to stop." : "Click microphone to start."}</p>
                        </div>
                    </div>
                    {mediaPreview && (
                        <div className="relative w-fit mx-auto">
                            {mediaType === 'audio' && <audio src={mediaPreview} controls className="h-10" />}
                            {mediaType === 'video' && <video src={mediaPreview} controls className="max-h-40 rounded-md" />}
                            {mediaType === 'image' && <Image src={mediaPreview} alt="Preview" width={150} height={150} className="object-cover rounded-md"/>}
                            <Button variant="destructive" size="sm" className="absolute top-1 right-1 h-auto py-1 px-2 text-xs" onClick={() => { setMediaPreview(null); setMediaDataUri(null); setMediaType(null); }}>Remove</Button>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <Button type="button" variant="outline" asChild>
                           <label htmlFor="story-file" className="cursor-pointer w-full">
                                <Upload className="mr-2"/> Upload File
                                <Input id="story-file" type="file" accept="audio/*,video/*,image/*" className="hidden" onChange={handleFileChange} />
                           </label>
                        </Button>
                        <p className="text-sm text-muted-foreground">OR</p>
                        <Button type="button" variant="outline" className="w-full" onClick={() => setIsCameraOpen(true)}>
                            <Camera className="mr-2"/> Use Camera
                        </Button>
                    </div>
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="productDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Product Details</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Hand-carved Wooden Elephant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetLanguages"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>3. Select Translation Languages</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value.length && "text-muted-foreground"
                            )}
                          >
                            {field.value.length > 0
                              ? `${field.value.length} language${field.value.length > 1 ? 's' : ''} selected`
                              : "Select languages"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search language..." />
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {languages.map((lang) => (
                              <CommandItem
                                value={lang.name}
                                key={lang.code}
                                onSelect={() => {
                                    const selected = field.value.includes(lang.code);
                                    if (selected) {
                                        field.onChange(field.value.filter((c) => c !== lang.code));
                                    } else {
                                        field.onChange([...field.value, lang.code]);
                                    }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.includes(lang.code) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {lang.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || !mediaDataUri}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                Generate Stories
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Generated Content</CardTitle>
          <CardDescription>Your original transcription, craft story, and translated stories will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading && <div className="space-y-4">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">AI is working its magic...</p>
            </div>}
          {storyOutput && (
            <>
             {storyOutput.qrCodeUrl && storyOutput.craftStory && (
                <div className="p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-2">Your Craft Story QR Code</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <Image
                            src={storyOutput.qrCodeUrl}
                            alt="QR code for craft story"
                            width={150}
                            height={150}
                            className="rounded-md border bg-white p-1"
                        />
                        <div className="flex-1 space-y-3">
                            <p className="text-sm text-muted-foreground">Scan this QR code to view and share the unique story of your craft, created from your video.</p>
                            <Button onClick={handleDownloadQr} size="sm">
                                <Download className="mr-2"/> Download QR Code
                            </Button>
                        </div>
                    </div>
                     <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Craft Story Details:</h4>
                        <p className="text-sm text-muted-foreground"><strong>Description:</strong> {storyOutput.craftStory.craftDescription}</p>
                        <p className="text-sm text-muted-foreground"><strong>Techniques:</strong> {storyOutput.craftStory.makingTechniques}</p>
                    </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Original Transcription</h3>
                <Textarea readOnly value={storyOutput.originalTranscription} className="bg-muted" rows={4}/>
              </div>
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Languages className="w-5 h-5"/> Translated Stories</h3>
                <div className="space-y-4">
                  {Object.entries(storyOutput.translatedStories).map(([lang, story]) => (
                    <div key={lang}>
                      <h4 className="font-medium text-sm capitalize">{languages.find(l=>l.code === lang)?.name || lang}</h4>
                      <div className="flex gap-4">
                        <Textarea readOnly value={story} className="flex-1" rows={4}/>
                        <div className="flex flex-col items-center gap-2 w-28">
                             {qrCodes[lang] ? (
                                <Image
                                    src={qrCodes[lang]}
                                    alt={`QR code for ${lang} story`}
                                    width={100}
                                    height={100}
                                    className="rounded-md"
                                />
                             ) : (
                                <div className="w-[100px] h-[100px] bg-muted rounded-md flex items-center justify-center">
                                    <QrCode className="w-8 h-8 text-muted-foreground"/>
                                </div>
                             )}
                            <Button variant="outline" size="sm" className="w-full" onClick={() => generateQrCode(lang, story)}>
                                <QrCode className="w-4 h-4 mr-2"/>
                                Generate QR
                            </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {!isLoading && !storyOutput && (
             <div className="text-center text-muted-foreground p-4 h-64 flex flex-col items-center justify-center">
                <Mic className="mx-auto h-16 w-16 mb-2 opacity-50" />
                <p>Record your story to get started.</p>
              </div>
          )}
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
