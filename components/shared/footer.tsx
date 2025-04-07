import Link from 'next/link'
import { footerLinks, socialLinks } from '@/constants'

import { Input } from '../ui/input'

export const Footer = () => {
    return (
        <footer className="flex flex-col text-foreground/50 text-sm mt-5 border-t border-foreground/10">
            <div className="bg-foreground/5 py-5">
                <div className="flex flex-wrap container mx-auto items-center justify-evenly gap-10 ">
                    <div className="flex flex-col gap-0.5">
                        <div className="uppercase text-foreground/60 font-monospace font-semibold text-xs">
                            Subscribe to our
                        </div>
                        <div className="font-monospace text-foreground font-black text-[1.2rem] uppercase">
                            Newsletter
                        </div>
                    </div>
                    <div className="flex gap-3 relative items-center flex-1 max-w-[30rem] min-w-[16rem]">
                        <Input
                            placeholder="Enter Email Address"
                            type="email"
                            className="w-full flex h-[48px] ring-2 focus-visible:ring-2 ring-primary/20 rounded-full border-none focus:border-accent focus:ring-accent bg-background text-foreground placeholder:text-foreground/60 px-4 pr-28 outline-none active:outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-accent"
                        />
                        <button className="bg-accent font-bold px-4 py-1.5 rounded-full absolute text-sm right-2.5 text-background active:scale-90 transition-all duration-300">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-evenly container mx-auto max-sm:flex-col gap-10 px-6 py-10 sm:gap-20">
                <div className="flex flex-col gap-3 justify-center">
                    <h1 className="text-4xl text-foreground/90 font-black font-monospace text">
                        Dedsec<span className="text-accent/90">AI</span>
                    </h1>
                    <div>&copy; 2025</div>
                </div>
                {footerLinks.map((links) => (
                    <div key={links.title}>
                        <h3 className="text-lg font-semibold text-foreground/90">
                            {links.title}
                        </h3>
                        <div className="flex flex-col gap-2 pt-3">
                            {links.links.map((link) => (
                                <Link
                                    key={link.title}
                                    href={link.url}
                                    className="text-xs md:text-sm hover:text-accent transition-all duration-300"
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
                <div>
                    <h2 className="text-lg font-semibold text-foreground/90">
                        Follow Us
                    </h2>
                    <div className="flex py-1 pt-3 gap-2">
                        {socialLinks.map((social) => (
                            <a
                                href={social.url}
                                className="rounded-full bg-accent aspect-square p-2 flex items-center justify-center transition-all duration-300 hover:scale-110"
                                key={social.title}
                            >
                                <div className="text-foreground rounded-full">
                                    <social.icon className="w-5 h-5 text-foreground"></social.icon>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
