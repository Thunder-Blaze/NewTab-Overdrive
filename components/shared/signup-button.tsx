'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

interface SignUpButtonProps {
    children: React.ReactNode
}

export const SignUpButton = ({ children }: SignUpButtonProps) => {
    const router = useRouter()

    const onClick = () => router.push('/signup')

    return (
        <Button onClick={onClick} className="w-full">
            {children}
        </Button>
    )
}
