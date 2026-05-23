export const SPRING_TRANSITION = "cubic-bezier(0.22, 1, 0.36, 1)";

export const itemReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

export const containerReveal = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const hoverScale = {
    scale: 1.02,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

export const tapScale = {
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeOut" },
};
