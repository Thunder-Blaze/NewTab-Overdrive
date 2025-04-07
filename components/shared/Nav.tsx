'use client'
import React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mainNavLinks } from '@/constants'

const Nav = () => {
    const pathname = usePathname()
    return (
        <nav className="flex gap-8 font-semibold pr-4">
            {mainNavLinks.map((link, index) => {
                if (link.name != 'Contact')
                    return (
                        <Link
                            key={index}
                            href={link.path}
                            className={`${pathname === link.path ? 'text-accent border-b-2 border-accent' : ''} transition-all duration-300 hover:text-accent`}
                        >
                            {link.name}
                        </Link>
                    )
            })}
        </nav>
    )
}

export default Nav
