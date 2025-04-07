import { NextResponse } from 'next/server'
import twilio from 'twilio'

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!

export async function POST(req: Request) {
    const { phone } = await req.json()

    if (!phone) {
        return NextResponse.json(
            { error: 'Phone number is required' },
            { status: 400 }
        )
    }

    try {
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID!,
            process.env.TWILIO_AUTH_TOKEN!
        )
        const verification = await client.verify.v2
            .services(verifyServiceSid)
            .verifications.create({
                to: phone,
                channel: 'sms',
            })

        return NextResponse.json({ status: verification.status })
    } catch (error) {
        console.error('OTP send error:', error)
        return NextResponse.json({ error: 'OTP send failed' }, { status: 500 })
    }
}
