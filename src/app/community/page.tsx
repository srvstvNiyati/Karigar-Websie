
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, Send, Share2, Search, Filter, Briefcase, MapPin, Package, Users, Star, PlusCircle, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const artisans = [
  {
    name: "Ravi Kumar",
    craft: "Wood Carving",
    location: "Kerala",
    image: PlaceHolderImages.find(p => p.id === 'artisan2'),
    specialty: "Teak Wood Sculptures",
    bio: "Traditional wood carving artist specializing in temple art and furniture.",
    rating: 4.9,
    reviews: 234,
    online: true,
  },
  {
    name: "Meera Devi",
    craft: "Pottery",
    location: "Gujarat",
    image: PlaceHolderImages.find(p => p.id === 'artisan1'),
    specialty: "Blue Pottery",
    bio: "Blue pottery expert carrying forward the Jaipur tradition.",
    rating: 4.8,
    reviews: 189,
    online: false,
  },
  {
    name: "Arjun Singh",
    craft: "Metalwork",
    location: "Rajasthan",
    image: PlaceHolderImages.find(p => p.id === 'artisan4'),
    specialty: "Brass Artifacts",
    bio: "Brass and copper artisan creating traditional utensils and decor.",
    rating: 4.9,
    reviews: 156,
    online: true,
  },
   {
    name: "Ananya Reddy",
    craft: "Textile Weaving",
    location: "Hyderabad, Telangana",
    image: PlaceHolderImages.find(p => p.id === 'artisan3'),
    specialty: "Ikat Sarees",
    bio: "Weaving threads of tradition into contemporary fabrics. Each piece is a poem.",
    rating: 4.9,
    reviews: 312,
    online: true,
  },
];

const nearbyArtisans = [
    {
      name: "Lakshmi Crafts",
      craft: "Embroidery",
      distance: "2.3 km",
      rating: 4.7,
      image: PlaceHolderImages.find(p => p.id === 'artisan5'),
    },
    {
      name: "Ganesh Pottery",
      craft: "Pottery",
      distance: "4.1 km",
      rating: 4.9,
      image: PlaceHolderImages.find(p => p.id === 'artisan1'),
    },
    {
      name: "Rajesh Metalworks",
      craft: "Brass Work",
      distance: "5.8 km",
      rating: 4.8,
      image: PlaceHolderImages.find(p => p.id === 'artisan4'),
    },
]

const collabPosts = [
    { id: 1, author: "Priya Sharma", title: "Seeking a metalworker for a mixed-media sculpture project.", replies: 5, time: "2h ago"},
    { id: 2, author: "Vikram Singh", title: "Looking for textile artists to collaborate on a new line of home decor.", replies: 12, time: "1d ago"},
    { id: 3, author: "Kabir Khan", title: "Bulk leather purchase - anyone in Maharashtra want to join?", replies: 8, time: "3d ago"},
]

const resources = [
    { id: 1, name: "Jaipur Color Company", category: "Raw Materials", addedBy: "Meera Devi", rating: 4.8, reviews: 45, description: "High-quality natural dyes for textiles and pottery." },
    { id: 2, name: "CraftsIndia Logistics", category: "Logistics", addedBy: "Ravi Kumar", rating: 4.5, reviews: 32, description: "Reliable shipping for fragile items, pan-India." },
    { id: 3, name: "The Woodworkers' Hub", category: "Tools & Equipment", addedBy: "Arjun Singh", rating: 4.9, reviews: 67, description: "Excellent source for specialized carving tools." },
]

