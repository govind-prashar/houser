'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { X, Upload, Check, Copy, ExternalLink, Trash2, Calendar as CalendarIcon, DollarSign, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { format } from "date-fns"
import { DateRange, DayButtonProps } from "react-day-picker"

const AMENITY_CATEGORIES = {
    "Basics": ["Wifi", "Air conditioning", "Heating", "Kitchen", "Washer", "Dryer", "Hot water", "Essentials", "Hangers", "Iron", "Hair dryer", "Dedicated workspace", "TV", "Sound system", "Stereo system"],
    "Bathroom": ["Bathtub", "Shower gel", "Shampoo", "Conditioner", "Body soap", "Cleaning products", "Towels provided"],
    "Bedroom": ["Bed linens", "Extra pillows and blankets", "Room-darkening shades"],
    "Kitchen & Dining": ["Refrigerator", "Freezer", "Microwave", "Dishwasher", "Stove", "Oven", "Coffee maker", "Kettle", "Toaster", "Blender", "Baking sheet", "Cookware", "Dishes and silverware", "Dining table", "Wine glasses", "Coffee"],
    "Outdoor": ["Patio or balcony", "Garden or backyard", "Outdoor furniture", "Outdoor dining area", "BBQ grill", "Barbeque utensils", "Swimming pool", "Outdoor pool", "Hot tub", "Beach essentials", "Free parking on premises", "Paid parking"],
    "Safety": ["Smoke detector", "Carbon monoxide detector", "Fire extinguisher", "First aid kit"],
    "View": ["City View", "Mountain", "Mountain view", "Beach View"],
    "Services": ["Long term stays allowed", "Cleaning Disinfection", "Cleaning before checkout", "Enhanced cleaning practices", "High touch surfaces disinfected", "Private entrance", "Family/kid friendly"],
    "Local": ["Museums", "Shopping"]
}

const ALL_AMENITIES = Object.values(AMENITY_CATEGORIES).flat();

interface PropertyFormProps {
    initialData?: {
        id?: string;
        title: string;
        metaDescription?: string;
        description: string;
        price: number;
        location: string;
        type: string;
        maxGuests: number;
        bedrooms: number;
        beds: number;
        bathrooms: number;
        amenities: string[];
        images: string[];
        cleaningFee?: number;
        serviceFee?: number;
        guestAccess?: string;
        neighborhood?: string;
        interaction?: string;
        houseRules?: string;
        notes?: string;
        gettingAround?: string;
        checkIn?: string;
        checkOut?: string;
        pricingRules?: { id?: string; startDate: string | Date; endDate: string | Date; price: number }[];
    };
    action: (formData: FormData) => Promise<{ success?: boolean; error?: string; propertyId?: string }>;
    submitLabel: string;
    loadingLabel: string;
    successMessage: string;
}

