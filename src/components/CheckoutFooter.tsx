import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";

export default function CheckoutFooter() {
    return (
        <footer className="relative mt-auto">
            {/* Glassmorphism container matching checkout page aesthetic */}
            <div className="relative z-10 mx-4 mb-6 bg-white/10 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-colors duration-300">
                <div className="container mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
                        {/* Brand - Span 6 */}
                        <div className="md:col-span-6 flex flex-col justify-between h-full">
                            <div>
                                <Link href="/" className="inline-block group">
                                    <span className="font-serif text-5xl md:text-7xl tracking-tight text-white group-hover:text-[#C99A4A] transition-colors duration-300">Canderra</span>
                                </Link>
                            </div>
                        </div>

                        {/* Contact - Span 6 */}
                        <div className="md:col-span-6 flex flex-col gap-8 md:items-end text-right">
                            <div className="md:text-right">
                                <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/50 mb-6">Get in Touch</h4>
                                <div className="flex flex-col gap-4 font-sans font-light md:items-end">
                                    <a href="mailto:support@canderra.us" className="hover:text-[#C99A4A] transition-colors text-lg md:text-xl flex items-center gap-3 group text-white">
                                        <Mail size={20} className="text-[#C99A4A] group-hover:text-white transition-colors" strokeWidth={1.5} />
                                        <span>support@canderra.us</span>
                                    </a>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Footer Bottom */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/10 pt-8 items-start">
                        {/* Tagline - Span 4 */}
                        <div className="md:col-span-4 text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                            <div className="flex items-center gap-2 opacity-60 max-w-xs md:mx-auto lg:mx-0">
                                <Sparkles size={14} className="text-[#C99A4A]" strokeWidth={1.5} />
                                <p>The art of slowing down.</p>
                            </div>
                        </div>

                        {/* Disclaimer - Span 4 */}
                        <div className="md:col-span-4 text-[10px] text-white/40 uppercase tracking-widest leading-relaxed md:text-center">
                            <p className="normal-case opacity-40 max-w-sm leading-relaxed text-balance mx-auto">
                                All information is deemed reliable but not guaranteed and should be independently reviewed and verified.
                            </p>
                        </div>

                        {/* Copyright - Span 4 */}
                        <div className="md:col-span-4 text-[10px] text-stone tracking-widest leading-relaxed md:text-right">
                            <p className="whitespace-nowrap opacity-40 uppercase">
                                &copy; {new Date().getFullYear()} Canderra <span className="normal-case tracking-normal">Ltd</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
