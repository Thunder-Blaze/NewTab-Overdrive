import axios from 'axios'
import chalk from 'chalk'
import { NextRequest, NextResponse } from 'next/server'
import dotenv from 'dotenv'

dotenv.config()

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY

interface RecipeResult {
    id: number
    title: string
    image: string
}

interface SpoonacularResponse {
    results: RecipeResult[]
    totalResults: number
}

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query') || 'pasta'

    try {
        const response = await axios.get<SpoonacularResponse>(
            'https://api.spoonacular.com/recipes/complexSearch',
            {
                params: {
                    apiKey: SPOONACULAR_API_KEY,
                    query,
                    number: 5,
                },
            }
        )

        const { results, totalResults } = response.data

        if (!results || results.length === 0) {
            console.log(chalk.redBright.black.bold('No recipes found'))
            return NextResponse.json(
                { error: 'No recipes found' },
                { status: 404 }
            )
        }

        console.log(
            chalk.bgGreenBright.black.bold(
                ` > Recipes Fetched Successfully for "${query}"`
            )
        )

        results.forEach((recipe, index) => {
            console.log(chalk.yellow(`${index + 1}. ${recipe.title}`))
            console.log(chalk.cyan(recipe.image))
        })

        return NextResponse.json(
            {
                total: totalResults,
                recipes: results,
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
            { error: 'Failed to fetch recipes' },
            { status: 500 }
        )
    }
}
