// hooks/useLenis.ts
'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export const useLenis = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            autoResize: true,
        })

        let animationFrame: number

        const raf = (time: number) => {
            lenis.raf(time)
            animationFrame = requestAnimationFrame(raf)
        }

        animationFrame = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(animationFrame)
            lenis.destroy()
        }
    }, [])
}
