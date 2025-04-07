import axios from 'axios'
import chalk from 'chalk'
import { NextResponse } from 'next/server'

interface IpInfoResponse {
    city: string
    loc: string // "lat,lon"
}

export async function GET() {
    try {
        const response = await axios.get<IpInfoResponse>(
            'https://ipinfo.io/json'
        )
        const { city, loc } = response.data

        if (!city || !loc) {
            console.log(
                chalk.redBright.black.bold('Incomplete data from IPInfo')
            )
            return NextResponse.json(
                { error: 'Incomplete data from IPInfo' },
                { status: 500 }
            )
        }

        const [latitude, longitude] = loc.split(',')

        console.log(
            chalk.bgGreenBright.black.bold(
                ' > IP Location Info Fetched Successfully'
            )
        )
        console.log(chalk.yellow(`City: ${city}`))
        console.log(chalk.cyan(`Latitude: ${latitude}`))
        console.log(chalk.cyan(`Longitude: ${longitude}`))

        return NextResponse.json(
            {
                city,
                latitude,
                longitude,
            },
            { status: 200 }
        )
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                chalk.bgRedBright.black.bold(' > Axios error:'),
                error.message
            )
        } else {
            console.error(chalk.redBright(' > Unknown error:'), error)
        }
        return NextResponse.json(
            { error: 'Failed to fetch location data' },
            { status: 500 }
        )
    }
}
