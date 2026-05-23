'use client'

import {
    Waves,
    TreePine,
    Umbrella,
    Castle,
    Mountain,
    Rocket,
    Palmtree,
    Ship,
    Tent,
    Snowflake
} from 'lucide-react'
import { cn } from "@/lib/utils"

export function CategoryBar() {
    const categories = [
        { name: 'Amazing Pools', icon: Waves },
        { name: 'Cabins', icon: TreePine },
        { name: 'Beachfront', icon: Umbrella },
        { name: 'Mansions', icon: Castle },
        { name: 'Countryside', icon: Mountain },
        { name: 'OMG!', icon: Rocket },
        { name: 'Islands', icon: Palmtree },
        { name: 'Lakefront', icon: Ship },
        { name: 'Camping', icon: Tent },
        { name: 'Arctic', icon: Snowflake },
    ];

    return (
        <div className="flex gap-10 overflow-x-auto pb-4 items-center no-scrollbar text-foreground/60 border-b border-primary/10 pt-4 mb-6">
            {categories.map((cat, idx) => (
                <div
                    key={cat.name}
                    className={cn(
                        "flex flex-col items-center gap-2 cursor-pointer hover:text-primary hover:border-b-2 hover:border-primary/50 pb-2 min-w-fit transition duration-200",
                        idx === 0 ? "text-primary border-b-2 border-primary" : "border-transparent border-b-2"
                    )}
                >
                    <cat.icon size={24} strokeWidth={1.5} />
                    <span className="text-xs font-semibold">{cat.name}</span>
                </div>
            ))}
        </div>
    )
}
