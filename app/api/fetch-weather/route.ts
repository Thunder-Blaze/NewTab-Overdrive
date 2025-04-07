import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import chalk from 'chalk'
import lodash from 'lodash'

const API_KEY = process.env.OPEN_WEATHER_API_KEY

interface WeatherResponse {
    city: string
    weather: string
    temperature: number
    humidity: number
    wind: number
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')
    const city = searchParams.get('city') || 'Lucknow'

    const params: Record<string, string> = {
        appid: API_KEY || '',
        units: 'metric',
    }

    if (lat && lon) {
        params.lat = lat
        params.lon = lon
    } else {
        params.q = city
    }

    try {
        const res = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather',
            {
                params,
            }
        )

        const data = res.data

        const simplified: WeatherResponse = {
            city: lodash.get(data, 'name', ''),
            weather: lodash.get(data, 'weather[0].main', ''),
            temperature: lodash.get(data, 'main.temp', 0),
            humidity: lodash.get(data, 'main.humidity', 0),
            wind: lodash.get(data, 'wind.speed', 0),
        }

        console.log(
            chalk.bgGreen.black.bold(
                ` > Weather Data Fetched Successfully for ${lat && lon ? `${lat}, ${lon}` : city}`
            )
        )
        console.log(chalk.blueBright(`City: ${simplified.city}`))
        console.log(chalk.yellow(`Weather: ${simplified.weather}`))
        console.log(chalk.red(`Temp: ${simplified.temperature}°C`))
        console.log(chalk.magenta(`Humidity: ${simplified.humidity}°C`))
        console.log(chalk.cyan(`Wind: ${simplified.wind} m/s`))

        return NextResponse.json(simplified)
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            console.error(
                chalk.bgRedBright.black.bold(
                    ` > API Error: ${lodash.get(err, 'response.data.message', err.message)}`
                )
            )
            return NextResponse.json(
                {
                    error: lodash.get(
                        err,
                        'response.data.message',
                        err.message
                    ),
                },
                { status: err.response?.status || 500 }
            )
        }

        console.error(chalk.bgRedBright.black.bold(` > Unknown Error`), err)
        return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
    }
}