export default function CommunityPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-headline">कारीगर AI Community</h1>
          <p className="text-muted-foreground mt-1">Connect, collaborate, and grow together with fellow artisans.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2" />
            Join Community
        </Button>
      </header>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search artisans by craft, location, or name..." className="pl-10" />
        </div>
        <Button variant="outline">
            <Filter className="mr-2"/>
            Filter
        </Button>
      </div>

      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl">
          <TabsTrigger value="discover"><Users className="mr-2"/>Discover Artisans</TabsTrigger>
          <TabsTrigger value="collab"><Briefcase className="mr-2"/>Collaboration Board</TabsTrigger>
          <TabsTrigger value="nearby"><MapPin className="mr-2"/>Nearby Artisans</TabsTrigger>
          <TabsTrigger value="resources"><Package className="mr-2"/>Resource Hub</TabsTrigger>
        </TabsList>
        <TabsContent value="discover" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artisans.map((artisan) => (
                    <Card key={artisan.name} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-4 pb-4">
                             <Avatar className="w-12 h-12 relative">
                                <AvatarImage src={artisan.image?.imageUrl} data-ai-hint={artisan.image?.imageHint} />
                                <AvatarFallback>{artisan.name.slice(0, 2)}</AvatarFallback>
                                <div className={ `absolute right-0 bottom-0 w-3 h-3 rounded-full border-2 border-card ${artisan.online ? 'bg-green-500' : 'bg-gray-400'}`}/>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-bold font-headline flex items-center gap-2">{artisan.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{artisan.location}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                            <div>
                                <Badge>{artisan.craft}</Badge>
                                <p className="font-semibold mt-1">{artisan.specialty}</p>
                            </div>
                            <p className="text-sm text-muted-foreground h-10">{artisan.bio}</p>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                                    <span className="font-bold">{artisan.rating}</span>
                                    <span className="text-muted-foreground">({artisan.reviews})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Button variant="outline" size="sm">Chat</Button>
                                     <Button variant="ghost" size="icon" className="w-8 h-8">
                                         <Heart className="w-4 h-4"/>
                                     </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="collab" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Collaboration Board</CardTitle>
                    <CardDescription>Post opportunities and find partners for your next project.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="mb-4">Post a Collaboration</Button>
                    <div className="space-y-4">
                        {collabPosts.map(post => (
                            <div key={post.id} className="border p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">{post.title}</h4>
                                    <p className="text-sm text-muted-foreground">Posted by {post.author} &middot; {post.time}</p>
                                </div>
                                <Button variant="outline">View ({post.replies})</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="nearby" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                                <MapPin/>Artisans Near You
                            </CardTitle>
                            <CardDescription>Discover local artisans for collaboration and bulk-buy opportunities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           {nearbyArtisans.map((artisan) => (
                               <div key={artisan.name} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                   <Avatar className="w-12 h-12">
                                       <AvatarImage src={artisan.image?.imageUrl} data-ai-hint={artisan.image?.imageHint}/>
                                       <AvatarFallback>{artisan.name.slice(0, 2)}</AvatarFallback>
                                   </Avatar>
                                   <div className="flex-1">
                                       <h3 className="font-semibold">{artisan.name}</h3>
                                       <p className="text-sm text-muted-foreground">{artisan.craft}</p>
                                   </div>
                                   <div className="text-right">
                                       <p className="font-semibold">{artisan.distance}</p>
                                       <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                                            <span>{artisan.rating}</span>
                                       </div>
                                   </div>
                                   <Button variant="outline" size="icon">
                                       <MessageSquare className="w-5 h-5"/>
                                   </Button>
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Package/>Group Shipping Opportunity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Join with 3 nearby artisans for bulk shipping to Mumbai - save 40% on logistics costs.</p>
                            <Button className="w-full">Learn More</Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Local Supplier</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src="https://picsum.photos/seed/supplier1/40/40" />
                                    <AvatarFallback>JC</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold">Jaipur Color Company</h4>
                                     <div className="flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                                        <span className="font-bold">4.8</span>
                                        <span className="text-muted-foreground">(45 reviews)</span>
                                    </div>
                                </div>
                             </div>
                             <p className="text-sm text-muted-foreground my-3">High-quality natural dyes for textiles and pottery.</p>
                             <Button variant="outline" className="w-full">View Details</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TabsContent>
         <TabsContent value="resources" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Supplier & Logistics Hub</CardTitle>
                    <CardDescription>A community-verified directory of resources.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button className="mb-4">Add a Resource</Button>
                     <div className="space-y-4">
                        {resources.map(res => (
                             <div key={res.id} className="border p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{res.name}</h4>
                                        <Badge variant="secondary">{res.category}</Badge>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                                            <span className="font-bold">{res.rating}</span>
                                            <span className="text-muted-foreground">({res.reviews} reviews)</span>
                                        </div>
                                         <p className="text-xs text-muted-foreground mt-1">Added by {res.addedBy}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{res.description}</p>
                                <div className="mt-3 flex gap-2">
                                    <Button variant="outline" size="sm">View Details</Button>
                                    <Button variant="ghost" size="sm">Leave a Review</Button>
                                </div>
                             </div>
                        ))}
                     </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
