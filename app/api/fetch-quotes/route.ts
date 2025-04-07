import axios from 'axios'
import chalk from 'chalk'
import { NextResponse } from 'next/server'

interface QuoteResponse {
    quote: string
    author: string
}

export async function GET() {
    try {
        const response = await axios.get<QuoteResponse>(
            'https://dummyjson.com/quotes/random'
        )

        const { quote, author } = response.data

        if (!quote || !author) {
            console.log(chalk.redBright.black.bold('Incomplete quote data'))
            return NextResponse.json(
                { error: 'Incomplete quote data' },
                { status: 500 }
            )
        }

        console.log(
            chalk.bgGreenBright.black.bold(
                ' > Random Quote Fetched Successfully'
            )
        )
        console.log(chalk.yellow(`"${quote}"`))
        console.log(chalk.cyan(`— ${author}`))

        return NextResponse.json(
            {
                quote,
                author,
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
            { error: 'Failed to fetch quote' },
            { status: 500 }
        )
    }
}
