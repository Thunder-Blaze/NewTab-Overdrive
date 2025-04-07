import axios from 'axios'
import chalk from 'chalk'
import { NextResponse } from 'next/server'
import lodash from 'lodash'

interface CodeforcesContest {
    id: number
    name: string
    type: string
    phase: string
    durationSeconds: number
    startTimeSeconds?: number
    relativeTimeSeconds?: number
}

interface SimplifiedContest {
    id: number
    name: string
    type: string
    phase: string
    duration: string
    startsAt?: string
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
}

export async function GET() {
    try {
        const res = await axios.get('https://codeforces.com/api/contest.list', {
            params: {
                gym: false,
            },
        })

        const contests: CodeforcesContest[] = res.data.result

        const simplifiedContests: SimplifiedContest[] = lodash.filter(
            lodash.map(contests.slice(0, 10), (contest) => ({
                id: contest.id,
                name: contest.name,
                type: contest.type,
                phase: contest.phase,
                duration: formatDuration(contest.durationSeconds),
                startsAt: contest.startTimeSeconds
                    ? new Date(contest.startTimeSeconds * 1000).toLocaleString()
                    : undefined,
            })),
            (contest) => contest.phase === 'BEFORE'
        )

        console.log(
            chalk.bgGreenBright.black.bold(
                ` > Codeforces Contest List Fetched Successfully`
            )
        )

        simplifiedContests.forEach((contest, i) => {
            console.log(chalk.yellow(`${i + 1}. ${contest.name}`))
            console.log(
                chalk.cyan(
                    `Phase: ${contest.phase} | Duration: ${contest.duration}`
                )
            )
            if (contest.startsAt) {
                console.log(chalk.magenta(`Starts At: ${contest.startsAt}`))
            }
        })

        return NextResponse.json({ simplifiedContests }, { status: 200 })
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            console.error(
                chalk.bgRedBright.black.bold(
                    ` > API Error: ${err.response?.data?.comment || err.message}`
                )
            )
            return NextResponse.json(
                { error: err.response?.data?.comment || err.message },
                { status: err.response?.status || 500 }
            )
        }

        console.error(chalk.bgRedBright.black.bold(` > Unknown Error`), err)
        return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
    }
}
