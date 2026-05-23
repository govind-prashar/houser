'use client';

import { useState } from 'react';
import { submitContactInquiry } from '@/app/actions/contact';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'booking',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await submitContactInquiry(formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Your inquiry has been sent successfully!");
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: 'booking',
                    message: ''
                });
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card p-8 md:p-12 shadow-sm border border-border/20">
            <h3 className="font-serif text-2xl mb-8 text-foreground">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-muted-foreground">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-border/40 pb-3 pt-2 text-sm text-foreground focus:outline-none focus:border-[#C99A4A] transition-colors placeholder:text-muted-foreground/60"
                            placeholder="Jane"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-muted-foreground">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-border/40 pb-3 pt-2 text-sm text-foreground focus:outline-none focus:border-[#C99A4A] transition-colors placeholder:text-muted-foreground/60"
                            placeholder="Doe"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent border-b border-border/40 pb-3 pt-2 text-sm text-foreground focus:outline-none focus:border-[#C99A4A] transition-colors placeholder:text-muted-foreground/60"
                        placeholder="jane.doe@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs uppercase tracking-widest text-muted-foreground">Subject</label>
                    <select
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-border/40 pb-3 pt-2 text-sm text-foreground focus:outline-none focus:border-[#C99A4A] transition-colors appearance-none rounded-none"
                    >
                        <option value="booking">Reservation Inquiry</option>
                        <option value="support">Guest Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="space-y-2 pb-6">
                    <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                    <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full bg-transparent border-b border-border/40 pb-3 pt-2 text-sm text-foreground focus:outline-none focus:border-[#C99A4A] transition-colors placeholder:text-muted-foreground/60 resize-none"
                        placeholder="How can we assist you?"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-foreground text-background hover:bg-[#C99A4A] hover:text-white transition-colors duration-300 py-4 text-xs tracking-widest uppercase font-medium border border-transparent hover:border-[#C99A4A] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Sending..." : "Submit Inquiry"}
                </button>
            </form>
        </div>
    );
}
