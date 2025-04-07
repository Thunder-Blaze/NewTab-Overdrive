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
import { FaPalette } from 'react-icons/fa'

const accentColors = [
    { name: 'Purple', value: '263.4 70% 50.4%' },
    { name: 'Blue', value: '210 100% 50%' },
    { name: 'Green', value: '142 76% 36%' },
    { name: 'Red', value: '0 84% 60%' },
    { name: 'Orange', value: '24 95% 53%' },
    { name: 'Yellow', value: '45 93% 47%' },
    { name: 'Pink', value: '330 81% 60%' },
    { name: 'Teal', value: '173 80% 40%' },
]

export function AccentColorPicker() {
    const [open, setOpen] = useState(false)
    const [selectedColor, setSelectedColor] = useState(accentColors[0].value)

    useEffect(() => {
        const savedColor = localStorage.getItem('accent-color')
        if (savedColor) {
            setSelectedColor(savedColor)
            document.documentElement.style.setProperty('--primary', savedColor)
            document.documentElement.style.setProperty('--ring', savedColor)
        }
    }, [])

    const handleSelectColor = (color: string) => {
        setSelectedColor(color)
        document.documentElement.style.setProperty('--primary', color)
        document.documentElement.style.setProperty('--ring', color)
        localStorage.setItem('accent-color', color)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Change accent color"
                >
                    <FaPalette className="h-4 w-4 text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Choose Accent Color</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    {accentColors.map((color) => (
                        <div
                            key={color.name}
                            className="flex flex-col items-center gap-2"
                        >
                            <button
                                className="h-12 w-12 rounded-full border-2 transition-all hover:scale-110"
                                style={{
                                    backgroundColor: `hsl(${color.value})`,
                                    borderColor:
                                        selectedColor === color.value
                                            ? 'hsl(var(--primary))'
                                            : 'transparent',
                                }}
                                onClick={() => handleSelectColor(color.value)}
                                aria-label={`Select ${color.name} color`}
                            />
                            <span className="text-sm">{color.name}</span>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
