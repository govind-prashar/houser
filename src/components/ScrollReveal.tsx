"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: React.ReactNode;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    className?: string;
    threshold?: number;
    once?: boolean;
}

export function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 1500, // Cinematic Slow Motion
    className,
    threshold = 0.1,
    once = true,
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                threshold,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, once]);

    const directions = {
        up: "translate-y-12",
        down: "-translate-y-12",
        left: "translate-x-12",
        right: "-translate-x-12",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all ease-[cubic-bezier(0.22,1,0.36,1)]", // Heavy, luxurious easing
                isVisible ? "opacity-100 translate-x-0 translate-y-0" : cn("opacity-0", directions[direction]),
                className
            )}
            style={{
                transitionDelay: `${delay}ms`,
                transitionDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
}
