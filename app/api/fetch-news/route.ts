import axios from 'axios'
import { NextResponse } from 'next/server'
import chalk from 'chalk'
import { format } from 'date-fns'
import lodash from 'lodash'

interface NewsArticle {
    title: string
    description: string
    url: string
    source: {
        name: string
    }
    publishedAt: string
}

interface SimplifiedNewsArticle {
    title: string
    description: string
    url: string
    source: string
    date: string
}

export async function GET() {
    const apiKey = process.env.NEWS_API_KEY

    if (!apiKey) {
        console.error(chalk.bgRedBright.black.bold(' > Missing NEWS_API_KEY'))
        return NextResponse.json(
            { error: 'Missing News API key' },
            { status: 500 }
        )
    }

    try {
        const res = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
                country: 'us',
                // country: 'in',      // Getting very few results for India
                pageSize: 10,
                apiKey,
            },
        })

        const simplified: SimplifiedNewsArticle[] = lodash.map(
            res.data.articles,
            (article: NewsArticle) => ({
                title: article.title,
                description: article.description,
                url: article.url,
                source: article.source.name,
                date: format(new Date(article.publishedAt), 'PPP p'),
            })
        )

        console.log(
            chalk.bgGreen.black.bold(' > Top Headlines Fetched Successfully')
        )
        lodash.map(simplified, (article, i) => {
            console.log(chalk.cyan.bold(i + 1 + ' Headline:'), article.title)
            console.log(chalk.magenta.bold('Link:'), article.url)
            console.log(chalk.gray('Published:'), article.date)
        })

        return NextResponse.json({ articles: simplified }, { status: 200 })
    } catch (error) {
        console.error(
            chalk.bgRedBright.black.bold(' > Failed to fetch top headlines'),
            error
        )
        return NextResponse.json(
            { error: 'Failed to fetch top headlines' },
            { status: 500 }
        )
    }
}
