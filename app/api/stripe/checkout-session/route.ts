// app/api/donate/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import chalk from 'chalk'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
})

export async function POST() {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Support the Project',
                        },
                        unit_amount: 500, // $5 donation
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/donate/success',
            cancel_url: 'http://localhost:3000/donate/cancel',
        })

        console.log(chalk.green.bold('> Stripe donation session created'))
        console.log(chalk.cyan(`Session URL: ${session.url}`))

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error(chalk.redBright.bold('> Stripe Error:'), error)
        return NextResponse.json(
            { error: 'Failed to create Stripe session' },
            { status: 500 }
        )
    }
}
