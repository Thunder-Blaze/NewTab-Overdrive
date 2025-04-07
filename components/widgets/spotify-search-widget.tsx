'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaMusic, FaSearch, FaPlay } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { ClipLoader } from 'react-spinners'

interface Track {
    id: string
    name: string
    artists: string
    cover: string
    album: string
    url: string
}

export function SpotifySearchWidget() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [searchPerformed, setSearchPerformed] = useState(false)

    const searchSpotify = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setSearchPerformed(true)

        try {
            const response = await fetch(
                `/api/search-spotify?q=${encodeURIComponent(query)}`
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
                throw new Error(errorData.error || 'Failed to search Spotify')
            }

            const data = await response.json()
            setTracks(data.simplifiedTracks || [])
        } catch (err) {
            console.error('Spotify search error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to search Spotify. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Spotify Search
                </CardTitle>
                <FaMusic className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={searchSpotify} className="flex space-x-2 mb-4">
                    <Input
                        placeholder="Search for music..."
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
                    </div>
                ) : tracks && tracks.length > 0 ? (
                    <div className="space-y-4">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                className="border rounded-md p-3 flex items-center space-x-4"
                            >
                                <img
                                    src={track.cover}
                                    alt={`${track.name} album cover`}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium">
                                            {track.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {track.artists}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Album: {track.album}
                                    </p>
                                </div>
                                <a
                                    href={track.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 ml-2 flex-shrink-0 p-3 rounded-full hover:bg-primary/10 transition-colors"
                                >
                                    <FaPlay className="h-4 w-4" />
                                </a>
                            </div>
                        ))}
                    </div>
                ) : searchPerformed ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No tracks found for &ldquo;{query}&rdquo;
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Search for music to see results
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
