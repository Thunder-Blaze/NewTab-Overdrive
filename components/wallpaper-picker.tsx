'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { FaImage, FaPlus, FaTrash } from 'react-icons/fa'
import { Input } from '@/components/ui/input'

interface WallpaperPickerProps {
    onSelectWallpaper: (wallpaper: string) => void
}

export function WallpaperPicker({ onSelectWallpaper }: WallpaperPickerProps) {
    const [open, setOpen] = useState(false)
    const [wallpapers, setWallpapers] = useState<string[]>([
        'https://images8.alphacoders.com/790/790044.png',
        'https://w.wallhaven.cc/full/ym/wallhaven-ym1m8l.jpg',
    ])
    const [newWallpaper, setNewWallpaper] = useState('')

    // Load wallpapers from localStorage on mount
    useEffect(() => {
        const savedWallpapers = localStorage.getItem('wallpapers')
        if (savedWallpapers) {
            setWallpapers(JSON.parse(savedWallpapers))
        }
    }, [])

    // Save wallpapers to localStorage when they change
    useEffect(() => {
        localStorage.setItem('wallpapers', JSON.stringify(wallpapers))
    }, [wallpapers])

    const handleSelect = (wallpaper: string) => {
        onSelectWallpaper(wallpaper)
        setOpen(false)
    }

    const handleReset = () => {
        onSelectWallpaper('')
        localStorage.removeItem('wallpaper')
        setOpen(false)
    }

    const handleAddWallpaper = () => {
        if (newWallpaper.trim()) {
            setWallpapers([...wallpapers, newWallpaper.trim()])
            setNewWallpaper('')
        }
    }

    const handleRemoveWallpaper = (index: number) => {
        const newWallpapers = [...wallpapers]
        newWallpapers.splice(index, 1)
        setWallpapers(newWallpapers)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Change wallpaper"
                >
                    <FaImage className="h-4 w-4 text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Choose Wallpaper</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {wallpapers.map((wallpaper, index) => (
                        <div
                            key={index}
                            className="relative aspect-video cursor-pointer rounded-md overflow-hidden border-2 hover:border-primary transition-all group"
                        >
                            <img
                                src={wallpaper}
                                alt={`Wallpaper ${index + 1}`}
                                className="w-full h-full object-cover"
                                onClick={() => handleSelect(wallpaper)}
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveWallpaper(index)}
                            >
                                <FaTrash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Enter wallpaper URL"
                        value={newWallpaper}
                        onChange={(e) => setNewWallpaper(e.target.value)}
                    />
                    <Button onClick={handleAddWallpaper} size="icon">
                        <FaPlus className="h-4 w-4" />
                    </Button>
                </div>
                <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                >
                    Reset to Default
                </Button>
            </DialogContent>
        </Dialog>
    )
}
