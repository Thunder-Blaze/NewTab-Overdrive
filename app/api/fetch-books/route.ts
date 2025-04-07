import axios from 'axios'
import { NextResponse, type NextRequest } from 'next/server'
import chalk from 'chalk'
import lodash from 'lodash'

interface OpenLibraryBook {
    key: string
    title: string
    author_name?: string[]
    first_publish_year?: number
    edition_count: number
    cover_i?: number
    isbn?: string[]
}

interface SimplifiedBook {
    title: string
    author: string
    year?: number
    editions: number
    cover?: string
}

export async function GET(req: NextRequest) {
    const searchQuery = req.nextUrl.searchParams.get('q')

    if (!searchQuery) {
        console.error(chalk.bgRedBright.black.bold(' > Missing search query'))
        return NextResponse.json(
            { error: 'Missing search query' },
            { status: 400 }
        )
    }

    try {
        const res = await axios.get('https://openlibrary.org/search.json', {
            params: {
                q: searchQuery,
                limit: 10,
            },
        })

        const books: OpenLibraryBook[] = res.data.docs

        const simplified: SimplifiedBook[] = lodash.map(books, (book) => ({
            title: book.title,
            author: lodash.get(book, 'author_name[0]', 'Unknown'),
            year: book.first_publish_year,
            editions: book.edition_count,
            cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : undefined,
        }))

        console.log(chalk.bgGreen.black.bold(' > Books Fetched Successfully'))
        lodash.forEach(simplified, (book, i) => {
            console.log(
                chalk.yellow(`${i + 1}. ${book.title} by ${book.author}`)
            )
        })

        return NextResponse.json({ books: simplified }, { status: 200 })
    } catch (error) {
        console.error(
            chalk.bgRedBright.black.bold(' > Failed to fetch books'),
            error
        )
        return NextResponse.json(
            { error: 'Failed to fetch books' },
            { status: 500 }
        )
    }
}
