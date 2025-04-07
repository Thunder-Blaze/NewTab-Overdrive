import Link from 'next/link'

import Nav from './Nav'
import MobileNav from './MobileNav'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { UserButton } from '@/components/shared/user-button'
import { Button } from '@/components/ui/button'

export const Navbar = () => {
    return (
        <header className="py-3 xl:py-6 text-foreground">
            <div className="container flex justify-between items-center">
                <Link href={'/'} className="font-bold text-3xl font-monospace">
                    Dedsec<span className="text-accent">AI</span>
                </Link>
                <div className="hidden lg:flex items-center gap-4">
                    <Nav />
                    <Link href={'/contact'}>
                        <Button className="font-monospace bg-accent font-black hover:bg-accent-foreground">
                            Contact Us
                        </Button>
                    </Link>
                    <div className="ml-auto flex items-center space-x-4">
                        <UserButton />
                        <ModeToggle />
                    </div>
                </div>
                <div className="xl:hidden">
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}
