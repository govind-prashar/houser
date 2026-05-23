import { Mail } from "lucide-react";
import { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Contact Canderra for luxury stay inquiries, booking support, and partnership opportunities. Email support@canderra.us.",
    alternates: { canonical: "/contact" },
    openGraph: {
        title: "Contact Canderra",
        description: "Reach the Canderra team for reservations and guest support.",
        url: "/contact",
    },
};

export default function ContactPage() {
    return (
        <div className="w-full bg-background font-sans text-foreground min-h-screen">
            <div className="container mx-auto px-6 md:px-12 py-20 max-w-6xl">

                <div className="text-center mb-20">
                    <span className="text-[#C99A4A] font-sans text-xs tracking-[0.3em] uppercase mb-4 block">
                        Inquiries
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tight mb-6">
                        Connect with <span className="italic font-light">Canderra</span>
                    </h1>
                    <p className="text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
                        Whether you're seeking to reserve a private sanctuary or require assistance with an existing booking, our dedicated team is at your service.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    <ContactForm />

                    <div className="flex flex-col justify-center">
                        <div className="space-y-12">
                            <div className="flex gap-6 items-start">
                                <div className="p-3 bg-muted rounded-full text-[#C99A4A]">
                                    <Mail size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-xl mb-2 text-foreground">Email</h4>
                                    <p className="text-muted-foreground font-light mb-1 text-sm">Our team will respond within 24 hours.</p>
                                    <a href="mailto:support@canderra.us" className="text-[#C99A4A] hover:text-foreground transition-colors font-medium text-sm">
                                        support@canderra.us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