export function PropertyForm({
    initialData,
    action,
    submitLabel,
    loadingLabel,
    successMessage
}: PropertyFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploadingImages, setUploadingImages] = useState(false)
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(initialData?.images || [])
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || [])

    // Dynamic Pricing State
    const [pricingDate, setPricingDate] = useState<DateRange | undefined>()
    const [pricingPrice, setPricingPrice] = useState<string>("")
    const [pendingPricingRules, setPendingPricingRules] = useState<{ id?: string; startDate: string | Date; endDate: string | Date; price: number }[]>(initialData?.pricingRules || [])

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        metaDescription: initialData?.metaDescription || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        location: initialData?.location || '',
        type: initialData?.type || 'Apartment',
        maxGuests: initialData?.maxGuests?.toString() || '1',
        bedrooms: initialData?.bedrooms?.toString() || '1',
        beds: initialData?.beds?.toString() || '1',
        bathrooms: initialData?.bathrooms?.toString() || '1',
        squareFeet: (initialData as any)?.squareFeet?.toString() || '',
        cleaningFee: initialData?.cleaningFee?.toString() || '0',
        serviceFee: initialData?.serviceFee?.toString() || '0',
        monthlyPrice: (initialData as any)?.monthlyPrice?.toString() || '',
        priceDisplay: (initialData as any)?.priceDisplay || 'nightly',
        guestAccess: initialData?.guestAccess || '',
        neighborhood: initialData?.neighborhood || '',
        interaction: initialData?.interaction || '',
        houseRules: initialData?.houseRules || '',
        notes: initialData?.notes || '',
        gettingAround: initialData?.gettingAround || '',
        checkIn: initialData?.checkIn || '04:00 PM',
        checkOut: initialData?.checkOut || '11:00 AM',
        manualImages: '',
    })

    // Client-side image compression to speed up uploads
    async function compressImage(file: File, maxWidth = 2400, quality = 0.92): Promise<File> {
        // Skip non-image files and HEIC (let server handle HEIC)
        const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
        if (!file.type.startsWith('image/') || isHEIC) return file;

        return new Promise((resolve) => {
            const img = document.createElement('img');
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Only downscale if image is larger than maxWidth
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            resolve(file);
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.onerror = () => resolve(file);
            img.src = url;
        });
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploadingImages(true)
        try {
            // Compress all images in parallel
            const compressedFiles = await Promise.all(
                Array.from(files).map(file => compressImage(file))
            );

            // Upload each image in parallel for maximum speed
            const uploadResults = await Promise.allSettled(
                compressedFiles.map(async (file) => {
                    const uploadFormData = new FormData()
                    uploadFormData.append('files', file)
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: uploadFormData,
                    })
                    if (!response.ok) throw new Error('Upload failed')
                    const data = await response.json()
                    // Add each URL as it arrives
                    if (data.urls?.length > 0) {
                        setUploadedImageUrls(prev => [...prev, ...data.urls])
                    }
                    return data.urls
                })
            )

            const succeeded = uploadResults.filter(r => r.status === 'fulfilled').length
            const failed = uploadResults.filter(r => r.status === 'rejected').length

            if (succeeded > 0) toast.success(`${succeeded} image(s) uploaded successfully!`)
            if (failed > 0) toast.error(`${failed} image(s) failed to upload`)
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload images')
        } finally {
            setUploadingImages(false)
            e.target.value = ''
        }
    }

    function removeUploadedImage(index: number) {
        setUploadedImageUrls(uploadedImageUrls.filter((_, i) => i !== index))
    }

    function toggleAmenity(amenity: string) {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const allImageUrls = [...uploadedImageUrls]
        if (formData.manualImages) {
            const manualUrls = formData.manualImages
                .split(/[,\n]/)
                .map(url => url.trim())
                .filter(url => url.length > 0)
            allImageUrls.push(...manualUrls)
        }

        // No fallback image if empty - as requested
        // if (allImageUrls.length === 0) {
        //     allImageUrls.push('https://images.unsplash.com/photo-1564013799919-ab600027ffc6')
        // }

        const formDataToSend = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'manualImages') {
                formDataToSend.append(key, value)
            }
        })

        formDataToSend.append('images', allImageUrls.join('\n'))
        formDataToSend.append('amenities', selectedAmenities.join(','))
        formDataToSend.append('pricingRules', JSON.stringify(pendingPricingRules))

        const result = await action(formDataToSend)

        if (result.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            toast.success(successMessage)
            router.push('/search')
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Basic Info Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Basic Information</h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Property Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Casa Zenithia"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Main Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the property in detail..."
                            rows={8}
                        />
                    </div>
                    <div>
                        <Label htmlFor="metaDescription">SEO Description (optional)</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Custom text for Google search results — 150–160 characters ideal. Leave blank to auto-generate.
                        </p>
                        <Textarea
                            id="metaDescription"
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                            placeholder="e.g. Book this Malibu ocean-view estate with Canderra. Private pool, 5 bedrooms..."
                            rows={3}
                            maxLength={320}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1 text-right">
                            {formData.metaDescription.length}/160 recommended
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g., Beverly Grove, Los Angeles"
                            />
                        </div>
                        <div>
                            <Label htmlFor="type">Property Type</Label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-card/50 px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
                            >
                                <option value="Villa" className="bg-card">Villa</option>
                                <option value="House" className="bg-card">House</option>
                                <option value="Apartment" className="bg-card">Apartment</option>
                                <option value="Cabin" className="bg-card">Cabin</option>
                                <option value="Condo" className="bg-card">Condo</option>
                                <option value="Studio" className="bg-card">Studio</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Space Details Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Space Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                        <Label htmlFor="maxGuests">Max Guests</Label>
                        <Input
                            id="maxGuests"
                            type="number"
                            min="1"
                            value={formData.maxGuests}
                            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                            id="bedrooms"
                            type="number"
                            min="0"
                            value={formData.bedrooms}
                            onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="beds">Beds</Label>
                        <Input
                            id="beds"
                            type="number"
                            min="0"
                            value={formData.beds}
                            onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                            id="bathrooms"
                            type="number"
                            step="0.5"
                            min="0"
                            value={formData.bathrooms}
                            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="squareFeet">Square Feet</Label>
                        <Input
                            id="squareFeet"
                            type="number"
                            min="0"
                            value={formData.squareFeet}
                            onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                            placeholder="e.g., 2500"
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Pricing & Fees</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="price">Price per Night ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                        <Input
                            id="monthlyPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.monthlyPrice}
                            onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                            placeholder="Leave empty if N/A"
                        />
                    </div>
                    <div>
                        <Label htmlFor="priceDisplay">Price Display</Label>
                        <select
                            id="priceDisplay"
                            value={formData.priceDisplay}
                            onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
                            className="flex h-10 w-full rounded-md border border-input bg-card/50 px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
                        >
                            <option value="nightly" className="bg-card">Show Nightly Price</option>
                            <option value="monthly" className="bg-card">Show Monthly Price</option>
                            <option value="none" className="bg-card">Hide Price</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="cleaningFee">Cleaning Fee ($)</Label>
                        <Input
                            id="cleaningFee"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.cleaningFee}
                            onChange={(e) => setFormData({ ...formData, cleaningFee: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label htmlFor="serviceFee">Service Fee ($)</Label>
                        <Input
                            id="serviceFee"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.serviceFee}
                            onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                        />
                    </div>
                </div>
            </section>

            {/* Dynamic Pricing Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2 flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-[#C99A4A]" />
                    Dynamic Pricing Calendar
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Selection Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-2xl shadow-sm p-6 border border-border/50">
                            <h3 className="text-lg font-semibold mb-6">Select Dates</h3>
                            <div className="flex justify-center border border-border rounded-xl p-4 bg-background overflow-x-auto">
                                <Calendar
                                    mode="range"
                                    selected={pricingDate}
                                    onSelect={setPricingDate}
                                    numberOfMonths={1}
                                    className="w-full flex justify-center"
                                />
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="custom-price" className="text-sm font-medium">Custom Nightly Price ($)</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="custom-price"
                                            type="number"
                                            value={pricingPrice}
                                            onChange={(e) => setPricingPrice(e.target.value)}
                                            className="pl-9 h-12 text-lg"
                                            placeholder="e.g. 299"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (!pricingDate?.from) {
                                            toast.error("Please select at least a start date.");
                                            return;
                                        }
                                        if (!pricingPrice || isNaN(Number(pricingPrice))) {
                                            toast.error("Please enter a valid custom price.");
                                            return;
                                        }

                                        const end = pricingDate.to || pricingDate.from;
                                        setPendingPricingRules(prev => [...prev, {
                                            startDate: pricingDate.from as Date,
                                            endDate: end,
                                            price: Number(pricingPrice)
                                        }]);

                                        setPricingDate(undefined);
                                        setPricingPrice("");
                                        toast.success("Pricing rule added to form!");
                                    }}
                                    disabled={!pricingDate?.from || !pricingPrice}
                                    className="w-full h-12 text-md font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all"
                                >
                                    Add Custom Price Rule
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Active Rules Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card rounded-2xl shadow-sm p-6 border border-border/50">
                            <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
                                Form Rules
                                <span className="bg-[#C99A4A]/20 text-[#C99A4A] text-xs px-2 py-1 rounded-full font-bold">
                                    {pendingPricingRules.length}
                                </span>
                            </h3>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {pendingPricingRules.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground bg-accent/30 rounded-lg flex flex-col items-center gap-2">
                                        <CalendarIcon className="w-8 h-8 opacity-50" />
                                        <p className="text-sm">No custom rules added.</p>
                                    </div>
                                ) : (
                                    pendingPricingRules.map((rule, idx) => {
                                        const isSameDay = format(new Date(rule.startDate), 'yyyy-MM-dd') === format(new Date(rule.endDate), 'yyyy-MM-dd');

                                        return (
                                            <div key={idx} className="group relative bg-background border border-border p-4 rounded-xl hover:border-[#C99A4A]/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-bold text-lg text-foreground">
                                                        ${rule.price}<span className="text-xs text-muted-foreground font-normal"> / night</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPendingPricingRules(prev => prev.filter((_, i) => i !== idx));
                                                        }}
                                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="text-sm text-muted-foreground flex flex-col gap-1">
                                                    {isSameDay ? (
                                                        <span className="font-medium text-foreground">{format(new Date(rule.startDate), 'MMM d, yyyy')}</span>
                                                    ) : (
                                                        <div className="flex flex-col">
                                                            <span>From: <span className="font-medium text-foreground">{format(new Date(rule.startDate), 'MMM d, yyyy')}</span></span>
                                                            <span>To: <span className="font-medium text-foreground">{format(new Date(rule.endDate), 'MMM d, yyyy')}</span></span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Content Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Additional Content</h2>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="guestAccess">Guest Access</Label>
                        <Textarea
                            id="guestAccess"
                            value={formData.guestAccess}
                            onChange={(e) => setFormData({ ...formData, guestAccess: e.target.value })}
                            placeholder="How guests can access the space..."
                            rows={3}
                        />
                    </div>
                    <div>
                        <Label htmlFor="neighborhood">Neighborhood</Label>
                        <Textarea
                            id="neighborhood"
                            value={formData.neighborhood}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            placeholder="Describe the surrounding area, local spots..."
                            rows={3}
                        />
                    </div>
                    <div>
                        <Label htmlFor="interaction">Guest Interaction</Label>
                        <Textarea
                            id="interaction"
                            value={formData.interaction}
                            onChange={(e) => setFormData({ ...formData, interaction: e.target.value })}
                            placeholder="How guests can contact you during their stay..."
                            rows={3}
                        />
                    </div>
                    <div>
                        <Label htmlFor="houseRules">House Rules *</Label>
                        <Textarea
                            id="houseRules"
                            placeholder={"No Smoking\nSmoking is not allowed inside the property.\nNo Parties\nLarge gatherings are strictly prohibited.\nQuiet Hours\nQuiet hours are from 10:00 PM to 8:00 AM."}
                            value={formData.houseRules}
                            onChange={(e) => setFormData({ ...formData, houseRules: e.target.value })}
                            rows={5}
                        />
                    </div>
                    <div>
                        <Label htmlFor="gettingAround">Getting Around</Label>
                        <Textarea
                            id="gettingAround"
                            value={formData.gettingAround}
                            onChange={(e) => setFormData({ ...formData, gettingAround: e.target.value })}
                            placeholder="Transportation options, car rentals..."
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="checkIn">Check-in Time</Label>
                            <Input
                                id="checkIn"
                                value={formData.checkIn}
                                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                                placeholder="e.g., 04:00 PM"
                            />
                        </div>
                        <div>
                            <Label htmlFor="checkOut">Check-out Time</Label>
                            <Input
                                id="checkOut"
                                value={formData.checkOut}
                                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                                placeholder="e.g., 11:00 AM"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="notes">Other Important Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Any other details guests should know..."
                            rows={4}
                        />
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(AMENITY_CATEGORIES).map(([category, amenities]) => (
                        <div key={category} className="space-y-3">
                            <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">{category}</h3>
                            <div className="space-y-2">
                                {amenities.map(amenity => (
                                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                        <div
                                            className={cn(
                                                "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                                selectedAmenities.includes(amenity)
                                                    ? "bg-primary border-primary"
                                                    : "border-border group-hover:border-primary bg-background/50"
                                            )}
                                            onClick={() => toggleAmenity(amenity)}
                                        >
                                            {selectedAmenities.includes(amenity) && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                        </div>
                                        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Images Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">Media</h2>
                <div>
                    <Label className="mb-4 block">Images</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer bg-card/30 hover:bg-card/50 transition-all border-border hover:border-primary group"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <p className="mb-2 text-sm text-foreground font-medium">Click to upload images</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, HEIC up to 5MB each</p>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="image/*,.heic,.heif"
                                    onChange={handleFileUpload}
                                    disabled={uploadingImages}
                                />
                            </label>
                            {uploadingImages && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    Uploading images...
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manual-images">Manual Image URLs</Label>
                            <Textarea
                                id="manual-images"
                                value={formData.manualImages}
                                onChange={(e) => setFormData({ ...formData, manualImages: e.target.value })}
                                placeholder="Enter URLs separated by commas or new lines..."
                                className="h-[120px]"
                            />
                        </div>
                    </div>

                    {uploadedImageUrls.length > 0 && (
                        <div className="mt-8">
                            <Label className="mb-4 block">Current Images ({uploadedImageUrls.length})</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                                {uploadedImageUrls.map((url, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="relative group aspect-square rounded-lg overflow-hidden border border-primary/20 bg-card/50">
                                            <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-widest">
                                                {index === 0 ? "Cover" : index + 1}
                                            </div>
                                            <Image
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                quality={90}
                                            />
                                            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity grid grid-cols-2 gap-3 p-4 place-content-center place-items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newUrls = [...uploadedImageUrls];
                                                        newUrls.splice(index, 1);
                                                        newUrls.unshift(url);
                                                        setUploadedImageUrls(newUrls);
                                                        toast.success('Set as Cover Image')
                                                    }}
                                                    className="p-2 bg-amber-500/20 hover:bg-amber-500/40 text-amber-500 rounded-full backdrop-blur-md border border-amber-500/20 transition-all hover:scale-110 cursor-pointer"
                                                    title="Set as Cover Image"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => window.open(url, '_blank')}
                                                    className="p-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-full backdrop-blur-md border border-primary/20 transition-all hover:scale-110 cursor-pointer"
                                                    title="View Full Image"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(url)
                                                        toast.success('URL copied to clipboard')
                                                    }}
                                                    className="p-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-full backdrop-blur-md border border-primary/20 transition-all hover:scale-110 cursor-pointer"
                                                    title="Copy URL"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeUploadedImage(index)}
                                                    className="p-2 bg-destructive/20 hover:bg-destructive text-white rounded-full backdrop-blur-md border border-destructive/20 transition-all hover:scale-110 cursor-pointer"
                                                    title="Remove Image"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] text-foreground/40 font-mono truncate px-1" title={url}>
                                                {url}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Form Actions */}
            <div className="flex items-center gap-6 pt-8 border-t border-border">
                <Button
                    type="submit"
                    disabled={loading || uploadingImages}
                    className="bg-primary hover:opacity-90 text-primary-foreground px-12 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-105 active:scale-95"
                >
                    {loading ? loadingLabel : submitLabel}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}
