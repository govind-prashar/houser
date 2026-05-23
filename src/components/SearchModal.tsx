'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export interface SearchState {
    location: string
    startDate: string
    endDate: string
    guests: string
}

export interface SearchActions {
    setLocation: (value: string) => void
    setStartDate: (value: string) => void
    setEndDate: (value: string) => void
    setGuests: (value: string) => void
}

interface SearchExpandedProps {
    activeTab: "location" | "dates" | "guests"
    onTabChange: (tab: "location" | "dates" | "guests") => void
    searchState: SearchState
    searchActions: SearchActions
    onSearch: () => void
    onClose: () => void
}

export function SearchExpanded({
    activeTab,
    onTabChange,
    searchState,
    searchActions,
    onSearch,
    onClose
}: SearchExpandedProps) {
    const router = useRouter()

    return (
        <div className="w-[850px] bg-card/90 backdrop-blur-3xl rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-primary/20 mt-4">
            <div className="flex flex-row h-[72px]">
                {/* Location Tab */}
                <div
                    className={`flex-1 px-8 flex flex-col justify-center cursor-pointer transition-all border-r border-primary/10 hover:bg-primary/5 relative ${activeTab === 'location' ? 'bg-card/50 shadow-xl z-10 rounded-[32px]' : ''}`}
                    onClick={() => onTabChange("location")}
                >
                    <Label htmlFor="location" className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 block">Where</Label>
                    {activeTab === 'location' ? (
                        <Input
                            id="location"
                            placeholder="Search destinations"
                            className="border-none shadow-none text-sm font-medium p-0 h-5 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent text-foreground"
                            value={searchState.location}
                            onChange={(e) => searchActions.setLocation(e.target.value)}
                            autoFocus
                        />
                    ) : (
                        <div className="text-sm font-medium text-foreground truncate h-5 flex items-center">
                            {searchState.location || "Search destinations"}
                        </div>
                    )}
                </div>

                {/* Dates Tab */}
                <div
                    className={`flex-[1.5] flex flex-row relative ${activeTab === 'dates' ? 'bg-card/50 shadow-xl z-10 rounded-[32px]' : 'hover:bg-primary/5'}`}
                    onClick={() => onTabChange("dates")}
                >
                    <div className="flex-1 border-r border-primary/10 px-6 flex flex-col justify-center cursor-pointer">
                        <Label className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 block">Check-in</Label>
                        {activeTab === 'dates' ? (
                            <Input
                                type="date"
                                className="border-none shadow-none p-0 h-5 focus-visible:ring-0 text-foreground font-medium text-sm bg-transparent"
                                value={searchState.startDate}
                                onChange={(e) => searchActions.setStartDate(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <div className="text-sm font-medium text-muted-foreground h-5 flex items-center">
                                {searchState.startDate || "Add dates"}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 px-6 flex flex-col justify-center cursor-pointer">
                        <Label className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 block">Check-out</Label>
                        {activeTab === 'dates' ? (
                            <Input
                                type="date"
                                className="border-none shadow-none p-0 h-5 focus-visible:ring-0 text-foreground font-medium text-sm bg-transparent"
                                value={searchState.endDate}
                                onChange={(e) => searchActions.setEndDate(e.target.value)}
                            />
                        ) : (
                            <div className="text-sm font-medium text-muted-foreground h-5 flex items-center">
                                {searchState.endDate || "Add dates"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Guests Tab */}
                <div
                    className={`flex-1 pl-8 pr-2 flex flex-row items-center justify-between cursor-pointer transition-all hover:bg-primary/5 relative ${activeTab === 'guests' ? 'bg-card/50 shadow-xl z-10 rounded-[32px]' : ''}`}
                    onClick={() => onTabChange("guests")}
                >
                    <div className="flex flex-col justify-center h-full">
                        <Label htmlFor="guests" className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 block">Who</Label>
                        {activeTab === 'guests' ? (
                            <Input
                                id="guests"
                                type="number"
                                min="1"
                                placeholder="Add guests"
                                className="border-none shadow-none p-0 h-5 focus-visible:ring-0 text-sm font-medium w-full text-foreground bg-transparent"
                                value={searchState.guests}
                                onChange={(e) => searchActions.setGuests(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <div className="text-sm font-medium text-foreground h-5 flex items-center">
                                {searchState.guests ? `${searchState.guests} Guest${parseInt(searchState.guests) > 1 ? 's' : ''}` : "Add guests"}
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={(e) => {
                            e.stopPropagation()
                            onSearch()
                        }}
                        size="icon"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 w-12 shadow-lg transition-all shrink-0 ml-4"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
