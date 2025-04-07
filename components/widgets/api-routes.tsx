'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { FaServer, FaRedo } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

// This is a placeholder for the API routes
// Replace with your actual API routes and types
interface ApiRoute {
    path: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    description: string
    responseType: string
}

const mockApiRoutes: ApiRoute[] = [
    {
        path: '/api/users',
        method: 'GET',
        description: 'Get all users',
        responseType: 'User[]',
    },
    {
        path: '/api/users/:id',
        method: 'GET',
        description: 'Get user by ID',
        responseType: 'User',
    },
    {
        path: '/api/posts',
        method: 'GET',
        description: 'Get all posts',
        responseType: 'Post[]',
    },
    {
        path: '/api/posts/:id',
        method: 'GET',
        description: 'Get post by ID',
        responseType: 'Post',
    },
    {
        path: '/api/posts',
        method: 'POST',
        description: 'Create a new post',
        responseType: 'Post',
    },
]

// Mock response data
const mockResponses = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ],
    posts: [
        {
            id: 1,
            title: 'First Post',
            content: 'This is the first post',
            authorId: 1,
        },
        {
            id: 2,
            title: 'Second Post',
            content: 'This is the second post',
            authorId: 2,
        },
    ],
}

export function ApiRoutes() {
    const [selectedRoute, setSelectedRoute] = useState<ApiRoute | null>(null)
    const [response, setResponse] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const fetchMockData = () => {
        if (!selectedRoute) return

        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            if (selectedRoute.path.includes('users')) {
                if (selectedRoute.path.includes(':id')) {
                    setResponse(mockResponses.users[0])
                } else {
                    setResponse(mockResponses.users)
                }
            } else if (selectedRoute.path.includes('posts')) {
                if (selectedRoute.path.includes(':id')) {
                    setResponse(mockResponses.posts[0])
                } else if (selectedRoute.method === 'POST') {
                    setResponse({
                        id: 3,
                        title: 'New Post',
                        content: 'This is a new post',
                        authorId: 1,
                    })
                } else {
                    setResponse(mockResponses.posts)
                }
            }

            setLoading(false)
        }, 800)
    }

    useEffect(() => {
        if (selectedRoute) {
            fetchMockData()
        }
    }, [selectedRoute])

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET':
                return 'bg-green-500'
            case 'POST':
                return 'bg-blue-500'
            case 'PUT':
                return 'bg-yellow-500'
            case 'DELETE':
                return 'bg-red-500'
            default:
                return 'bg-gray-500'
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">
                    API Routes
                </CardTitle>
                <FaServer className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <Tabs defaultValue="routes" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                        <TabsTrigger value="routes">Routes</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                    </TabsList>

                    <TabsContent value="routes" className="space-y-4">
                        <div className="space-y-2">
                            {mockApiRoutes.map((route, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-md border cursor-pointer transition-all hover:border-primary ${
                                        selectedRoute === route
                                            ? 'border-primary bg-primary/5'
                                            : ''
                                    }`}
                                    onClick={() => setSelectedRoute(route)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                className={`${getMethodColor(route.method)} text-white`}
                                            >
                                                {route.method}
                                            </Badge>
                                            <span className="font-mono text-sm">
                                                {route.path}
                                            </span>
                                        </div>
                                        <Badge variant="outline">
                                            {route.responseType}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {route.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="response">
                        <div className="space-y-4">
                            {selectedRoute ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                className={`${getMethodColor(selectedRoute.method)} text-white`}
                                            >
                                                {selectedRoute.method}
                                            </Badge>
                                            <span className="font-mono text-sm">
                                                {selectedRoute.path}
                                            </span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={fetchMockData}
                                            disabled={loading}
                                        >
                                            <FaRedo
                                                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                                            />
                                            Refresh
                                        </Button>
                                    </div>

                                    <div className="p-4 bg-muted rounded-md">
                                        <pre className="text-sm font-mono whitespace-pre-wrap">
                                            {loading
                                                ? 'Loading...'
                                                : JSON.stringify(
                                                      response,
                                                      null,
                                                      2
                                                  )}
                                        </pre>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    Select an API route to see the response
                                </p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
