
"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Send, User, Mic, Square, Upload, Camera, Loader2, Volume2, Bot, Video, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AiAssistantIcon } from "./ai-assistant-icon";
import { chat } from "@/ai/flows/chat";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/language-context";


interface MessageContent {
  text?: string;
  media?: {
    url: string;
    contentType?: string;
  };
}

interface Message {
  id: string;
  role: "user" | "model";
  content: MessageContent[];
}

// Speech recognition setup
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-message",
      content: [{ text: "Hello! 👋 I’m your AI Voice Assistant. You don’t need to type—just speak in the language you’re most comfortable with. I can understand and reply in Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Kannada, Malayalam, and more. Tap the mic 🎤 and let’s talk in your language." }],
      role: "model",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { language } = useLanguage();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();
  const reactId = useId();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
  }, [isCameraOpen]);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text: string, mediaUrl?: string, mediaType?: string) => {
    if (!text.trim() && !mediaUrl) return;

    const userMessage: Message = {
      id: `${reactId}-${messages.length}-user`,
      role: "user",
      content: mediaUrl ? [{text}, { media: { url: mediaUrl, contentType: mediaType } }] : [{ text }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content.map(c => ({
          text: c.text,
          media: c.media ? { url: c.media.url, contentType: c.media.contentType } : undefined
        }))
      }));

      const result = await chat({
        history,
        message: text,
      });
      
      const botResponse: Message = {
        id: `${reactId}-${messages.length + 1}-bot`,
        content: [{ text: result.message }],
        role: "model",
      };
      setMessages((prev) => [...prev, botResponse]);
      speak(result.message);
    } catch (error) {
      console.error("Chat error:", error);
      toast({ title: "Error", description: "Could not get a response from the AI.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };
  
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    
    if (!SpeechRecognition) {
      toast({ title: "Unsupported Browser", description: "Your browser does not support voice recognition.", variant: "destructive" });
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
        toast({ title: "Voice Error", description: `An error occurred: ${event.error}`, variant: "destructive" });
    }

    recognitionRef.current.start();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
            title: "File too large",
            description: "Please upload a file smaller than 4MB.",
            variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage("I've uploaded a file.", reader.result as string, file.type);
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
        handleSendMessage("I've taken a photo.", dataUrl, 'image/webp');
      }
      setIsCameraOpen(false);
    }
  };


  return (
    <>
      <div className="flex flex-col h-full bg-background">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "model" && (
                  <Avatar className="w-8 h-8 border-2 border-primary p-0.5 bg-background">
                    <AiAssistantIcon />
                  </Avatar>
                )}
                <div className="flex flex-col gap-1 items-end">
                  {message.content.map((content, index) => (
                    <div key={index}>
                      {content.text && (
                          <div
                          className={cn(
                            "max-w-xs md:max-w-md rounded-lg px-4 py-2",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <p className="text-sm">{content.text}</p>
                        </div>
                      )}
                      {content.media && (
                          <div className="mt-2 rounded-lg overflow-hidden max-w-xs">
                            {content.media.contentType?.startsWith('image/') ? (
                              <img src={content.media.url} alt="Uploaded content" className="max-w-full h-auto"/>
                            ) : (
                              <p className="text-xs text-muted-foreground p-2 bg-muted rounded-md">Uploaded file: {content.media.contentType}</p>
                            )}
                          </div>
                      )}
                    </div>
                  ))}
                </div>
                {message.role === "user" && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="w-8 h-8 border-2 border-primary p-0.5 bg-background">
                    <AiAssistantIcon />
                  </Avatar>
                <div className="max-w-xs md:max-w-md rounded-lg px-4 py-2 bg-muted text-muted-foreground flex items-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2"/>
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 bg-background/80 backdrop-blur-sm border-t">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="🎤 Speak in your language"
              className="flex-1"
              aria-label="Chat input"
              disabled={isLoading}
            />
            <TooltipProvider>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="outline" onClick={handleListen} disabled={isLoading}>
                          {isListening ? <Square className="w-4 h-4 text-red-500"/> : <Mic className="w-4 h-4" />}
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>{isListening ? 'Stop listening' : 'Use microphone'}</p>
                  </TooltipContent>
              </Tooltip>
              <Tooltip>
                  <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                          <Upload className="w-4 h-4" />
                      </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>Upload a file</p>
                  </TooltipContent>
              </Tooltip>
              <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="outline" onClick={() => setIsCameraOpen(true)} disabled={isLoading}>
                        <Camera className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>Use camera</p>
                  </TooltipContent>
              </Tooltip>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </TooltipProvider>

            <Button type="submit" size="icon" aria-label="Send message" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
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
                        Please allow camera access in your browser settings.
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

    

    
