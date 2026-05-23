import Image from "next/image";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1481437156560-3205f6a55735?q=80&w=2695&auto=format&fit=crop"
                    alt="Admin Background"
                    fill
                    className="object-cover opacity-10" // Low opacity so content is readable
                    priority
                />
                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
