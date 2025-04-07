'use client'
import Dashboard from '@/components/dashboard'
import { useEffect, useState } from 'react'
// import Lenis from 'lenis'

export default function Home() {
    const [wallpaper, setWallpaper] = useState<string | null>(null)

    // Load wallpaper from localStorage on mount
    useEffect(() => {
        const savedWallpaper = localStorage.getItem('wallpaper')
        if (savedWallpaper) {
            setWallpaper(savedWallpaper)
        }
    }, [])

    // Save wallpaper to localStorage when it changes
    useEffect(() => {
        if (wallpaper) {
            localStorage.setItem('wallpaper', wallpaper)
        }
    }, [wallpaper])

    // useEffect(() => {
    //     const lenis = new Lenis();
    //     function raf(time: number) {
    //         lenis.raf(time)
    //         requestAnimationFrame(raf)
    //     }
    //     requestAnimationFrame(raf)
    // }, [])

    return (
        <div
            className="h-full w-full bg-cover bg-center transition-all duration-300"
            style={
                wallpaper
                    ? {
                          backgroundImage: `url(${wallpaper})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                      }
                    : {}
            }
        >
            <Dashboard setWallpaper={setWallpaper} />
        </div>
    )
}
