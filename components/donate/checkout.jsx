'use client'

import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { fetchClientSecret } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Checkout() {
    const router = useRouter()

    return (
        <div
            id="checkout"
            className="w-full min-h-screen flex flex-col justify-center"
        >
            <header
                className={cn(
                    'p-6 py-4 top-0 left-0 right-0 min-h-[60px]',
                    'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                    'flex items-center justify-between px-6',
                    'shadow-sm'
                )}
            >
                <h1 className="text-xl font-semibold tracking-tight">
                    Material Tab
                </h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <FaArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </header>

            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ fetchClientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    )
}
