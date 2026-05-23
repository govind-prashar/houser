import Image, { ImageProps } from "next/image";

type OptimizedImageProps = Omit<ImageProps, "quality"> & {
    quality?: number;
    priority?: boolean;
};

/** Consistent Next/Image defaults for performance (WebP/AVIF via next.config). */
export function OptimizedImage({
    quality = 90,
    sizes,
    className,
    ...props
}: OptimizedImageProps) {
    return (
        <Image
            quality={quality}
            sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            className={className}
            {...props}
        />
    );
}
