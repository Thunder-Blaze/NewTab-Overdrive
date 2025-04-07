// components/LenisProvider.tsx
'use client'

import { useLenis } from '@/hooks/use-lenis'

export default function LenisProvider({
    children,
}: {
    children: React.ReactNode
}) {
    useLenis()
    return <>{children}</>
}
