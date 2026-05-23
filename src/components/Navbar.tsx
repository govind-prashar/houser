'use client';

import Link from 'next/link';
import { Menu, X, Hop as HomeIcon } from 'lucide-react';
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === 'ADMIN';
    const isHome = pathname === '/';

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        setScrolled(latest > 20);
        if (latest > previous && latest > 150) setHidden(true);
        else setHidden(false);
    });

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    // On homepage: transparent when at top, solid when scrolled
    // On other pages: always solid
    const isTransparent = isHome && !scrolled;

    const navLinkClass = `text-sm font-medium transition-colors duration-200 ${
        isTransparent
            ? 'text-white/90 hover:text-white'
            : 'text-foreground hover:text-primary'
    }`;

    return (
        <>
            <motion.nav
                variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className={`fixed top-0 left-0 right-0 z-50 h-[80px] flex items-center transition-all duration-500 ${
                    isTransparent
                        ? 'bg-transparent border-b border-white/10'
                        : 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
                }`}
            >
                <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {pathname !== '/' && (
                            <Link href="/" className={`md:hidden transition ${isTransparent ? 'text-white' : 'text-foreground hover:text-primary'}`}>
                                <HomeIcon size={20} />
                            </Link>
                        )}
                        <Link href="/" className="group">
                            <span className={`text-xl md:text-2xl font-bold transition-colors duration-200 ${
                                isTransparent ? 'text-white' : 'text-foreground group-hover:text-primary'
                            }`}>
                                Canderra
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className={navLinkClass}>Home</Link>
                        <Link href="/properties" className={navLinkClass}>Properties</Link>
                        <Link href="/about" className={navLinkClass}>About</Link>
                        <Link href="/contact" className={navLinkClass}>Contact</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {session && (
                            <div className="hidden md:flex items-center gap-4 border-l border-border pl-4">
                                {isAdmin && (
                                    <Link href="/admin" className={navLinkClass}>Admin</Link>
                                )}
                                <button onClick={() => signOut()} className={navLinkClass}>
                                    Sign out
                                </button>
                            </div>
                        )}
                        <button
                            className={`md:hidden p-2 -mr-2 transition ${isTransparent ? 'text-white' : 'text-foreground hover:text-primary'}`}
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-[60] bg-background pt-[80px] md:hidden"
                    >
                        <div className="flex flex-col h-full p-6">
                            <button onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-6 right-6 text-foreground hover:text-primary transition">
                                <X size={24} />
                            </button>
                            <div className="flex flex-col gap-6 flex-1 mt-4">
                                {[
                                    { href: "/", label: "Home" },
                                    { href: "/properties", label: "Properties" },
                                    { href: "/about", label: "About" },
                                    { href: "/contact", label: "Contact" },
                                ].map(({ href, label }) => (
                                    <Link key={href} href={href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-2xl font-semibold text-foreground hover:text-primary transition-colors duration-200">
                                        {label}
                                    </Link>
                                ))}
                                {session && isAdmin && (
                                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}
                                        className="text-2xl font-semibold text-foreground hover:text-primary transition-colors duration-200">
                                        Admin
                                    </Link>
                                )}
                            </div>
                            {session && (
                                <button onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                    className="text-lg text-muted-foreground hover:text-primary transition text-left pb-8">
                                    Sign out
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
