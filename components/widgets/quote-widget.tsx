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
import { FaQuoteLeft, FaRedo } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'

interface QuoteData {
    quote: string
    author: string
}

interface CachedQuote extends QuoteData {
    timestamp: number
}

const CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

export function QuoteWidget() {
    const [quote, setQuote] = useState<QuoteData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchQuote = async (forced: boolean = false) => {
        setLoading(true)
        setError(null)

        try {
            // Check cache first
            const cachedData = localStorage.getItem('cachedQuote')
            if (cachedData && forced === false) {
                const { quote, author, timestamp }: CachedQuote =
                    JSON.parse(cachedData)
                const now = Date.now()

                if (now - timestamp < CACHE_DURATION) {
                    setQuote({ quote, author })
                    setLoading(false)
                    return
                }
            }

            const response = await fetch('/api/fetch-quotes')

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    'API returned non-JSON response. The API route may not be set up correctly.'
                )
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch quote')
            }

            const data = await response.json()

            // Cache the new quote with timestamp
            const cacheData: CachedQuote = {
                ...data,
                timestamp: Date.now(),
            }
            localStorage.setItem('cachedQuote', JSON.stringify(cacheData))

            setQuote(data)
        } catch (err) {
            console.error('Quote fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch quote. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuote()
    }, [])

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Quote of the Day
                </CardTitle>
                <FaQuoteLeft className="h-4 w-4 text-primary" />
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
                ) : quote ? (
                    <div className="space-y-4">
                        <blockquote className="text-lg italic">
                            &ldquo;{quote.quote}&rdquo;
                        </blockquote>
                        <p className="text-right font-medium">
                            — {quote.author}
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No quote available
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fetchQuote(true)}
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
                    New Quote
                </Button>
            </CardFooter>
        </Card>
    )
}
