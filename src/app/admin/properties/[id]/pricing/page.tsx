'use client';

import React, { useState, useEffect, use } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/ui/BackButton";
import { DateRange } from "react-day-picker";
import { createPricingRule, deletePricingRule, getPricingRules } from "@/app/actions/pricing";
import { toast } from "sonner";
import { Trash2, Calendar as CalendarIcon, DollarSign } from "lucide-react";

interface PricingRule {
    id: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    price: number;
}

export default function AdminPricingPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const propertyId = resolvedParams.id;
    const [date, setDate] = useState<DateRange | undefined>();
    const [price, setPrice] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [rules, setRules] = useState<PricingRule[]>([]);

    const fetchRules = async () => {
        const res = await getPricingRules(propertyId);
        if (res.data) {
            setRules(res.data);
        }
    };

    useEffect(() => {
        fetchRules();
    }, [propertyId]);

    const handleCreateRule = async () => {
        if (!date?.from) {
            toast.error("Please select at least a start date.");
            return;
        }
        if (!price || isNaN(Number(price))) {
            toast.error("Please enter a valid price.");
            return;
        }

        setLoading(true);
        // If single day, to is same as from
        const endDate = date.to || date.from;

        const res = await createPricingRule(propertyId, date.from, endDate, Number(price));

        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Pricing rule created successfully.");
            setDate(undefined);
            setPrice("");
            fetchRules();
        }
        setLoading(false);
    };

    const handleDelete = async (ruleId: string) => {
        const res = await deletePricingRule(ruleId, propertyId);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Rule deleted.");
            fetchRules();
        }
    };

    return (
        <div className="container mx-auto px-4 pb-16 max-w-5xl pt-8">
            <div className="mb-8">
                <BackButton label="Back to Edit Property" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-[#C99A4A]" />
                        Dynamic Pricing Calendar
                    </h1>
                    <p className="text-muted-foreground mt-2">Override base prices for specific dates or ranges.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Selection Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50">
                        <h2 className="text-xl font-semibold mb-6">Select Dates</h2>
                        <div className="flex justify-center border border-border rounded-xl p-4 bg-background">
                            <Calendar
                                mode="range"
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                                className="w-full flex justify-center"
                                classNames={{
                                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-8 sm:space-y-0",
                                }}
                            />
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price" className="text-sm font-medium">Custom Nightly Price ($)</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="pl-9 h-12 text-lg"
                                        placeholder="e.g. 299"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleCreateRule}
                                disabled={loading || !date?.from || !price}
                                className="w-full h-12 text-md font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all"
                            >
                                {loading ? "Saving..." : "Set Custom Price for Selected Dates"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Active Rules Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-2xl shadow-xl p-6 border border-border/50">
                        <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
                            Active Rules
                            <span className="bg-[#C99A4A]/20 text-[#C99A4A] text-xs px-2 py-1 rounded-full font-bold">
                                {rules.length}
                            </span>
                        </h2>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {rules.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground bg-accent/30 rounded-lg flex flex-col items-center gap-2">
                                    <CalendarIcon className="w-8 h-8 opacity-50" />
                                    <p className="text-sm">No custom pricing rules applied.</p>
                                </div>
                            ) : (
                                rules.map((rule) => {
                                    const isSameDay = format(new Date(rule.startDate), 'yyyy-MM-dd') === format(new Date(rule.endDate), 'yyyy-MM-dd');

                                    return (
                                        <div key={rule.id} className="group relative bg-background border border-border p-4 rounded-xl hover:border-[#C99A4A]/50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-bold text-lg text-foreground">
                                                    ${rule.price}<span className="text-xs text-muted-foreground font-normal"> / night</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(rule.id)}
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
        </div>
    );
}
