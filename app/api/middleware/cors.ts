import Cors from 'cors'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Initialize the cors middleware
const cors = Cors({
    // Options for configuring CORS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    origin: '*', // Allow all origins in development. In production, you might want to specify domains
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'X-Requested-With',
        'Accept',
        'Accept-Version',
        'Content-Length',
        'Content-MD5',
        'Date',
        'X-Api-Version'
    ],
})

export function corsMiddleware(request: NextRequest) {
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
                'Access-Control-Allow-Credentials': 'true',
            },
        })
    }
    
    return NextResponse.next()
} 