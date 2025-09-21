

import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Goal, Wand2, TrendingUp, BookText, Award, Users, HeartHandshake, Video, IndianRupee, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeroBackground } from "@/components/hero-background";

const features = [
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "AI Sales Strategist",
    description: "Get tailored sales strategies based on your business data to boost performance.",
    href: "/sales-strategy",
  },
  {
    icon: <IndianRupee className="w-8 h-8 text-primary" />,
    title: "AI Price Predictor",
    description: "Get a fair price suggestion for your craft based on AI analysis.",
    href: "/sales-strategy?tab=predictor",
  },
  {
    icon: <Wand2 className="w-8 h-8 text-primary" />,
    title: "AI Image Generation",
    description: "Create stunning, photorealistic 3D product visuals from a simple text description.",
    href: "/generate-image",
  },
  {
    icon: <Video className="w-8 h-8 text-primary" />,
    title: "AI Video Generation",
    description: "Turn your ideas into short, engaging videos for social media.",
    href: "/generate-video",
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-primary" />,
    title: "Resources",
    description: "Discover NGOs and government schemes that can help you and your craft thrive.",
    href: "/resources",
  },
  {
    icon: <BookText className="w-8 h-8 text-primary" />,
    title: "AI Storyteller",
    description: "Record your product's story and get it transcribed and translated instantly.",
    href: "/generate-story",
  },
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "AI Authenticity Badge",
    description: "Verify the cultural authenticity of your designs and earn a digital heritage certificate.",
    href: "/authenticity-badge",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "AI Community",
    description: "Connect with fellow artisans, find collaborators, and grow together.",
    href: "/community",
  },
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative flex items-center justify-center text-center bg-background/70 fade-in py-20 md:py-28">
        <HeroBackground />
        <div className="relative z-10 container px-4 mx-auto slide-in-up">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4">
            <span className="font-hindi bg-gradient-to-r from-orange-400 via-yellow-500 to-teal-400 text-transparent bg-clip-text">
              कारीगर
            </span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold font-headline mb-6">
            Your AI Craft Companion
          </h2>
          <p className="font-kalam font-bold text-3xl md:text-4xl text-foreground/80 mb-6">
            हर कला का घर, यही है कारीगर
          </p>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Empowering Indian traditional artists and craftsmen with AI-driven
            guidance, market insights, and personalized assistance to preserve and
            promote our rich cultural heritage.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-orange-400 to-yellow-500 text-primary-foreground hover:from-orange-500 hover:to-yellow-600 transition-transform duration-300 hover:scale-105">
              <Link href="/signup">
                Start your journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 transition-transform duration-300 hover:scale-105 hover:bg-accent/50">
              <Link href="#">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24 slide-in-up relative">
        <div className="absolute inset-0 w-full h-full">
            <Image 
                src="https://media.craftmaestros.com/media/magefan_blog/The_culture_of_Indian_craft.png"
                alt="Traditional Indian art pattern"
                fill
                className="object-cover opacity-20 blur-md"
                data-ai-hint="traditional art pattern"
            />
            <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-center p-8 rounded-lg bg-background/50 text-white">
              <h3 className="text-3xl font-bold font-headline flex items-center justify-center gap-2"><Goal className="w-8 h-8 text-primary"/> Our Mission</h3>
              <p className="text-lg text-gray-200">
                To empower traditional Indian artisans by providing them with cutting-edge AI tools and a global platform, ensuring their timeless crafts thrive in the modern world. We aim to bridge the gap between heritage and technology, fostering economic independence and cultural preservation.
              </p>
            </div>
            <div className="space-y-4 text-center p-8 rounded-lg bg-background/50 text-white">
              <h3 className="text-3xl font-bold font-headline flex items-center justify-center gap-2"><Eye className="w-8 h-8 text-primary"/> Our Vision</h3>
              <p className="text-lg text-gray-200">
                A future where every Indian artisan is digitally enabled, their craft is globally recognized, and the rich tapestry of Indian heritage is celebrated and sustained for generations to come. We envision a vibrant ecosystem of creators, buyers, and storytellers united by technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24 slide-in-up">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold font-headline mb-4">
                <span className="bg-gradient-to-r from-[hsl(22_85%_45%)] via-[hsl(22_90%_35%)] to-[hsl(22_95%_25%)] text-transparent bg-clip-text">
                    Features to Empower Your Craft
                </span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12">
                Explore a suite of AI-powered tools designed to help you create, market, and sell your art more effectively.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <Link href={feature.href} key={feature.title}>
                        <Card className="h-full text-left transform transition-all duration-300 hover:scale-105 hover:shadow-xl slide-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                            <CardHeader className="flex flex-row items-start gap-4">
                                {feature.icon}
                                <div className="space-y-1">
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
      </section>
      
      <section className="bg-background py-12 slide-in-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
              <p className="text-muted-foreground">Traditional Crafts</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-primary mb-2">1000+</h3>
              <p className="text-muted-foreground">Active Artisans</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-primary mb-2">24/7</h3>
              <p className="text-muted-foreground">AI Assistance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
