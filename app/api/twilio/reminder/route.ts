import { NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
)

export async function POST() {
    try {
        const message = await client.messages.create({
            body: '🧠 Your daily reminder: Stay focused and crush your goals!',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.USER_PHONE_NUMBER,
        })

        return NextResponse.json({ sid: message.sid }, { status: 200 })
    } catch (error) {
        console.error('Failed to send SMS:', error)
        return NextResponse.json({ error: 'SMS failed' }, { status: 500 })
    }
}
