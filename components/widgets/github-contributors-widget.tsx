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
import { FaGithub, FaRedo, FaExternalLinkAlt } from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ClipLoader } from 'react-spinners'

interface Contributor {
    username: string
    avatar: string
    profile: string
    contributions: number
}

export function GithubContributorsWidget() {
    const [contributors, setContributors] = useState<Contributor[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchContributors = async (forced: boolean = false) => {
        setLoading(true)
        setError(null)

        try {
            // Check cache first
            const cachedData = localStorage.getItem('ghContributors')
            const cachedTimestamp = localStorage.getItem('ghContributorsTimestamp')
            
            const now = new Date().getTime()
            const oneDayMs = 24 * 60 * 60 * 1000
            
            if (cachedData && cachedTimestamp && (now - Number(cachedTimestamp)) < oneDayMs && forced === false) {
                setContributors(JSON.parse(cachedData))
                setLoading(false)
                return
            }

            const response = await fetch('/api/fetch-contributors')

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    'API returned non-JSON response. The API route may not be set up correctly.'
                )
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(
                    errorData.error || 'Failed to fetch contributors'
                )
            }

            const data = await response.json()
            const contributors = data.contributors || []
            
            // Cache the data
            localStorage.setItem('ghContributors', JSON.stringify(contributors))
            localStorage.setItem('ghContributorsTimestamp', String(now))
            
            setContributors(contributors)
        } catch (err) {
            console.error('GitHub contributors fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch contributors. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContributors()
    }, [])

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    GitHub Contributors
                </CardTitle>
                <FaGithub className="h-4 w-4 text-primary" />
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
                ) : contributors && contributors.length > 0 ? (
                    <div className="space-y-4">
                        {contributors.map((contributor) => (
                            <div
                                key={contributor.username}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage
                                            src={contributor.avatar}
                                            alt={contributor.username}
                                        />
                                        <AvatarFallback>
                                            {contributor.username
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {contributor.username}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {contributor.contributions}{' '}
                                            contributions
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={contributor.profile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80"
                                >
                                    <FaExternalLinkAlt className="h-4 w-4" />
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No contributors found
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fetchContributors(true)}
                    disabled={loading}
                >
                    {loading ? (
                        <ClipLoader size={16} color="hsl(var(--primary))" className="mr-2" />
                    ) : (
                        <FaRedo className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                </Button>
            </CardFooter>
        </Card>
    )
}
