'use client'

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
    label?: string;
    className?: string;
}

export function BackButton({ label = "Back", className }: BackButtonProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={`flex items-center gap-3 group transition-all duration-300 ${className}`}
        >
            <ArrowLeft
                className="w-4 h-4 text-white/40 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1"
            />
            <span className="text-xs uppercase tracking-[0.25em] text-white/40 group-hover:text-white/70 transition-all duration-300 font-light">
                {label}
            </span>
        </button>
    );
}
