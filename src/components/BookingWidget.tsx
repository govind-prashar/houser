'use client'

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createBooking } from "@/app/actions/booking";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { DateRange, DayButtonProps } from "react-day-picker";
import { useTheme } from "next-themes";

interface BookingWidgetProps {
    propertyId: string;
    propertySlug?: string;
    propertyTitle: string;
    price: number;
    cleaningFee?: number;
    serviceFee?: number;
    maxGuests: number;
    pricingRules?: { startDate: Date; endDate: Date; price: number }[];
}

export function BookingWidget({ propertyId, propertySlug, propertyTitle, price, cleaningFee = 0, serviceFee = 0, maxGuests, pricingRules = [] }: BookingWidgetProps) {
    const [date, setDate] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Calculate nights & dynamic price
    let nights = 0;
    let totalPrice = 0;

    if (date?.from && date?.to) {
        nights = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
        if (nights === 0) nights = 1; // Minimum 1 night if same day selected

        // Calculate dynamic total
        for (let i = 0; i < nights; i++) {
            const currentDate = new Date(date.from.getTime() + (i * 24 * 60 * 60 * 1000));
            // Set to midnight for clean comparison
            currentDate.setHours(0, 0, 0, 0);

            // Find if there's an active rule for this specific date
            const ruleForDay = pricingRules.find(rule => {
                const ruleStart = new Date(rule.startDate).setHours(0, 0, 0, 0);
                const ruleEnd = new Date(rule.endDate).setHours(0, 0, 0, 0);
                return currentDate.getTime() >= ruleStart && currentDate.getTime() <= ruleEnd;
            });

            if (ruleForDay) {
                totalPrice += ruleForDay.price;
            } else {
                totalPrice += price; // Fallback to base price
            }
        }
    }

    const grandTotal = totalPrice + cleaningFee + serviceFee;
    const avgNightlyPrice = nights > 0 ? Math.round(totalPrice / nights) : price;

    const router = useRouter();

    async function handleReserve() {
        if (!date?.from || !date?.to) {
            toast.error("Dates Selection Required", {
                description: "Please select both check-in and check-out dates to proceed.",
                duration: 4000,
            });
            return;
        }

        if (guests > maxGuests) {
            toast.error("Guest Limit Exceeded", {
                description: `This property can accommodate a maximum of ${maxGuests} guests.`,
                duration: 4000,
            });
            return;
        }

        // Navigate to checkout page with all booking details
        const params = new URLSearchParams({
            propertyId,
            propertySlug: propertySlug || propertyId,
            title: propertyTitle,
            checkIn: date.from.toISOString(),
            checkOut: date.to.toISOString(),
            guests: guests.toString(),
            nights: nights.toString(),
            price: avgNightlyPrice.toString(), // Store the averaged dynamic nightly price
            cleaningFee: cleaningFee.toString(),
            serviceFee: serviceFee.toString(),
            total: grandTotal.toString(),
        });

        router.push(`/checkout?${params.toString()}`);
    }

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default to white if not mounted or theme is undefined
    const bgColor = mounted && resolvedTheme === 'dark' ? '#0c0c0c' : '#ffffff';

    const calendarComponents = React.useMemo(() => ({
        DayButton: (props: DayButtonProps) => {
            const { day } = props;

            // Calculate price for this day
            let dayPrice = price; // Base price
            const currentDate = new Date(day.date).setHours(0, 0, 0, 0);

            // Check if there is a matching rule
            const ruleForDay = pricingRules.find(rule => {
                const ruleStart = new Date(rule.startDate).setHours(0, 0, 0, 0);
                const ruleEnd = new Date(rule.endDate).setHours(0, 0, 0, 0);
                return currentDate >= ruleStart && currentDate <= ruleEnd;
            });

            if (ruleForDay) {
                dayPrice = ruleForDay.price;
            }

            return (
                <CalendarDayButton {...props}>
                    <div className="flex flex-col items-center justify-center">
                        <span>{day.date.getDate()}</span>
                        <span className={cn(
                            "text-[9px] font-medium leading-none mt-0.5",
                            ruleForDay ? "text-[#C99A4A]" : "text-muted-foreground/60",
                            props.modifiers.selected && !props.modifiers.range_middle && "text-white opacity-90",
                            props.modifiers.range_middle && "text-muted-foreground"
                        )}>
                            ${dayPrice}
                        </span>
                    </div>
                </CalendarDayButton>
            );
        }
    }), [price, pricingRules]);

    return (
        <div id="booking-widget" className="relative">
            <div className="sticky top-24 border border-primary/20 rounded-2xl shadow-2xl p-6 space-y-6 bg-card/30 backdrop-blur-3xl">
                <div>
                    <div className="flex flex-col">
                        {nights === 0 && <span className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Starting from</span>}
                        <div>
                            <span className="text-2xl font-hero text-foreground italic">${nights > 0 ? avgNightlyPrice : price}</span>
                            <span className="text-foreground/40 text-sm font-light uppercase tracking-widest"> / night</span>
                        </div>
                    </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden bg-background/50">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                            <div className="grid grid-cols-2 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors group">
                                <div className="p-3 border-r border-border">
                                    <div className="text-[10px] font-bold uppercase mb-1 text-muted-foreground group-hover:text-foreground transition-colors">Check-in</div>
                                    <div className="text-sm truncate w-full text-left font-light text-foreground">
                                        {date?.from ? format(date.from, "MM/dd/yyyy") : "Add date"}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <div className="text-[10px] font-bold uppercase mb-1 text-muted-foreground group-hover:text-foreground transition-colors">Check-out</div>
                                    <div className="text-sm truncate w-full text-left font-light text-foreground">
                                        {date?.to ? format(date.to, "MM/dd/yyyy") : "Add date"}
                                    </div>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            sideOffset={10}
                            align="end"
                            style={{ backgroundColor: bgColor }}
                            className="w-auto p-0 border border-border shadow-2xl z-[9999] text-foreground overflow-hidden rounded-xl"
                        >
                            <Calendar
                                mode="range"
                                selected={date}
                                onSelect={(newDate) => {
                                    setDate(newDate);
                                }}
                                initialFocus
                                numberOfMonths={2}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                captionLayout="dropdown"
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 2}
                                className="p-4"
                                components={calendarComponents}
                            />
                            <div className="flex justify-between items-center p-4 border-t border-border gap-4">
                                <button
                                    onClick={() => setDate(undefined)}
                                    className="text-sm font-bold border border-transparent bg-transparent text-muted-foreground hover:bg-[#C99A4A] hover:border-[#C99A4A] hover:text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-sm w-full"
                                >
                                    Clear dates
                                </button>
                                <button
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="text-sm font-bold bg-graphite text-ivory hover:bg-[#C99A4A] hover:text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-sm w-full"
                                >
                                    Close
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <div className="p-3 hover:bg-accent cursor-pointer transition-colors">
                        <div className="text-[10px] font-bold uppercase text-muted-foreground">Guests</div>
                        <div className="text-sm text-foreground">
                            <input
                                type="number"
                                min={1}
                                max={maxGuests}
                                value={guests}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value);
                                    if (isNaN(val)) val = 1;
                                    if (val > maxGuests) {
                                        toast.error(`Maximum ${maxGuests} guests allowed`);
                                        val = maxGuests;
                                    }
                                    setGuests(val);
                                }}
                                className="w-full bg-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleReserve}
                    disabled={loading}
                    className="
        group
        relative
        overflow-hidden
        w-full
        h-14
        rounded-xl
        border
        border-[hsl(var(--primary))]
        bg-transparent
        text-[hsl(var(--primary))]
        font-bold
        text-base
        uppercase
        tracking-[0.15em]
        transition-all
        duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
        shadow-[0_10px_30px_hsl(var(--primary)/0.12)]
    "
                >
                    {/* Text */}
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                        {loading ? "Processing..." : "Request to Book"}
                    </span>

                    {/* Gold Fill */}
                    <span
                        className="
            absolute
            inset-0
            translate-y-full
            bg-[hsl(var(--primary))]
            transition-transform
            duration-300
            ease-out
            group-hover:translate-y-0
        "
                    />
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    You won't be charged yet
                </div>

                {nights > 0 && (
                    <div className="space-y-3 pt-2 text-foreground">
                        <div className="flex justify-between">
                            <span className="underline decoration-muted-foreground"> ${avgNightlyPrice} x {nights} nights</span>
                            <span className="font-hero italic">${totalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline decoration-muted-foreground">Cleaning fee</span>
                            <span>${cleaningFee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline decoration-muted-foreground">Service fee</span>
                            <span>${serviceFee}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-extrabold text-xl text-primary drop-shadow-[0_0_15px_rgba(178,145,86,0.3)]">
                            <span>Total</span>
                            <span className="font-hero italic">${grandTotal}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* Mobile Sticky Bottom Bar */}
            <div
                className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-xl border-t border-[#C99A4A]/20 z-40 md:hidden flex justify-between items-center pb-8 bg-background/95"
            >
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        {nights === 0 && <span className="text-[10px] text-[#C99A4A] uppercase tracking-widest mb-0.5">Starting from</span>}
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-serif text-foreground">${nights > 0 ? avgNightlyPrice : price}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest"> / night</span>
                        </div>
                    </div>
                    <button
                        onClick={() => document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-[10px] font-medium text-[#C99A4A] hover:text-foreground transition-colors underline decoration-[#C99A4A]/50 hover:decoration-foreground"
                    >
                        {date?.from && date?.to ? `${nights} nights` : "Select dates"}
                    </button>
                </div>
                <Button
                    onClick={handleReserve}
                    disabled={loading}
                    className="bg-foreground text-background px-8 h-12 rounded-full shadow-xl transition-all duration-300 hover:opacity-90"
                >
                    {loading ? "..." : "Reserve"}
                </Button>
            </div>
        </div>
    );
}
