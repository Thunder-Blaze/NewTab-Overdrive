export const runtime = 'nodejs' // For Vercek to run this in nodejs

import axios from 'axios'
import chalk from 'chalk'
import { NextResponse, type NextRequest } from 'next/server'
import { getSpotifyAccessToken } from '@/lib/get-spotify-token'
import lodash from 'lodash'

interface SpotifyTrack {
    id: string
    name: string
    artists: { name: string }[]
    external_urls: { spotify: string }
}

interface SimplifiedTrack {
    id: string
    name: string
    cover: string
    artists: string
    album: string
    url: string
}

export async function GET(req: NextRequest) {
    try {
        const searchQuery = req.nextUrl.searchParams.get('q')

        if (!searchQuery) {
            console.error(chalk.bgRedBright.bold.black(' X No query provided'))
            return NextResponse.json(
                { error: 'Missing query param' },
                { status: 400 }
            )
        }

        const accessToken = await getSpotifyAccessToken()
        if (!accessToken) {
            console.error(
                chalk.bgRedBright.bold.black(' X No access token received')
            )
            return NextResponse.json(
                { error: 'No access token' },
                { status: 500 }
            )
        }

        const searchResponse = await axios.get(
            'https://api.spotify.com/v1/search',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    q: searchQuery,
                    type: 'track',
                    limit: 8,
                },
            }
        )

        const tracks: SpotifyTrack[] = searchResponse.data.tracks.items

        const simplifiedTracks: SimplifiedTrack[] = lodash.map(
            tracks,
            (track) => ({
                id: track.id,
                name: track.name,
                cover: lodash.get(track, 'album.images[0].url', ''),
                artists: lodash.map(track.artists, 'name').join(', '),
                album: lodash.get(track, 'album.name', 'Unknown Album'),
                url: lodash.get(track, 'external_urls.spotify', ''),
            })
        )

        console.log(
            chalk.bgGreenBright.black.bold(
                ' > Spotify Search Fetched Successfully'
            )
        )
        simplifiedTracks.forEach((track, i) => {
            const artistNames = track.artists
            console.log(
                chalk.yellow(`🎵 ${i + 1}. ${track.name} - ${artistNames}`)
            )
            console.log(chalk.cyan(`🔗 ${track.url}`))
        })

        return NextResponse.json({ simplifiedTracks }, { status: 200 })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(chalk.redBright(' > Axios error:'), error.message)
        } else {
            console.error(chalk.redBright(' > Unknown error:'), error)
        }

        return NextResponse.json(
            { error: 'Spotify search failed' },
            { status: 500 }
        )
    }
}
