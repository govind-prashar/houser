import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Complete Your Booking",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
