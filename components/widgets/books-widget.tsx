'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaBook, FaSearch } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { ClipLoader } from 'react-spinners'

interface Book {
    title: string
    author: string
    year?: number
    editions: number
    cover?: string
}

export function BooksWidget() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [searchPerformed, setSearchPerformed] = useState(false)

    const searchBooks = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setSearchPerformed(true)

        try {
            const response = await fetch(
                `/api/fetch-books?q=${encodeURIComponent(query)}`
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
                throw new Error(errorData.error || 'Failed to fetch books')
            }

            const data = await response.json()
            setBooks(data.books || [])
        } catch (err) {
            console.error('Books fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch books. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Book Search
                </CardTitle>
                <FaBook className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={searchBooks} className="flex space-x-2 mb-4">
                    <Input
                        placeholder="Search books..."
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
                ) : books && books.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {books.map((book, index) => (
                            <div
                                key={index}
                                className="flex border rounded-md overflow-hidden"
                            >
                                {book.cover ? (
                                    <img
                                        src={book.cover || '/placeholder.svg'}
                                        alt={book.title}
                                        className="w-20 h-28 object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-28 bg-muted flex items-center justify-center">
                                        <FaBook className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="p-3 flex-1">
                                    <h3 className="font-medium">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        by {book.author}
                                    </p>
                                    {book.year && (
                                        <p className="text-xs text-muted-foreground">
                                            Published: {book.year}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {book.editions} editions
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchPerformed ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No books found for &ldquo;{query}&rdquo;
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Search for books to see results
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
