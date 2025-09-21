
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Building, Filter, Search, Bookmark, Lightbulb, TrendingUp, Users, CheckCircle, Clock, Calendar, ExternalLink, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const allSchemes = [
  {
    name: "PM Vishwakarma Scheme",
    organization: "Ministry of MSME",
    description: "Financial support and skill development for traditional artisans and craftspeople.",
    benefits: ["₹1-3 lakh credit", "Skill training", "Digital marketing support"],
    status: "Active",
    type: "Government",
    eligibility: "Traditional artisans engaged in handicrafts",
    deadline: "31 March 2024",
    applied: "2.5M+",
    successRate: "78%",
  },
  {
    name: "Crafts Council of India Grant",
    organization: "Crafts Council of India",
    description: "Grants for artisans to participate in international exhibitions and workshops.",
    benefits: ["Exhibition funding", "Travel stipend"],
    status: "Active",
    type: "NGO",
    eligibility: "Artisans with 5+ years of experience",
    deadline: "15 April 2024",
    applied: "1.2M+",
    successRate: "65%",
  },
  {
    name: "Stand-Up India Scheme",
    organization: "Ministry of Finance",
    description: "Facilitates bank loans for enterprises led by SC/ST or women entrepreneurs.",
    benefits: ["₹10 lakh - 1 Cr loan", "Women & SC/ST Focus"],
    status: "Active",
    type: "Government",
    eligibility: "SC/ST or Women Entrepreneurs",
    deadline: "Ongoing",
    applied: "800K+",
    successRate: "72%",
  },
  {
      name: "Handicrafts Development Programme",
      organization: "Office of Development Commissioner (Handicrafts)",
      description: "Comprehensive scheme for development of handicrafts sector.",
      benefits: ["Market linkage", "Design development", "Export promotion"],
      status: "Active",
      type: "Government",
      eligibility: "All registered handicraft artisans",
      deadline: "30 June 2024",
      applied: "3.1M+",
      successRate: "85%",
  }
];

const comingSoon = [
    {
        name: "Craft Heritage Preservation Grant",
        organization: "Ministry of Culture",
        date: "February 2024",
        benefit: "₹5 lakh grants"
    },
    {
        name: "Women Artisan Entrepreneur Program",
        organization: "National Skill Development Corporation",
        date: "March 2024",
        benefit: "Business incubation support"
    }
];

const filters = ["All Schemes", "Government", "NGO Programs", "Training", "Financial Aid"];

