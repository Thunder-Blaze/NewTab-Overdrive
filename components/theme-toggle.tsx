'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { FaMoon, FaSun } from 'react-icons/fa'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="relative"
        >
            <FaSun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <FaMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}
