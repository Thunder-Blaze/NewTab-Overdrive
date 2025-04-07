'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaUtensils, FaSearch } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { ClipLoader } from 'react-spinners'

interface Recipe {
    id: number
    title: string
    image: string
}

interface RecipesResponse {
    total: number
    recipes: Recipe[]
}

export function RecipesWidget() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState('')
    const [searchPerformed, setSearchPerformed] = useState(false)

    const searchRecipes = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setSearchPerformed(true)

        try {
            const response = await fetch(
                `/api/fetch-recipes?query=${encodeURIComponent(query)}`
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
                throw new Error(errorData.error || 'Failed to fetch recipes')
            }

            const data: RecipesResponse = await response.json()
            setRecipes(data.recipes || [])
        } catch (err) {
            console.error('Recipes fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch recipes. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    Recipe Search
                </CardTitle>
                <FaUtensils className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={searchRecipes} className="flex space-x-2 mb-4">
                    <Input
                        placeholder="Search recipes..."
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
                ) : recipes && recipes.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="border rounded-md overflow-hidden"
                            >
                                {recipe.image && (
                                    <img
                                        src={recipe.image || '/placeholder.svg'}
                                        alt={recipe.title}
                                        className="w-full h-32 object-cover"
                                    />
                                )}
                                <div className="p-3">
                                    <h3 className="font-medium">
                                        {recipe.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchPerformed ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No recipes found for &ldquo;{query}&rdquo;
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Search for recipes to see results
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
