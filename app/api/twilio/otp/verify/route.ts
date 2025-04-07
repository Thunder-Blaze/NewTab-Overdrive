// /app/api/twilio/send-otp/route.ts

import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import chalk from 'chalk'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!

const twilioAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { phoneNumber } = body

    if (!phoneNumber) {
        console.log(chalk.bgRedBright.black('❌ Phone number not provided'))
        return NextResponse.json(
            { error: 'Phone number is required' },
            { status: 400 }
        )
    }

    try {
        const response = await axios.post(
            `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`,
            new URLSearchParams({
                To: phoneNumber,
                Channel: 'sms',
            }),
            {
                headers: {
                    Authorization: `Basic ${twilioAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )

        console.log(
            chalk.bgGreenBright.black('✅ OTP Sent Successfully to'),
            phoneNumber
        )

        return NextResponse.json(
            { status: response.data.status },
            { status: 200 }
        )
    } catch (error) {
        console.error(chalk.redBright('❌ Error sending OTP:'), error)
        return NextResponse.json(
            { error: 'Failed to send OTP' },
            { status: 500 }
        )
    }
}
