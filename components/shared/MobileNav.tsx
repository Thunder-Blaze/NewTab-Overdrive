'use client'
import React from 'react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { usePathname } from 'next/navigation'
import { CiMenuFries } from 'react-icons/ci'
import { UserButton } from './user-button'
import { ModeToggle } from './mode-toggle'
import { mainNavLinks } from '@/constants'

const MobileNav = () => {
    const pathname = usePathname()
    return (
        <Sheet>
            <SheetTrigger className="flex justify-center items-center">
                <CiMenuFries className="text-[32px] text-accent" />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
                <div className="mt-20 mb-24 text-center text-3xl font-bold font-monospace">
                    Dedsec<span className="text-accent">AI</span>
                </div>
                <nav className="flex flex-col gap-6 items-center justify-center">
                    {mainNavLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.path}
                            className={`${link.path === pathname && 'text-accent border-b-2 bprder-accent'} font-semibold hover:text-accent transition-all duration-300`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="m-auto flex items-center space-x-4">
                        <UserButton />
                        <ModeToggle />
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav
