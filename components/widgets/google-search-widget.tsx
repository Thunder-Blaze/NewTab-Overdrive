'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { ClipLoader } from 'react-spinners'

interface SearchResult {
    title: string
    link: string
    snippet: string
}

export function GoogleSearchWidget() {
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [searchPerformed, setSearchPerformed] = useState(false)

    const performSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setSearchPerformed(true)

        try {
            const response = await fetch(
                `/api/search-google?q=${encodeURIComponent(query)}`
            )

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    'API returned non-JSON response. The API route may not be set up correctly.'
                )
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to perform search')
            }

            const data = await response.json()
            setResults(data.results || [])
        } catch (err) {
            console.error('Google search error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to perform search. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Google Search
                </CardTitle>
                <FaSearch className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={performSearch} className="flex space-x-2 mb-4">
                    <Input
                        placeholder="Search the web..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                        {loading ? (
                            <ClipLoader size={16} color="hsl(var(--primary))" />
                        ) : (
                            <FaSearch className="h-4 w-4" />
                        )}
                    </Button>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <ClipLoader size={32} color="hsl(var(--primary))" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">
                        <p>{error}</p>
                        <p className="text-sm mt-2">
                            Please check your API key or try another search.
                        </p>
                    </div>
                ) : results && results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <div key={index} className="border rounded-md p-3">
                                <div className="flex justify-between">
                                    <h3 className="font-medium">
                                        {result.title}
                                    </h3>
                                    <a
                                        href={result.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 ml-2 flex-shrink-0"
                                    >
                                        <FaExternalLinkAlt className="h-4 w-4" />
                                    </a>
                                </div>
                                <p className="text-sm mt-1">{result.snippet}</p>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {result.link}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : searchPerformed ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No results found for &ldquo;{query}&rdquo;
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Search for something to see results
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
