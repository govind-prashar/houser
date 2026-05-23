'use client'

import * as React from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageLightboxProps {
    images: string[]
    initialIndex: number
    isOpen: boolean
    onClose: () => void
}

export function ImageLightbox({ images: rawImages, initialIndex, isOpen, onClose }: ImageLightboxProps) {
    const images = rawImages.filter(img => img && img.trim() !== '')
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

    React.useEffect(() => {
        setCurrentIndex(initialIndex)
    }, [initialIndex, isOpen])

    const handlePrevious = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation()
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return
            if (e.key === "ArrowLeft") handlePrevious()
            if (e.key === "ArrowRight") handleNext()
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, currentIndex, images.length]) // Dependency on currentIndex/length to ensure handles are correct

    if (images.length === 0) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent showCloseButton={false} className="max-w-[100vw] w-full h-full max-h-screen p-0 bg-black border-none shadow-none flex items-center justify-center overflow-hidden sm:max-w-none">
                <DialogTitle className="sr-only">Property Images</DialogTitle>
                <DialogDescription className="sr-only">Full-screen view of property images</DialogDescription>

                {/* Dynamic Blurred Background */}
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
                    <Image
                        src={images[currentIndex]}
                        alt=""
                        fill
                        className="object-cover blur-[100px] opacity-40 scale-125 transition-all duration-700 ease-in-out"
                        priority
                    />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-0 md:p-6">
                    {/* Close Button */}
                    <div className="absolute top-6 right-6 z-50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-primary/20 hover:bg-primary/40 text-primary backdrop-blur-md border border-primary/20 rounded-full w-12 h-12 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                            onClick={onClose}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <div className="absolute left-6 z-50">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-primary/20 hover:bg-primary/40 text-primary backdrop-blur-lg border border-primary/20 rounded-full h-14 w-14 transition-all transform hover:scale-110 active:scale-90 shadow-2xl flex items-center justify-center"
                                    onClick={handlePrevious}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                            </div>
                            <div className="absolute right-6 z-50">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-primary/20 hover:bg-primary/40 text-primary backdrop-blur-lg border border-primary/20 rounded-full h-14 w-14 transition-all transform hover:scale-110 active:scale-90 shadow-2xl flex items-center justify-center"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Image Container */}
                    <div className="relative w-full h-full max-h-[80vh] md:max-h-[85vh] flex items-center justify-center select-none">
                        <div className="relative w-full h-full transition-all duration-300 ease-in-out">
                            <Image
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt={`Image ${currentIndex + 1}`}
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-opacity duration-500"
                                priority
                            />
                        </div>
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
                        <div className="bg-card/40 backdrop-blur-md border border-primary/20 text-foreground px-6 py-2 rounded-full text-sm font-semibold tracking-wider shadow-xl flex items-center gap-2">
                            <span className="text-foreground/60">Image</span>
                            <span className="text-primary">{currentIndex + 1}</span>
                            <span className="text-foreground/20">/</span>
                            <span className="text-foreground/70">{images.length}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
