'use client'

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";

export function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";
    const isAboutPage = pathname === "/about";
    const isCheckoutPage = pathname?.startsWith("/checkout");

    return (
        <div className={cn(
            "flex flex-col flex-1",
            (!isHomePage && !isAboutPage) && "pt-[112px]" // Increased from 80px for better breathing room
        )}>
            {children}
            {!isCheckoutPage && <Footer />}
        </div>
    );
}
