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
import { FaImage, FaRedo } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'
import Image from 'next/image'

interface MemeData {
    postLink: string
    imgUrl: string
}

interface CachedMeme extends MemeData {
    timestamp: number
}

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export function MemeWidget() {
    const [meme, setMeme] = useState<MemeData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchMeme = async (forced: boolean = false) => {
        setLoading(true)
        setError(null)

        try {
            // Check cache first
            const cachedData = localStorage.getItem('cachedMeme')
            if (cachedData && forced === false) {
                const { postLink, imgUrl, timestamp }: CachedMeme =
                    JSON.parse(cachedData)
                const now = Date.now()

                if (now - timestamp < CACHE_DURATION) {
                    setMeme({ postLink, imgUrl })
                    setLoading(false)
                    return
                }
            }

            const response = await fetch('/api/fetch-memes')

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    'API returned non-JSON response. The API route may not be set up correctly.'
                )
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch meme')
            }

            const data = await response.json()

            // Cache the new meme with timestamp
            const cacheData: CachedMeme = {
                ...data,
                timestamp: Date.now(),
            }
            localStorage.setItem('cachedMeme', JSON.stringify(cacheData))

            setMeme(data)
        } catch (err) {
            console.error('Meme fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch meme. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMeme()
    }, [])

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Random Meme
                </CardTitle>
                <FaImage className="h-4 w-4 text-primary" />
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
                ) : meme ? (
                    <div className="space-y-4">
                        <a
                            href={meme.postLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center"
                        >
                            <Image
                                src={meme.imgUrl}
                                alt="Meme"
                                width={320}
                                height={320}
                                className="rounded-xl"
                            />
                        </a>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No meme available
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fetchMeme(true)}
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
                    New Meme
                </Button>
            </CardFooter>
        </Card>
    )
}
