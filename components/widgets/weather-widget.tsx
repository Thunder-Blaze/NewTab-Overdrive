'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { WiDaySunny, WiCloudy, WiRain, WiStrongWind } from 'react-icons/wi'
import { FaSearch } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'

interface WeatherData {
    city: string
    weather: string
    temperature: number
    humidity: number
    wind: number
}

interface CachedWeather extends WeatherData {
    timestamp: number
}

const CACHE_DURATION = 20 * 60 * 1000 // 15 minutes in milliseconds

export function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [city, setCity] = useState('Lucknow')
    const [searchCity, setSearchCity] = useState('')

    const fetchWeather = async (cityName: string) => {
        setLoading(true)
        setError(null)

        try {
            // Check cache first
            const cacheKey = `weatherCache_${cityName.toLowerCase()}`
            const cachedData = localStorage.getItem(cacheKey)

            if (cachedData) {
                const { timestamp, ...weatherData }: CachedWeather =
                    JSON.parse(cachedData)
                const now = Date.now()

                if (now - timestamp < CACHE_DURATION) {
                    setWeather(weatherData)
                    setLoading(false)
                    return
                }
            }

            const response = await fetch(
                `/api/fetch-weather?city=${encodeURIComponent(cityName)}`
            )

            // Check content type to ensure we're getting JSON
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(
                    'API returned non-JSON response. The API route may not be set up correctly.'
                )
            }

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(
                    errorData.error || 'Failed to fetch weather data'
                )
            }

            const data = await response.json()

            // Cache the weather data with timestamp
            const cacheData: CachedWeather = {
                ...data,
                timestamp: Date.now(),
            }
            localStorage.setItem(cacheKey, JSON.stringify(cacheData))

            setWeather(data)
        } catch (err) {
            console.error('Weather fetch error:', err)
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch weather data. Please ensure the API route is properly configured.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWeather(city)
    }, [city])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchCity.trim()) {
            setCity(searchCity)
        }
    }

    const getWeatherIcon = (weatherType: string) => {
        switch (weatherType.toLowerCase()) {
            case 'clear':
                return <WiDaySunny className="w-6 h-6" />
            case 'clouds':
                return <WiCloudy className="w-6 h-6" />
            case 'rain':
                return <WiRain className="w-6 h-6" />
            default:
                return <WiCloudy className="w-6 h-6" />
        }
    }

    return (
        <Card>
            <CardHeader className="bg-primary/10 flex flex-row items-center justify-between space-y-0 py-3">
                <CardTitle className="text-lg font-medium">Weather</CardTitle>
                <WiCloudy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
                    <Input
                        placeholder="Enter city name"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                    />
                    <Button type="submit" size="icon" disabled={loading}>
                        {loading ? (
                            <ClipLoader size={16} color="hsl(var(--primary))" />
                        ) : (
                            <FaSearch className="h-4 w-4" />
                        )}
                    </Button>
                </form>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <ClipLoader size={32} color="hsl(var(--primary))" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-destructive">
                        <p>{error}</p>
                        <p className="text-sm mt-2">
                            Please check your API key or try another city.
                        </p>
                    </div>
                ) : weather ? (
                    <div className="flex flex-col items-center space-y-4">
                        <h3 className="text-xl font-medium">{weather.city}</h3>
                        {getWeatherIcon(weather.weather)}
                        <div className="text-3xl font-bold">
                            {Math.round(weather.temperature)}°C
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {weather.weather}
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="flex items-center justify-center space-x-2">
                                <WiStrongWind className="w-6 h-6 text-primary" />
                                <span className="text-sm">
                                    {weather.wind} m/s
                                </span>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <WiRain className="w-6 h-6 text-primary" />
                                <span className="text-sm">
                                    {weather.humidity}% humidity
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No weather data available
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
