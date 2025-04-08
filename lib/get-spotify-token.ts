// import axios from 'axios'
// import fs from 'fs/promises'
// import path from 'path'
// import crypto from 'crypto'
import dotenv from 'dotenv'
// import chalk from 'chalk'
import { generateSpotifyAccessToken } from '@thunderblaze/generate-spotify-token'

dotenv.config()

// const cacheFilePath = path.resolve('.spotify-token')
// const encryptionKey = process.env.SPOTIFY_TOKEN_SECRET_KEY ?? 'super_secret_key' // store this in .env

// interface CachedToken {
//     access_token: string
//     expires_at: number
// }

// function encrypt(text: string): string {
//     const iv = crypto.randomBytes(16)
//     const cipher = crypto.createCipheriv(
//         'aes-256-cbc',
//         crypto.createHash('sha256').update(encryptionKey).digest(),
//         iv
//     )
//     let encrypted = cipher.update(text, 'utf-8', 'hex')
//     encrypted += cipher.final('hex')
//     return iv.toString('hex') + ':' + encrypted
// }

// function decrypt(data: string): string {
//     const [ivHex, encrypted] = data.split(':')
//     const iv = Buffer.from(ivHex, 'hex')
//     const decipher = crypto.createDecipheriv(
//         'aes-256-cbc',
//         crypto.createHash('sha256').update(encryptionKey).digest(),
//         iv
//     )
//     let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
//     decrypted += decipher.final('utf-8')
//     return decrypted
// }

// export async function getSpotifyAccessToken(): Promise<string | null> {
//     const now = Math.floor(Date.now() / 1000) // in seconds

//     // 1. Try reading the encrypted token from file
//     try {
//         const encryptedData = await fs.readFile(cacheFilePath, 'utf-8')
//         const decrypted = decrypt(encryptedData)
//         const cached: CachedToken = JSON.parse(decrypted)

//         if (cached.access_token && cached.expires_at > now) {
//             return cached.access_token
//         }
//     } catch {
//         // no-op if file doesn't exist or decryption fails
//     }

//     // 2. Fetch a new token from Spotify
//     try {
//         const response = await axios.post(
//             'https://accounts.spotify.com/api/token',
//             new URLSearchParams({ grant_type: 'client_credentials' }),
//             {
//                 headers: {
//                     Authorization:
//                         'Basic ' +
//                         Buffer.from(
//                             `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
//                         ).toString('base64'),
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         )

//         const { access_token, expires_in } = response.data

//         const tokenData: CachedToken = {
//             access_token,
//             expires_at: now + expires_in,
//         }

//         const encrypted = encrypt(JSON.stringify(tokenData))
//         await fs.writeFile(cacheFilePath, encrypted, 'utf-8')

//         return access_token
//     } catch (error) {
//         console.error('❌ Failed to get Spotify access token', error)
//         return null
//     }
// }

// console.log(chalk.hex('#000000').bgCyanBright.bold(' SPOTIFY ACCESS TOKEN => '))
// console.log(await getSpotifyAccessToken())

const SPOTIFY_TOKEN_SECRET_KEY = process.env.SPOTIFY_TOKEN_SECRET_KEY;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function getSpotifyAccessToken(): Promise<string | null> {
	return await generateSpotifyAccessToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_TOKEN_SECRET_KEY);
}