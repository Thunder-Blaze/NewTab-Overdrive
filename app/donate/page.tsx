'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
import Checkout from '@/components/donate/checkout'

export default function DonatePage() {
    // const [loading, setLoading] = useState(false)

    // const handleDonate = async () => {
    //     setLoading(true)
    //     try {
    //         const res = await fetch('/api/donate', {
    //             method: 'POST',
    //         })

    //         const data = await res.json()
    //         if (data.url) {
    //             window.location.href = data.url
    //         } else {
    //             console.error('No URL returned')
    //         }
    //     } catch (err) {
    //         console.error('Donation error:', err)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {/* <h1 className="text-2xl font-bold mb-4">Support the Project</h1>
            <p className="mb-6 text-gray-600">
                Your donations help keep this project alive and free ❤️
            </p>
            <Button onClick={handleDonate} disabled={loading}>
                {loading ? 'Redirecting...' : 'Donate $5'}
            </Button> */}
            <Checkout />
        </div>
    )
}
