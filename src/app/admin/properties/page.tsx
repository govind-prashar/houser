'use client'

import { Plus, Lock } from "lucide-react";
import { DeletePropertyButton } from "@/components/DeletePropertyButton";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";

interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string;
}

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/properties')
            .then(res => res.json())
            .then(data => {
                setProperties(data.properties || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-foreground">Properties</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-card text-foreground border border-border px-5 py-3 rounded-full text-sm font-medium tracking-wide uppercase hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95"
                    >
                        <Lock size={14} />
                        Change Password
                    </button>
                    <a href="/admin/properties/add">
                        <button className="bg-graphite text-ivory px-6 py-3 rounded-full text-sm font-medium tracking-wide uppercase hover:bg-gold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 active:scale-95 hover:shadow-lg">
                            <Plus size={16} />
                            Add Property
                        </button>
                    </a>
                </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-foreground">
                        <thead className="bg-muted/50 border-b border-border text-foreground uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Loading properties...
                                    </td>
                                </tr>
                            ) : properties.map((property) => {
                                let cover = "/placeholder.jpg";
                                try {
                                    const parsed = JSON.parse(property.images);
                                    if (Array.isArray(parsed) && parsed.length > 0) cover = parsed[0];
                                } catch (e) { }

                                return (
                                    <tr key={property.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                                                <Image src={cover} alt={property.title} fill className="object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">{property.title}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{property.location}</td>
                                        <td className="px-6 py-4 text-muted-foreground">${property.price} / night</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                <a href={`/admin/properties/${property.id}/edit`} className="text-muted-foreground hover:text-[#C99A4A] transition-colors font-medium">
                                                    Edit
                                                </a>
                                                <DeletePropertyButton propertyId={property.id} propertyTitle={property.title} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {!loading && properties.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No properties found. Click &quot;Add Property&quot; to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
        </div>
    );
}
