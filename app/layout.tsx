import type React from 'react'
import type { Metadata } from 'next'
import { JetBrains_Mono, Urbanist } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import AnimatedCursor from 'react-animated-cursor'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import LenisProvider from '@/providers/lenis-provider'

const jetbrainsMono = JetBrains_Mono({
    variable: '--font-jetbrainsMono',
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
})

const urbanist = Urbanist({
    variable: '--font-urbanist',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'New Tab',
    description: 'A New Tab with Android-like fluid material design',
    generator: 'v0.dev',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <SessionProvider session={session}>
            <html lang="en" suppressHydrationWarning>
                <body className={`${urbanist.variable} ${jetbrainsMono.variable} antialiased overflow-hidden`}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <AnimatedCursor
                            innerSize={10}
                            outerSize={30}
                            color="255, 255, 255"
                            outerAlpha={0}
                            innerScale={2}
                            outerScale={3}
                            clickables={[
                                'h1',
                                'h2',
                                'h3',
                                'a',
                                'button',
                                'svg',
                                '.hover-element',
                            ]}
                            outerStyle={{
                                backdropFilter: 'invert(1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }}
                            innerStyle={{
                                backdropFilter: 'invert(1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }}
                        />
                        <LenisProvider>
                            {children}
                        </LenisProvider>
                    </ThemeProvider>
                </body>
            </html>
        </SessionProvider>
    )
}
