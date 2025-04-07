import axios from 'axios'
import { NextResponse } from 'next/server'
import chalk from 'chalk'
import lodash from 'lodash'

interface GitHubContributor {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    contributions: number
}

interface SimplifiedContributor {
    username: string
    avatar: string
    profile: string
    contributions: number
}

interface IRepoDetails {
    owner: string
    repo: string
}

export async function GET() {
    const RepoDetails: IRepoDetails = {
        owner: 'Thunder-Blaze',
        repo: 'BlazinLock',
    }

    try {
        const res = await axios.get<GitHubContributor[]>(
            `https://api.github.com/repos/${RepoDetails.owner}/${RepoDetails.repo}/contributors`
        )

        const contributors: SimplifiedContributor[] = lodash.map(
            res.data,
            (contributor) => ({
                username: contributor.login,
                avatar: contributor.avatar_url,
                profile: contributor.html_url,
                contributions: contributor.contributions,
            })
        )

        console.log(
            chalk.bgGreen.black.bold(
                ` > GitHub Contributors Fetched Successfully`
            )
        )
        lodash.forEach(contributors, (contributor, i) => {
            console.log(
                chalk.yellow(
                    `${i + 1}. ${contributor.username} - ${contributor.contributions} contributions`
                )
            )
        })

        return NextResponse.json({ contributors }, { status: 200 })
    } catch (error) {
        console.error(
            chalk.bgRedBright.black.bold(' > Failed to fetch contributors'),
            error
        )
        return NextResponse.json(
            { error: 'Failed to fetch contributors' },
            { status: 500 }
        )
    }
}
