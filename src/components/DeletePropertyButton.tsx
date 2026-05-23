'use client'

import { Trash2 } from "lucide-react";
import { deleteProperty } from "@/app/actions/property";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeletePropertyButton({ propertyId, propertyTitle }: { propertyId: string; propertyTitle?: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a Link
        e.stopPropagation(); // Stop event bubbling

        if (!confirm("Are you sure you want to delete this property?")) {
            return;
        }

        setIsDeleting(true);
        const res = await deleteProperty(propertyId);
        setIsDeleting(false);

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Property deleted successfully");
            router.refresh(); // Refresh to update list
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-white/80 hover:bg-red-100 rounded-full transition-colors text-red-600 disabled:opacity-50 cursor-pointer"
            title="Delete Property"
        >
            <Trash2 size={18} />
        </button>
    );
}
