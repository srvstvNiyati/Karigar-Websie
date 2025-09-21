import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold font-headline text-center mb-8 flex items-center justify-center gap-2">About कारीगर</h1>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
                कारीगर is an AI-powered platform dedicated to empowering Indian traditional artists and craftsmen. Our mission is to bridge the gap between timeless heritage and modern technology, ensuring that these invaluable art forms not only survive but thrive in the digital age.
            </p>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h2 className="text-3xl font-bold font-headline mb-4">Our Story</h2>
                    <p className="text-muted-foreground mb-4">
                        The idea for कारीगर was born from a deep appreciation for India's rich cultural tapestry and a concern for the artisans who are the custodians of these traditions. We saw that many talented craftsmen struggled to reach a wider audience, get fair prices for their work, and adapt to the digital marketplace.
                    </p>
                    <p className="text-muted-foreground">
                        We decided to create a "कारीगर" - a companion - that would use the power of Artificial Intelligence to provide artisans with the tools, insights, and support they need to succeed. From generating stunning product images to suggesting sales strategies, कारीगर is designed to be a trusted partner in every artisan's journey.
                    </p>
                </div>
                <div className="relative h-80 rounded-lg overflow-hidden">
                    <Image
                        src="https://picsum.photos/seed/about-story/800/600"
                        alt="Artisans working together"
                        fill
                        className="object-cover"
                        data-ai-hint="artisans community"
                    />
                </div>
            </div>

            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold font-headline mb-8">What We Offer</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI-Powered Tools</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">From image and video generation to price prediction and sales strategy, our tools help you create, market, and sell your craft effectively.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Community & Connection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Connect with a network of fellow artisans, share your work, and find opportunities for collaboration and growth.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Cultural Preservation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Our authenticity badge helps verify the cultural roots of your designs, preserving heritage and adding value to your work.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="bg-muted p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold font-headline mb-4">Join Our Movement</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Whether you are an artisan looking to grow your business, a lover of traditional crafts, or someone who believes in the power of technology to make a positive impact, we invite you to join the कारीगर community.
                </p>
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold">Get Started</button>
            </div>
        </div>
    );
}
