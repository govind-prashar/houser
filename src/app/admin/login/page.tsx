'use client'

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

function AdminLoginForm() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const callbackUrl = searchParams.get("callbackUrl") || "/admin";

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: callbackUrl,
        });

        if (res?.error) {
            setError("Invalid admin credentials");
        } else if (res?.ok) {
            // Wait a moment for session to be established, then redirect
            await new Promise(resolve => setTimeout(resolve, 200));
            window.location.href = callbackUrl;
        }
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2574&auto=format&fit=crop"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-graphite/60 backdrop-blur-[3px]" />
            </div>

            <div className="relative z-10 w-full max-w-md p-10 border border-white/20 rounded-[2rem] shadow-2xl bg-ivory/90 backdrop-blur-xl">
                <div className="text-center mb-2">
                    <span className="font-serif text-3xl tracking-tight text-graphite">
                        Canderra.
                    </span>
                </div>
                <h1 className="text-xl font-medium mb-8 text-center text-foreground/60 uppercase tracking-widest text-xs">
                    Admin Access
                </h1>

                {error && (
                    <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground/60 text-xs font-bold uppercase tracking-widest">Email</Label>
                        <Input id="email" name="email" type="email" required placeholder="admin@canderra.com" className="bg-primary/5 border-primary/10 focus:border-primary/30 h-12" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground/60 text-xs font-bold uppercase tracking-widest">Password</Label>
                        <Input id="password" name="password" type="password" required className="bg-primary/5 border-primary/10 focus:border-primary/30 h-12" />
                    </div>

                    <Button type="submit" className="w-full bg-graphite hover-bg-gold text-ivory hover-text-white font-bold py-6 rounded-xl shadow-lg shadow-graphite/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        Access Admin Panel
                    </Button>
                </form>

                <div className="mt-8 text-center text-xs text-foreground/30 uppercase tracking-widest">
                    Authorized Personnel Only
                </div>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLoginForm />
        </Suspense>
    )
}
