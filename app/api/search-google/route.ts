import axios from 'axios'
import { NextResponse, type NextRequest } from 'next/server'
import chalk from 'chalk'
import lodash from 'lodash'

interface GoogleSearchResult {
    kind: string
    title: string
    htmlTitle: string
    link: string
    displayLink: string
    snippet: string
    htmlSnippet: string
    formattedUrl: string
    htmlFormattedUrl: string
}

interface SimplifiedGoogleSearchResult {
    title: string
    link: string
    snippet: string
}

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('q')

    if (!query) {
        console.log(chalk.bgRedBright.black.bold(' > Missing search query'))
        return NextResponse.json(
            { error: 'Missing search query' },
            { status: 400 }
        )
    }

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID

    if (!apiKey || !cx) {
        console.error(chalk.red(' > Missing API key or CX'))
        return NextResponse.json(
            { error: 'Server config error' },
            { status: 500 }
        )
    }

    try {
        const res = await axios.get(
            'https://www.googleapis.com/customsearch/v1',
            {
                params: {
                    key: apiKey,
                    cx,
                    q: query,
                },
            }
        )

        const simplified: SimplifiedGoogleSearchResult[] = res.data.items.map(
            (item: GoogleSearchResult) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet,
            })
        )

        console.log(
            chalk.bgGreen.black.bold(' > Google Search Results Fetched')
        )
        lodash.map(simplified, (result, i) => {
            console.log(chalk.cyan.bold(i + 1 + ' Result:'), result.title)
            console.log(chalk.magenta.bold('Link:'), result.link)
        })
        return NextResponse.json({ results: simplified }, { status: 200 })
    } catch (error) {
        console.error(chalk.bgRedBright.black.bold(' > Search failed:'), error)
        return NextResponse.json(
            { error: 'Failed to fetch search results' },
            { status: 500 }
        )
    }
}
