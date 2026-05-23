import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://canderra.us'),
  title: {
    default: "Canderra | Luxury Residences & Private Sanctuaries",
    template: "%s | Canderra",
  },
  description: "Experience the art of hospitality. Discover meticulously curated luxury stays, extraordinary residences, and private sanctuaries worldwide with Canderra.",
  keywords: ["luxury stays", "private residences", "vacation rentals", "luxury travel", "canderra", "booking", "boutique homes"],
  authors: [{ name: "Canderra Ltd." }],
  creator: "Canderra Ltd.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://canderra.us",
    title: "Canderra | Luxury Residences & Private Sanctuaries",
    description: "Experience the art of hospitality. Discover meticulously curated luxury stays, extraordinary residences, and private sanctuaries worldwide.",
    siteName: "Canderra",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&h=630&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Canderra Luxury Property",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canderra | Luxury Residences & Private Sanctuaries",
    description: "Experience the art of hospitality. Discover meticulously curated luxury stays and extraordinary residences.",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&h=630&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'VZsxzZnQl--Vcs29csFWDH9ICW39uos4XYHANtmRE-0',
  },
  category: "travel",
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon-iphone-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-touch-icon-ipad-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-touch-icon-iphone-retina-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-touch-icon-ipad-retina-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
};

import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { PageWrapper } from "@/components/PageWrapper";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${cormorant.variable} ${dmSerif.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>
          <Navbar />
          <PageWrapper>
            <main className="flex-1">
              {children}
            </main>
          </PageWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
