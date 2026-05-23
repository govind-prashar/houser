import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-muted text-foreground pt-20 pb-8">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-block group">
                            <span className="text-2xl font-bold text-foreground group-hover:text-primary transition">Canderra</span>
                        </Link>
                        <p className="text-muted-foreground mt-4 text-sm">Curated luxury residences worldwide.</p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            <Link href="/" className="text-muted-foreground hover:text-foreground transition text-sm">
                                Home
                            </Link>
                            <Link href="/properties" className="text-muted-foreground hover:text-foreground transition text-sm">
                                Properties
                            </Link>
                            <Link href="/about" className="text-muted-foreground hover:text-foreground transition text-sm">
                                About
                            </Link>
                            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition text-sm">
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Get in Touch</h4>
                        <a
                            href="mailto:support@canderra.us"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition text-sm"
                        >
                            <Mail size={16} />
                            support@canderra.us
                        </a>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">About</h4>
                        <p className="text-muted-foreground text-sm">
                            Discover curated luxury stays and private residences worldwide.
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} Canderra Ltd. All rights reserved.</p>
                    <p>The art of hospitality.</p>
                </div>
            </div>
        </footer>
    );
}
