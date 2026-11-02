import { useReducedMotion } from 'motion/react'

export function useTaskMotion() {
    const reducedMotion = useReducedMotion()

    return {
        layout: !reducedMotion,
        initial: reducedMotion ? false : { opacity: 0, y: 8, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: reducedMotion ? 0 : -6, scale: reducedMotion ? 1 : 0.98 },
        transition: {
            duration: reducedMotion ? 0 : 0.2,
            layout: { duration: reducedMotion ? 0 : 0.25 },
        },
    }
}
