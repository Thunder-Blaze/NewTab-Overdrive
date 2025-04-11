'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import { WallpaperPicker } from '@/components/wallpaper-picker'
import { AccentColorPicker } from '@/components/accent-color-picker'
import { cn } from '@/lib/utils'
import { Clock } from '@/components/widgets/clock'
import { WeatherWidget } from '@/components/widgets/weather-widget'
import { QuoteWidget } from '@/components/widgets/quote-widget'
import { MemeWidget } from '@/components/widgets/meme-widget'
import { TodoList } from '@/components/widgets/todo-list'
import { CodeforcesWidget } from '@/components/widgets/codeforces-widget'
import { GithubContributorsWidget } from '@/components/widgets/github-contributors-widget'
import { RecipesWidget } from '@/components/widgets/recipes-widget'
import { BooksWidget } from '@/components/widgets/books-widget'
import { MoviesWidget } from '@/components/widgets/movies-widget'
import { NewsWidget } from '@/components/widgets/news-widget'
import { GoogleSearchWidget } from '@/components/widgets/google-search-widget'
import { SpotifySearchWidget } from '@/components/widgets/spotify-search-widget'
import SearchApp from '@/components/widgets/search-app'
import { motion, AnimatePresence } from 'framer-motion'
import { BackupRestoreWidget } from '@/components/widgets/backup-restore-widget'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Dashboard({
    setWallpaper,
}: {
    setWallpaper: (wallpaper: string) => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
                'min-h-screen w-full transition-all duration-300 bg-gradient-to-br from-background/30 to-muted/10',
                'flex flex-col items-center p-4 md:p-8'
            )}
            style={{
                backdropFilter: 'blur(8px)',
            }}
        >
            <div className="w-full max-w-6xl mx-auto">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between items-center mb-6"
                >
                    <h1 className="text-2xl font-bold">New Tab</h1>
                    <div className="flex items-center gap-2">
                        <AccentColorPicker />
                        <WallpaperPicker onSelectWallpaper={setWallpaper} />
                        <ThemeToggle />
                    </div>
                </motion.div>

                <Tabs defaultValue="home" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-8">
                        <TabsTrigger
                            value="home"
                            className="text-lg py-3 transition-all duration-200 active:scale-95"
                        >
                            Home
                        </TabsTrigger>
                        <TabsTrigger
                            value="info"
                            className="text-lg py-3 transition-all duration-200 active:scale-95"
                        >
                            Info
                        </TabsTrigger>
                        <TabsTrigger
                            value="search"
                            className="text-lg py-3 transition-all duration-200 active:scale-95"
                        >
                            Search
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="text-lg py-3 transition-all duration-200 active:scale-95"
                        >
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent
                            key="home"
                            value="home"
                            className="flex flex-col gap-8 items-center mt-2"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex justify-center items-center"
                            >
                                <SearchApp />
                            </motion.div>
                            <div className="w-full columns-1 md:columns-2 gap-6 [column-fill:balance]">
                                {[
                                    <Clock key="clock" />,
                                    <WeatherWidget key="weather" />,
                                    <QuoteWidget key="quote" />,
                                    <MemeWidget key="meme" />,
                                    <TodoList key="todo" />,
                                ].map((widget, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                        }}
                                        className="break-inside-avoid mb-6"
                                    >
                                        {widget}
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent key="info" value="info" className="mt-2">
                            <div className="w-full columns-1 md:columns-2 gap-6 [column-fill:balance]">
                                {[
                                    <CodeforcesWidget key="codeforces" />,
                                    <GithubContributorsWidget key="github" />,
                                    <RecipesWidget key="recipes" />,
                                    <BooksWidget key="books" />,
                                    <MoviesWidget key="movies" />,
                                    <NewsWidget key="news" />,
                                ].map((widget, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                        }}
                                        className="break-inside-avoid mb-6"
                                    >
                                        {widget}
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent
                            key="search"
                            value="search"
                            className="mt-2"
                        >
                            <div className="columns-1 gap-6 [column-fill:balance]">
                                {[
                                    <GoogleSearchWidget key="google" />,
                                    <SpotifySearchWidget key="spotify" />,
                                ].map((widget, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.1,
                                        }}
                                        className="break-inside-avoid mb-6"
                                    >
                                        {widget}
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent
                            key="settings"
                            value="settings"
                            className="mt-2"
                        >
                            <div className="columns-1 gap-6 [column-fill:balance]">
                                <BackupRestoreWidget />
                                <div className="mt-6">
                                    <Link href="/donate" passHref>
                                        <Button
                                            variant="outline"
                                            className="w-full flex items-center justify-center gap-2"
                                        >
                                            <Heart className="w-4 h-4 text-red-500" />
                                            Support the Project
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>
        </motion.div>
    )
}
