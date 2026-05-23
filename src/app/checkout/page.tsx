'use client';

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createBooking } from "@/app/actions/booking";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, User, Mail, Phone, Calendar, Users } from "lucide-react";
import Link from "next/link";
import CheckoutFooter from "@/components/CheckoutFooter";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get booking details from URL params
    const propertyId = searchParams.get('propertyId') || '';
    const propertySlug = searchParams.get('propertySlug') || propertyId;
    const propertyTitle = searchParams.get('title') || 'Property';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const guests = parseInt(searchParams.get('guests') || '1');
    const nights = parseInt(searchParams.get('nights') || '0');
    const pricePerNight = parseFloat(searchParams.get('price') || '0');
    const cleaningFee = parseFloat(searchParams.get('cleaningFee') || '0');
    const serviceFee = parseFloat(searchParams.get('serviceFee') || '0');
    const total = parseFloat(searchParams.get('total') || '0');

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirmBooking = async () => {
        // Validate form
        if (!fullName || !email || !phone) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!propertyId || !checkIn || !checkOut) {
            toast.error("Invalid booking details");
            return;
        }

        setLoading(true);
        const res = await createBooking(
            propertyId,
            new Date(checkIn),
            new Date(checkOut),
            total,
            guests,
            fullName,
            email,
            phone
        );
        setLoading(false);

        if (res.error) {
            toast.error("Booking Failed", {
                description: res.error,
            });
        } else {
            toast.success("Booking Confirmed!", {
                description: "Your booking information has been sent to the owner. They will contact you.",
            });
            router.push('/');
        }
    };

    return (
        <>
            <div className="min-h-screen relative bg-background transition-colors duration-300">
                {/* Background Image with Improved Overlay */}
                <div className="fixed inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2500&auto=format&fit=crop"
                        alt="Luxury Interior Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Darker, reduced opacity overlay for text readability */}
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 pb-8">
                    {/* Back Button */}
                    <Link
                        href={`/properties/${propertySlug}`}
                        className="inline-flex items-center gap-3 mb-8 group transition-all duration-300"
                    >
                        <ArrowLeft size={14} className="text-white/40 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1" />
                        <span className="text-xs uppercase tracking-[0.25em] text-white/40 group-hover:text-white/70 transition-all duration-300 font-light">Back to property</span>
                    </Link>

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="font-serif text-4xl md:text-6xl text-white mb-3 drop-shadow-lg">
                            Request to <span className="italic font-light">Book</span>
                        </h1>
                        <p className="text-white/80 text-lg font-light drop-shadow-md">Just a few more details to complete your booking</p>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Guest Details Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
                                <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">
                                    Guest Information
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-white/80 font-sans text-sm uppercase tracking-wider font-semibold">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                            <Input
                                                id="fullName"
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="John Doe"
                                                className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-white/30 focus:bg-white/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-white/80 font-sans text-sm uppercase tracking-wider font-semibold">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="john@example.com"
                                                className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-white/30 focus:bg-white/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-white/80 font-sans text-sm uppercase tracking-wider font-semibold">
                                            Phone Number
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 (555) 123-4567"
                                                className="pl-10 h-12 bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-white/30 focus:bg-white/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            By confirming this reservation, you agree to our terms of service and cancellation policy.
                                            A confirmation email will be sent to the provided address.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Booking Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 sticky top-24">
                                <h3 className="font-serif text-xl text-white mb-4 font-semibold">Booking Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-white/60 mb-1 font-semibold">Property</p>
                                        <p className="text-white font-medium text-lg leading-tight">{propertyTitle}</p>
                                    </div>

                                    <Separator className="bg-white/20" />

                                    <div className="flex items-start gap-3">
                                        <Calendar size={18} className="text-[#C99A4A] mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs uppercase tracking-wider text-white/60 mb-1 font-semibold">Check-in</p>
                                            <p className="text-white font-medium">{checkIn ? format(new Date(checkIn), 'MMM dd, yyyy') : '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar size={18} className="text-[#C99A4A] mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs uppercase tracking-wider text-white/60 mb-1 font-semibold">Check-out</p>
                                            <p className="text-white font-medium">{checkOut ? format(new Date(checkOut), 'MMM dd, yyyy') : '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Users size={18} className="text-[#C99A4A] mt-0.5 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs uppercase tracking-wider text-white/60 mb-1 font-semibold">Guests</p>
                                            <p className="text-white font-medium">{guests} {guests === 1 ? 'guest' : 'guests'}</p>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/20" />

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-white/60 mb-3 font-semibold">Price Details</p>
                                        <div className="space-y-2 text-sm text-white/80">
                                            <div className="flex justify-between">
                                                <span className="text-white/60">${pricePerNight} × {nights} nights</span>
                                                <span className="text-white font-semibold">${pricePerNight * nights}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Cleaning fee</span>
                                                <span className="text-white font-semibold">${cleaningFee}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">Service fee</span>
                                                <span className="text-white font-semibold">${serviceFee}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/20" />

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-serif text-lg text-white font-semibold">Total</span>
                                        <span className="font-serif text-2xl text-[#C99A4A] font-bold drop-shadow-sm">${total}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleConfirmBooking}
                                    disabled={loading}
                                    className="w-full bg-[#C99A4A] text-white hover:bg-[#B68A3A] hover:text-white h-12 text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 border-none"
                                >
                                    {loading ? "Processing..." : "Request to Book"}
                                </Button>

                                <p className="text-xs text-center text-white/50 mt-4 font-medium">
                                    You won't be charged until checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Footer with Glassmorphism */}
            <CheckoutFooter />
        </>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-ivory">
                <p className="text-graphite">Loading checkout...</p>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