export default function ResourcesPage() {
  const [schemes, setSchemes] = useState(allSchemes);
  const [activeFilter, setActiveFilter] = useState("All Schemes");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filteredSchemes = allSchemes;

    if (activeFilter !== "All Schemes") {
        if (activeFilter === "Government") {
            filteredSchemes = filteredSchemes.filter(s => s.type === "Government");
        } else if (activeFilter === "NGO Programs") {
            filteredSchemes = filteredSchemes.filter(s => s.type === "NGO");
        } else if (activeFilter === "Training") {
            filteredSchemes = filteredSchemes.filter(s => s.benefits.some(b => b.toLowerCase().includes("training")));
        } else if (activeFilter === "Financial Aid") {
             filteredSchemes = filteredSchemes.filter(s => s.benefits.some(b => b.toLowerCase().includes("loan") || b.toLowerCase().includes("credit") || b.toLowerCase().includes("funding")));
        }
    }
    
    if (searchTerm) {
        filteredSchemes = filteredSchemes.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    setSchemes(filteredSchemes);
  }, [activeFilter, searchTerm]);

  return (
    <div className="flex flex-col gap-8">
      <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline">
              NGOs and <span className="text-primary">Schemes</span>
          </h1>
          <p className="text-muted-foreground mt-1">
              Discover funding opportunities, training programs, and support initiatives for artisans
          </p>
      </header>

      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                    <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">AI-Powered Scheme Recommendations</h3>
                    <p className="text-sm text-muted-foreground">Get personalized scheme suggestions based on your profile and craft</p>
                </div>
            </div>
            <Button>Get Recommendations</Button>
        </CardContent>
      </Card>

      <div>
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    placeholder="Search schemes by name, organization, or benefit..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {filters.map(filter => (
                    <Button 
                        key={filter}
                        variant={activeFilter === filter ? "default" : "outline"} 
                        className="shrink-0"
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </Button>
                ))}
            </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-headline">Available Schemes ({schemes.length})</h2>
                <Button variant="outline"><Filter className="mr-2"/> More Filters</Button>
            </div>
            {schemes.length > 0 ? schemes.map((scheme) => (
              <Card key={scheme.name}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-xl font-bold font-headline">{scheme.name}</h3>
                          <Badge variant={scheme.status === 'Active' ? 'default' : 'secondary'} className="bg-orange-500 hover:bg-orange-600">{scheme.status}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                            <Bookmark className="w-5 h-5"/>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2"><Building className="w-4 h-4"/> {scheme.organization}</p>
                    <p className="text-muted-foreground my-4">{scheme.description}</p>
                    
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Key Benefits</h4>
                        <div className="flex flex-wrap gap-2">
                            {scheme.benefits.map(benefit => (
                                <Badge key={benefit} variant="destructive" className="bg-red-700/80 text-white">{benefit}</Badge>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-4"/>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold mb-1">Eligibility</h4>
                            <p className="text-muted-foreground">{scheme.eligibility}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-1">Deadline</h4>
                            <p className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/>{scheme.deadline}</p>
                        </div>
                    </div>
                </CardContent>
                <div className="flex items-center justify-between p-6 pt-0">
                     <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary"/>
                            <span>{scheme.applied} applied</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500"/>
                            <span>{scheme.successRate} success rate</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline">Learn More</Button>
                      <Button className="bg-orange-500 hover:bg-orange-600"><ExternalLink className="mr-2"/>Apply Now</Button>
                    </div>
                </div>
              </Card>
            )) : (
                 <Card>
                    <CardContent className="p-10 text-center text-muted-foreground">
                        <p>No schemes found matching your criteria.</p>
                    </CardContent>
                </Card>
            )}
        </div>

        <div className="space-y-6 sticky top-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-orange-500 text-white p-4 rounded-lg text-center">
                        <p className="text-4xl font-bold">156</p>
                        <p>Active Schemes</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-muted p-3 rounded-lg">
                            <p className="text-2xl font-bold">₹2.5L Cr</p>
                            <p className="text-sm text-muted-foreground">Total Funding</p>
                        </div>
                         <div className="bg-muted p-3 rounded-lg">
                            <p className="text-2xl font-bold">4.8M+</p>
                            <p className="text-sm text-muted-foreground">Beneficiaries</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Clock/> Coming Soon</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {comingSoon.map(item => (
                       <div key={item.name} className="p-3 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.organization}</p>
                            <div className="flex justify-between items-center mt-2 text-xs">
                                <Badge variant="secondary" className="bg-red-100 text-red-800">{item.date}</Badge>
                                <Badge variant="outline">{item.benefit}</Badge>
                            </div>
                       </div>
                   ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Heart className="text-primary"/> Success Story</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src="https://picsum.photos/seed/meera-kumari/100/100" data-ai-hint="artisan portrait woman" />
                        <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                    <h4 className="font-bold">Meera Kumari</h4>
                    <p className="text-sm text-muted-foreground">Pottery Artisan, Bihar</p>
                    <blockquote className="mt-4 text-sm text-muted-foreground italic border-l-4 pl-4 text-left">
                        "Through PM Vishwakarma scheme, I got ₹2 lakh loan and digital training. My pottery sales increased from ₹5,000 to ₹25,000 per month!"
                    </blockquote>
                </CardContent>
            </Card>
        </div>

      </div>

    </div>
  );
}
