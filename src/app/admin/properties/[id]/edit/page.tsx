import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PropertyForm } from '@/components/PropertyForm'
import { updateProperty } from '@/app/actions/property'
import { BackButton } from "@/components/ui/BackButton"

interface EditPropertyPageProps {
    params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Authorization check
    if ((session?.user as any)?.role !== 'ADMIN') {
        redirect('/')
    }

    const property = await prisma.property.findUnique({
        where: { id },
        include: { pricingRules: true }
    })

    if (!property) {
        notFound()
    }

    // Prepare initial data
    const initialData = {
        id: property.id,
        title: property.title,
        metaDescription: (property as { metaDescription?: string | null }).metaDescription || '',
        description: property.description,
        price: property.price,
        location: property.location,
        type: property.type,
        maxGuests: property.maxGuests,
        bedrooms: (property as any).bedrooms,
        beds: (property as any).beds,
        bathrooms: (property as any).bathrooms,
        squareFeet: (property as any).squareFeet || null,
        amenities: JSON.parse(property.amenities),
        images: JSON.parse(property.images),
        cleaningFee: (property as any).cleaningFee || 0,
        serviceFee: (property as any).serviceFee || 0,
        monthlyPrice: (property as any).monthlyPrice || null,
        priceDisplay: (property as any).priceDisplay || 'nightly',
        guestAccess: (property as any).guestAccess || '',
        neighborhood: (property as any).neighborhood || '',
        interaction: (property as any).interaction || '',
        houseRules: (property as any).houseRules || '',
        notes: (property as any).notes || '',
        gettingAround: (property as any).gettingAround || '',
        checkIn: (property as any).checkIn || '04:00 PM',
        checkOut: (property as any).checkOut || '11:00 AM',
        pricingRules: property.pricingRules.map(rule => ({
            id: rule.id,
            startDate: rule.startDate,
            endDate: rule.endDate,
            price: rule.price
        })),
    }

    // Create a bound action that includes the propertyId
    const boundUpdateProperty = updateProperty.bind(null, id)

    return (
        <div className="container mx-auto px-4 pb-16 max-w-4xl">
            <div className="mb-8">
                <BackButton label="Back to Search" />
            </div>

            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-foreground">Edit Property</h1>
                        <p className="text-muted-foreground">Update the details for "{property.title}"</p>
                    </div>
                    <a
                        href={`/admin/properties/${property.id}/pricing`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#C99A4A] text-primary-foreground shadow hover:bg-[#B2823A] h-9 px-4 py-2"
                    >
                        Manage Dynamic Pricing
                    </a>
                </div>

                <PropertyForm
                    initialData={initialData}
                    action={boundUpdateProperty}
                    submitLabel="Update Property"
                    loadingLabel="Updating Property..."
                    successMessage="Property updated successfully!"
                />
            </div>
        </div>
    )
}
