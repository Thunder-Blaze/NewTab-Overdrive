import axios from 'axios'
import chalk from 'chalk'
import { NextResponse } from 'next/server'

interface MemeResponse {
    postLink: string
    subreddit: string
    title: string
    url: string
    nsfw: boolean
    spoiler: boolean
    author: string
    ups: number
    preview: string[]
}

interface SimplifiedMemeResponse {
    postLink: string
    imgUrl: string
}

export async function GET() {
    try {
        const response = await axios.get<MemeResponse>(
            'https://meme-api.com/gimme'
        )

        const Meme: MemeResponse = response.data

        const SimplifiedMeme: SimplifiedMemeResponse = {
            postLink: Meme.postLink,
            imgUrl:
                Meme.preview[Math.min(2, Meme.preview.length - 1)] || Meme.url,
        }

        console.log(
            chalk.bgGreenBright.black.bold(
                ' > Random Meme Fetched Successfully'
            )
        )
        console.log(chalk.yellow(`MemePost - ${SimplifiedMeme.postLink}`))
        console.log(chalk.cyan(`MemeImg — ${SimplifiedMeme.imgUrl}`))

        return NextResponse.json(SimplifiedMeme, { status: 200 })
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
            { error: 'Failed to fetch meme' },
            { status: 500 }
        )
    }
}
