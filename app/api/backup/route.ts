import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import connectDB from '@/lib/db'
import { Backup } from '@/lib/models/backup.model'

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { data } = body

        if (!data) {
            return new NextResponse('Data is required', { status: 400 })
        }

        await connectDB()

        const backup = await Backup.create({
            userId: session.user._id,
            data,
        })

        return NextResponse.json(backup)
    } catch (error) {
        console.error('Backup error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        await connectDB()

        const backups = await Backup.find({ userId: session.user._id })
            .sort({ createdAt: -1 })
            .limit(5)

        return NextResponse.json(backups)
    } catch (error) {
        console.error('Get backups error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 