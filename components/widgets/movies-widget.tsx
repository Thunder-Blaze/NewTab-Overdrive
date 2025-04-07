'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaFilm, FaSearch, FaExternalLinkAlt } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { ClipLoader } from 'react-spinners'

interface Movie {
    title: string
    year: string
    imdbID: string
    type: string
    poster: string
}

export function MoviesWidget() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [searchPerformed, setSearchPerformed] = useState(false)

    const searchMovies = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setSearchPerformed(true)

        try {
            const response = await fetch(
                `/api/fetch-movies?q=${encodeURIComponent(query)}`
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
                throw new Error(errorData.error || 'Failed to fetch movies')
            }

            const data = await response.json()
            setMovies(data.movies || [])
        } catch (err) {
            console.error('Movies fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch movies. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Movie Search
                </CardTitle>
                <FaFilm className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={searchMovies} className="flex space-x-2 mb-4">
                    <Input
                        placeholder="Search movies..."
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
                ) : movies && movies.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {movies.map((movie, index) => (
                            <div
                                key={index}
                                className="flex border rounded-md overflow-hidden"
                            >
                                {movie.poster ? (
                                    <img
                                        src={movie.poster || '/placeholder.svg'}
                                        alt={movie.title}
                                        className="w-20 h-28 object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-28 bg-muted flex items-center justify-center">
                                        <FaFilm className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="p-3 flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">
                                            {movie.title}
                                        </h3>
                                        <a
                                            href={`https://www.imdb.com/title/${movie.imdbID}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:text-primary/80"
                                        >
                                            <FaExternalLinkAlt className="h-4 w-4" />
                                        </a>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Year: {movie.year}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        Type: {movie.type}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchPerformed ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No movies found for &ldquo;{query}&rdquo;
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Search for movies to see results
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
