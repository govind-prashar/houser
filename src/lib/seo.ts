export const SITE_URL = "https://canderra.us";
export const SITE_NAME = "Canderra";
export const DEFAULT_OG_IMAGE =
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&h=630&auto=format&fit=crop";

export function absoluteUrl(path: string): string {
    if (path.startsWith("http")) return path;
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncateDescription(text: string, maxLength = 160): string {
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (trimmed.length <= maxLength) return trimmed;
    return `${trimmed.slice(0, maxLength - 3).trim()}...`;
}

export function buildPropertyDescription(
    title: string,
    location: string,
    description?: string | null
): string {
    if (description?.trim()) {
        return truncateDescription(description);
    }
    return `Book ${title} with Canderra — a luxury ${location ? `stay in ${location}` : "private residence"}. Reserve your sanctuary today.`;
}
