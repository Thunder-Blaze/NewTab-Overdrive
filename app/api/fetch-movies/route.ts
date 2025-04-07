import axios from 'axios'
import { NextResponse, type NextRequest } from 'next/server'
import chalk from 'chalk'
import lodash from 'lodash'

interface OmdbMovie {
    Title: string
    Year: string
    Rated?: string
    Released?: string
    Runtime?: string
    Genre?: string
    Director?: string
    Writer?: string
    Actors?: string
    Plot?: string
    Language?: string
    Country?: string
    Awards?: string
    Poster: string
    Ratings?: { Source: string; Value: string }[]
    Metascore?: string
    imdbRating?: string
    imdbVotes?: string
    imdbID: string
    Type: string
    DVD?: string
    BoxOffice?: string
    Production?: string
    Website?: string
    Response: string
}

interface SimplifiedMovie {
    title: string
    year: string
    imdbID: string
    type: string
    poster: string
}

export async function GET(req: NextRequest) {
    const searchQuery = req.nextUrl.searchParams.get('q')
    const apiKey = process.env.OMDB_API_KEY

    if (!apiKey) {
        console.error(chalk.bgRedBright.black.bold(' > Missing OMDB_API_KEY'))
        return NextResponse.json(
            { error: 'Missing OMDB API key' },
            { status: 500 }
        )
    }

    if (!searchQuery) {
        console.error(chalk.bgRedBright.black.bold(' > Missing search query'))
        return NextResponse.json(
            { error: 'Missing search query' },
            { status: 400 }
        )
    }

    try {
        const res = await axios.get('https://www.omdbapi.com/', {
            params: {
                s: searchQuery,
                apikey: apiKey,
                type: 'movie',
            },
        })

        const movies: OmdbMovie[] = res.data.Search

        const simplified: SimplifiedMovie[] = lodash.map(movies, (movie) => ({
            title: movie.Title,
            year: movie.Year,
            imdbID: movie.imdbID,
            type: movie.Type,
            poster: movie.Poster !== 'N/A' ? movie.Poster : '',
        }))

        console.log(chalk.bgGreen.black.bold(' > Movies Fetched Successfully'))
        lodash.forEach(simplified, (movie, i) => {
            console.log(
                chalk.yellow(`${i + 1}. ${movie.title} (${movie.year})`)
            )
            console.log(
                chalk.cyan(`Link => https://www.imdb.com/title/${movie.imdbID}`)
            )
        })

        return NextResponse.json({ movies: simplified }, { status: 200 })
    } catch (error) {
        console.error(
            chalk.bgRedBright.black.bold(' > Failed to fetch movies'),
            error
        )
        return NextResponse.json(
            { error: 'Failed to fetch movies' },
            { status: 500 }
        )
    }
}
