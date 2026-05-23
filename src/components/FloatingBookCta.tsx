"use client";

import { ArrowRight } from "lucide-react";

type FloatingBookCtaProps = {
    onClick: () => void;
    label?: string;
};

export function FloatingBookCta({ onClick, label = "Request to Book" }: FloatingBookCtaProps) {
    return (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 md:hidden">
            <button
                type="button"
                onClick={onClick}
                className="flex items-center gap-2 rounded-full bg-graphite px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-ivory shadow-2xl shadow-black/30 ring-2 ring-primary/40 transition-all hover:bg-primary hover:scale-105 active:scale-95"
            >
                {label}
                <ArrowRight size={16} />
            </button>
        </div>
    );
}
