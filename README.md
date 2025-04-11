# Material New Tab Dashboard

A modern, responsive new tab page built with Next.js, featuring a beautiful UI and various widgets for productivity and information.
Works way faster online as compared to the video. The video was lagging due to my PC's low specs and the pages weren't cached while recording.

# Deployed Link

https://new-tab-overdrive.vercel.app/

## Preview

https://github.com/user-attachments/assets/d42d201c-0c1b-4ba2-a84b-34268b54692c

https://github.com/user-attachments/assets/0d731226-9327-4d5f-924d-e73bdcdc86cd

https://github.com/user-attachments/assets/91b35ee1-a2bf-4b18-b85e-bf2851dd12f0

## Features

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly across all devices
- **Authentication**: Sign in with Google or email/password
- **Theme Support**: Light and dark mode with customizable accent colors
- **Widgets**:
    - Clock
    - Weather
    - Todo List
    - Quote of the Day
    - Codeforces Contests
    - GitHub Contributors
    - News Feed
    - Search (Google, DuckDuckGo, Bing, Brave, YouTube)
    - Spotify Search
    - And more...
- **Data Management**:
    - Local storage for widget data
    - Cloud backup and restore
    - Export/import functionality

## Tech Stack

### Frontend

- **Next.js 15**: React framework for server-rendered applications
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui and radix-ui**: Beautiful, accessible components
- **Next-Themes**: To manage light and dark modes and save its state
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Icon library
- **React Hook Form**: Form handling
- **React/Lenis**: For Smooth Scrolling
- **SVGR/webpack**: To use SVGs by directly importing them as React Component
- **React-Animated-Cursor**: Awesome Animated Cursor
- **React Spinners**: Used for loading animation while the API were fetching something

### Backend

- **Next-Auth**: Used for Authenticaticating the users so that they can use backup & restore features
- **MongoDB**: Database to store users and user backups
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT handling
- **cors**: Allows to share data over different domains/origins (wasn't needed rn as both frontend and backend are hosted on same domain and the used APIs didn't required cross origin headers to belong to same origin but added for future use)
- **Axios**: For get and post requests handled by the backend
- **Crypto**: For Encrypting the token and caching it
- **Date-fns**: Used to format date in case of News API
- **Dotenv**: Used to access spotify credentials and generate spotify token in the backend
- **Loadash**: Used to format and filter the data fetched from APIs in an optimised manner
- **Chalk**: For logging fetched data in a coloured and formatted way (prrovides better distinction b/w heading and content)
- **Nodemailer**: Email functionality to verify acc, reset pwd, etc
- **Stripe**: Used to integrate the Stripe Checkout Form
- **UUID**: To generate unique id identifiers for users
- **Zod**: Schema validation

### Extra (Useful Packages)

- **Prettier**: Formats the code in same manner for all contributors
- **Eslint**: Linting checks for potential issues and vulnerabilities

### My Custom Made Package

- **@thunderblaze/generate-spotify-token**: A Package that will help you create and cache the spotify token generated from your credentials until the token expires.

### APIs & Services

- **OpenWeather API**: Weather data
- **News API**: News articles
- **OMDB Movies API**: Movies Search
- **Recipes API (Spoonacular)**: Finding Recipes
- **Codeforces API**: Programming contests
- **GitHub API**: Repository contributors
- **Spotify API**: Music search
- **ipinfo API**: Fetches Location based on IP Address
- **Books API**: Book search
- **Google Search API**: Integrated Google search
- **Stripe API**: Payment Integration (Donation)
- **DummyJSON API**: Dummy Quotes
- **Twilio API**: Had setup it and wanted to use it to send mails/sms whenever there was a CF contest but it somehow didn't work out because of time and it needing Verified Numbers

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Bun (for Installing Packages without Getting any Conflicts)
- MongoDB database
- API keys for external services (see Environment Variables)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Thunder-Blaze/NewTab-Overdrive.git
cd NewTab-Overdrive
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env` file in the root directory following the env.sample

4. Run the development server:

```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
NewTab-Overdrive/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── shared/            # Shared components
│   ├── ui/                # UI components
│   └── widgets/           # Dashboard widgets
├── lib/                   # Utility functions and configurations
│   ├── actions/           # Server actions
│   ├── models/            # Database models
│   └── utils/             # Helper functions
├── public/                # Static files
└── styles/                # Global styles
```

## Widgets Overview

### Home Tab

- **Search App**: Unified search across multiple engines
- **Clock**: Current time and date
- **Weather**: Current weather and forecast
- **Todo List**: Task management
- **Quote Widget**: Daily inspirational quotes

### Info Tab

- **Codeforces Widget**: Upcoming programming contests
- **GitHub Contributors**: Repository contributors
- **News Widget**: Latest news articles
- **Recipes Widget**: Cooking recipes
- **Books Widget**: Book recommendations
- **Movies Widget**: Movie information

### Search Tab

- **Google Search**: Web search
- **Spotify Search**: Music search

### Settings Tab

- **Theme Toggle**: Light/dark mode
- **Accent Color Picker**: Customize UI colors
- **Wallpaper Picker**: Change new tab background
- **Backup & Restore**: Manage widget data
    - Local backup/restore
    - Cloud backup/restore
    - Clear all data

## Acknowledgments

- [Maeterial You New Tab](https://github.com/XengShi/materialYouNewTab/) for the for the inspiration
