'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FaClock } from 'react-icons/fa'

export function Clock() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 px-6 border-b border-primary/10">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <FaClock className="h-4 w-4 text-primary" />
                    Clock
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div
                        className="text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                        suppressHydrationWarning
                    >
                        {formatTime(time)}
                    </div>
                    <div className="text-lg text-muted-foreground font-medium">
                        {formatDate(time)}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
