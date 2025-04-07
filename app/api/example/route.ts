import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { corsMiddleware } from '../middleware/cors'

export async function GET(request: NextRequest) {
    // Handle CORS
    const corsResponse = corsMiddleware(request)
    if (corsResponse.status === 204) {
        return corsResponse
    }

    try {
        // Your API logic here
        return NextResponse.json({ message: 'Hello from the API!' }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    // Handle CORS
    const corsResponse = corsMiddleware(request)
    if (corsResponse.status === 204) {
        return corsResponse
    }

    try {
        // Your API logic here
        const data = await request.json()
        return NextResponse.json({ message: 'Data received', data }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
} 