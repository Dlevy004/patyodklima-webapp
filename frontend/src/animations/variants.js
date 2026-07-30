export const fadeInContainer = (stagger = 0.2, delayChildren = 0.3) => ({
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: stagger, delayChildren }
    }
});

export const fadeInUp = (duration = 0.6) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration, ease: 'easeOut' }
    }
});

export const fadeInLeft = (duration = 0.5) => ({
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration, ease: 'easeOut' }
    }
});