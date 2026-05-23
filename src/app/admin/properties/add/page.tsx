import { PropertyForm } from '@/components/PropertyForm'
import { createProperty } from '@/app/actions/property'
import { BackButton } from '@/components/ui/BackButton'

export default function AddPropertyPage() {
    return (
        <div className="container mx-auto px-4 pb-16 max-w-4xl">
            <div className="mb-8">
                <BackButton label="Back to Search" />
            </div>

            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50 backdrop-blur-sm">
                <h1 className="text-3xl font-bold mb-2 text-foreground">Add New Property</h1>
                <p className="text-muted-foreground mb-8">Fill in the details to add a new property listing</p>

                <PropertyForm
                    action={createProperty}
                    submitLabel="Add Property"
                    loadingLabel="Adding Property..."
                    successMessage="Property added successfully!"
                />
            </div>
        </div>
    )
}
