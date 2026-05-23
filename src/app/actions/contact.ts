'use server';

import { sendContactInquiryEmail } from "@/lib/mail";

export async function submitContactInquiry(formData: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}) {
    try {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
            return { error: "Please fill in all required fields." };
        }

        const result = await sendContactInquiryEmail(formData);

        if (result.success) {
            return { success: true };
        } else {
            return { error: "Failed to send inquiry. Please try again later." };
        }
    } catch (error) {
        console.error("Error submitting contact inquiry:", error);
        return { error: "An unexpected error occurred." };
    }
}
