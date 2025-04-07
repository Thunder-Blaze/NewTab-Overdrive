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
import { FaNewspaper, FaRedo, FaExternalLinkAlt } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'

interface NewsArticle {
    title: string
    description: string
    url: string
    source: string
    date: string
}

export function NewsWidget() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchNews = async (forced: boolean = false) => {
        setLoading(true)
        setError(null)

        try {
            // Check cache first
            const cachedData = localStorage.getItem('newsArticles')
            const cachedTimestamp = localStorage.getItem('newsArticlesTimestamp')
            
            const now = new Date().getTime()
            const oneHourMs = 60 * 60 * 1000
            
            if (cachedData && cachedTimestamp && (now - Number(cachedTimestamp)) < oneHourMs && forced === false) {
                setArticles(JSON.parse(cachedData))
                setLoading(false)
                return
            }

            const response = await fetch('/api/fetch-news')

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    'API returned non-JSON response. The API route may not be set up correctly.'
                )
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch news')
            }

            const data = await response.json()
            const newsArticles = data.articles || []
            
            // Cache the results
            localStorage.setItem('newsArticles', JSON.stringify(newsArticles))
            localStorage.setItem('newsArticlesTimestamp', now.toString())
            
            setArticles(newsArticles)
        } catch (err) {
            console.error('News fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch news. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNews()
    }, [])

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Latest News
                </CardTitle>
                <FaNewspaper className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <ClipLoader size={32} color="hsl(var(--primary))" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">
                        <p>{error}</p>
                        <p className="text-sm mt-2">
                            Please check your API key.
                        </p>
                    </div>
                ) : articles && articles.length > 0 ? (
                    <div className="space-y-4">
                        {articles.map((article, index) => (
                            <div key={index} className="border rounded-md p-3">
                                <div className="flex justify-between">
                                    <h3 className="font-medium">
                                        {article.title}
                                    </h3>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 ml-2 flex-shrink-0"
                                    >
                                        <FaExternalLinkAlt className="h-4 w-4" />
                                    </a>
                                </div>
                                {article.description && (
                                    <p className="text-sm mt-1 line-clamp-2">
                                        {article.description}
                                    </p>
                                )}
                                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                    <span>{article.source}</span>
                                    <span>{article.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No news articles available
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => fetchNews(true)}
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
