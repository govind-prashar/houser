import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import Link from "next/link";
import { PropertyCard } from "@/components/PropertyCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import HoverButton from "@/components/HoverButton";

export const metadata: Metadata = {
  title: "Luxury Residences & Private Sanctuaries",
  description: "Discover curated luxury stays and private residences worldwide. Book extraordinary homes with Canderra — the art of hospitality.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Canderra | Luxury Residences & Private Sanctuaries",
    description: "Discover curated luxury stays and private residences worldwide with Canderra.",
    url: "/",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Canderra luxury residences" }],
  },
};

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const properties = await prisma.property.findMany({ take: 12, orderBy: { createdAt: 'desc' } });

  // Pick a real property image for the discover section
  let discoverImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop";
  for (const p of properties) {
    try {
      const imgs = JSON.parse(p.images);
      if (Array.isArray(imgs) && imgs.length > 0 && imgs[0].startsWith('http')) {
        discoverImage = imgs[0];
        break;
      }
    } catch (e) {}
  }

  return (
    <div className="w-full bg-background font-sans text-foreground overflow-x-hidden">
      <Hero />

      {/* Featured Properties */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-3 font-medium" style={{ color: '#C9A84C' }}>
                Handpicked for you
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Featured Properties
              </h2>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View all properties <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((property) => {
              let cover = "/placeholder.jpg";
              try {
                const parsed = JSON.parse(property.images);
                if (Array.isArray(parsed) && parsed.length > 0) cover = parsed[0];
              } catch (e) {}
              return (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  slug={(property as { slug?: string | null }).slug}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  image={cover}
                  beds={(property as any).bedrooms || 3}
                  baths={(property as any).bathrooms || 2}
                  sqft={(property as any).squareFeet || 2500}
                  featured={false}
                  isAdmin={isAdmin}
                  monthlyPrice={(property as any).monthlyPrice}
                  priceDisplay={(property as any).priceDisplay || 'nightly'}
                />
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <HoverButton
              href="/properties"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-widest text-white transition-all duration-300"
              iconSize={16}
            >
              View All Properties
            </HoverButton>
          </div>
        </div>
      </section>

      {/* Discover section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: '#C9A84C' }}>
              Who we are
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              Not Just a Stay.
              <br />
              An Experience.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-base">
              Canderra is a collection of the world's most extraordinary private residences — each one chosen for its character, craft, and soul. We believe where you stay shapes how you feel. So we only list places that move you.
            </p>
            <HoverButton
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-medium text-xs uppercase tracking-[0.25em] text-white transition-all duration-500"
              iconSize={15}
            >
              Explore Now
            </HoverButton>
          </div>
          <div className="relative h-[500px] overflow-hidden">
            <img
              src={discoverImage}
              alt="Luxury living — Canderra"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}
