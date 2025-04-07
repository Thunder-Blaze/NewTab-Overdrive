# Material New Tab Dashboard

A modern, responsive new tab page built with Next.js, featuring a beautiful UI and various widgets for productivity and information.

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
- **shadcn/ui**: Beautiful, accessible components
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Icon library
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Backend
- **NextAuth.js**: Authentication
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT handling
- **nodemailer**: Email functionality

### APIs & Services
- **OpenWeather API**: Weather data
- **News API**: News articles
- **Codeforces API**: Programming contests
- **GitHub API**: Repository contributors
- **Spotify API**: Music search
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
