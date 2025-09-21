import { Logo } from "./logo";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-background relative z-10">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-sm text-muted-foreground">
                            Empowering Indian traditional artists and craftsmen with AI-driven
                            guidance to preserve and promote our rich cultural heritage.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:col-span-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">Features</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/sales-strategy" className="hover:text-primary">AI Sales Strategist</Link></li>
                                <li><Link href="/generate-image" className="hover:text-primary">AI Image Generation</Link></li>
                                <li><Link href="/authenticity-badge" className="hover:text-primary">AI Authenticity Badge</Link></li>
                                <li><Link href="/community" className="hover:text-primary">AI Community</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} कारीगर. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
