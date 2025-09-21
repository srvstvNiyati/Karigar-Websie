
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Heart, Edit, Share2, Mail, Phone, MapPin, BadgeCheck, Camera, Sparkles, QrCode, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
  fullName: string;
  phoneNumber: string;
  location: string;
  craft: string;
  experience: number;
  businessScale: string;
  story: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [story, setStory] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setStory(parsedProfile.story || `My family has been creating beautiful ${parsedProfile.craft.toLowerCase()} for generations. I learned this sacred art from my family, who taught me that every piece holds the potential for beauty. Today, I blend traditional techniques with contemporary designs, creating pieces that tell stories of our rich heritage.`);
      }
    }
  }, []);

  const handleSaveStory = () => {
    if (profile) {
        const updatedProfile = { ...profile, story };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        setProfile(updatedProfile);
        setIsEditingStory(false);
    }
  };

  const avatarFallback = profile?.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(story)}`;

  if (!isClient) {
      return (
        <div className="flex flex-col gap-8">
            <Card className="max-w-4xl mx-auto w-full animate-pulse">
                <CardContent className="p-6">
                     <div className="grid md:grid-cols-3 gap-6 items-center">
                        <div className="flex flex-col items-center justify-center relative">
                            <div className="w-32 h-32 rounded-full bg-muted"></div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <div className="h-8 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      );
  }

  if (!profile) {
    return (
        <div className="text-center p-10 flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
            <UserPlus className="w-16 h-16 text-muted-foreground mb-4"/>
            <h2 className="text-2xl font-bold font-headline mb-2">Create Your Profile</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                You don't have a profile yet. Sign up to showcase your craft, tell your story, and connect with a community of artisans.
            </p>
            <Button asChild>
                <Link href="/signup">Sign Up to Create Profile</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        
        <div className="text-center w-full">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
            Your Craft Identity
          </h1>
          <p className="text-muted-foreground">
            Showcase your artisan journey and connect with your audience.
          </p>
        </div>
      </header>

      <Card className="max-w-4xl mx-auto w-full">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center relative">
              <Avatar className="w-32 h-32 border-4 border-primary">
                <AvatarFallback className="text-4xl">{avatarFallback}</AvatarFallback>
              </Avatar>
               <Badge className="absolute top-0 left-1/2 -translate-x-1/4 -translate-y-1/2 bg-orange-400 text-white">
                  <Sparkles className="w-3 h-3 mr-1"/> AI Avatar
               </Badge>
               <Button size="icon" className="absolute bottom-0 right-1/2 translate-x-3/4 translate-y-1/4 rounded-full border-2 border-background">
                   <Camera className="w-5 h-5"/>
               </Button>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold font-headline">{profile.fullName}</h2>
              <p className="text-primary font-medium capitalize">{profile.craft}</p>
              <div className="flex flex-wrap gap-2 my-3">
                <Badge variant="secondary">{profile.experience} years</Badge>
                <Badge variant="secondary" className="capitalize">{profile.businessScale}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.fullName.toLowerCase().replace(/\s+/g, '.')}@email.com</span>
                </div>
                 <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Verified Artisan</span>
                </div>
              </div>
               <Button variant="outline" className="mt-4">
                  <Share2 className="mr-2" /> Share Profile
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-4xl mx-auto w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline flex items-center gap-2 text-2xl">
              <Heart className="text-primary"/> My Craft Story
            </CardTitle>
            {isEditingStory ? (
                 <Button onClick={handleSaveStory}>Save Story</Button>
            ) : (
                <Button variant="outline" onClick={() => setIsEditingStory(true)}>
                  <Edit className="mr-2"/> Edit Story
                </Button>
            )}
          </div>
          <CardDescription>
            Share the journey behind your art and connect with your audience
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                {isEditingStory ? (
                    <Textarea 
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        rows={6}
                        className="text-muted-foreground"
                    />
                ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">{story}</p>
                )}
            </div>
          <div className="flex flex-col items-center gap-2">
             <Image 
                src={qrCodeUrl}
                alt="QR code for craft story"
                width={150}
                height={150}
                className="rounded-lg border p-1"
             />
             <p className="text-xs text-muted-foreground">Scan for the full story</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
