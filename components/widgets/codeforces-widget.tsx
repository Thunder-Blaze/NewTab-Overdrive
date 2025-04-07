'use client'

import { useState, useEffect } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaCode, FaRedo, FaCalendar } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { ClipLoader } from 'react-spinners'

interface Contest {
    id: number
    name: string
    type: string
    phase: string
    duration: string
    startsAt?: string
}

export function CodeforcesWidget() {
    const [contests, setContests] = useState<Contest[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchContests = async (forced: boolean = false) => {
        setLoading(true)
        setError(null)

        try {
            // Check cache first
            const cachedData = localStorage.getItem('cfContests')
            const cachedTimestamp = localStorage.getItem('cfContestsTimestamp')

            const now = new Date().getTime()
            const oneDayMs = 24 * 60 * 60 * 1000

            if (
                cachedData &&
                cachedTimestamp &&
                now - Number(cachedTimestamp) < oneDayMs &&
                forced === false
            ) {
                setContests(JSON.parse(cachedData))
                setLoading(false)
                return
            }

            const response = await fetch('/api/fetch-cf-contests')

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    'API returned non-JSON response. The API route may not be set up correctly.'
                )
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch contests')
            }

            const data = await response.json()
            const contests = data.simplifiedContests || []

            // Cache the new data
            localStorage.setItem('cfContests', JSON.stringify(contests))
            localStorage.setItem('cfContestsTimestamp', now.toString())

            setContests(contests)
        } catch (err) {
            console.error('Codeforces fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch contests. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContests()
    }, [])

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Upcoming Codeforces Contests
                </CardTitle>
                <FaCode className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <ClipLoader size={32} color="hsl(var(--primary))" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">
                        <p>{error}</p>
                    </div>
                ) : contests && contests.length > 0 ? (
                    <div className="space-y-4">
                        {contests.map((contest) => (
                            <div
                                key={contest.id}
                                className="border rounded-md p-3"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium">
                                        {contest.name}
                                    </h3>
                                    <Badge variant="outline">
                                        {contest.type}
                                    </Badge>
                                </div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <FaCalendar className="h-3 w-3" />
                                        <span>{contest.startsAt}</span>
                                    </div>
                                    <p>Duration: {contest.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No upcoming contests
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fetchContests(true)}
                    disabled={loading}
                >
                    {loading ? (
                        <ClipLoader
                            size={16}
                            color="hsl(var(--primary))"
                            className="mr-2"
                        />
                    ) : (
                        <FaRedo className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                </Button>
            </CardFooter>
        </Card>
    )
}
