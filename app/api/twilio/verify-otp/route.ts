// /app/api/twilio/verify-otp/route.ts

import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import chalk from 'chalk'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!

const twilioAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { phoneNumber, code } = body

    if (!phoneNumber || !code) {
        console.log(chalk.bgRedBright.black('❌ Missing phone number or code'))
        return NextResponse.json(
            { error: 'Phone number and code are required' },
            { status: 400 }
        )
    }

    try {
        const response = await axios.post(
            `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`,
            new URLSearchParams({
                To: phoneNumber,
                Code: code,
            }),
            {
                headers: {
                    Authorization: `Basic ${twilioAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )

        const { status, valid } = response.data

        if (status === 'approved' && valid) {
            console.log(
                chalk.bgGreenBright.black('✅ OTP Verified Successfully')
            )
            return NextResponse.json({ success: true, status }, { status: 200 })
        } else {
            console.log(chalk.bgRed.black('❌ Invalid OTP Code'))
            return NextResponse.json(
                { success: false, error: 'Invalid code' },
                { status: 401 }
            )
        }
    } catch (error) {
        console.error(chalk.redBright('❌ Error verifying OTP:'), error)
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        )
    }
}
