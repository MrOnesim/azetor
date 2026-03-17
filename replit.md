# Vano Baby — Official Music Platform (Azéto Gbèdé)

Full-stack music streaming and fan platform for Béninese rapper Vano Baby.

## Architecture

**Monorepo** with pnpm workspaces:
- `client/` — React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion (port 5000)
- `server/` — Express + TypeScript + Prisma + PostgreSQL (port 3000)

## Workflows

- **Start application**: `cd client && pnpm dev` → port 5000 (webview)
- **Backend API**: `cd server && pnpm dev` → port 3000 (console)

## Tech Stack

### Frontend
- React 18, Vite 5, TypeScript
- Tailwind CSS with custom theme (Bebas Neue + Playfair Display fonts)
- Framer Motion for animations
- Zustand (playerStore, authStore)
- React Router v6
- Axios with `/api` proxy to backend

### Backend
- Express + TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication (user + admin, separate secrets)
- Cookie-based sessions
- Express Rate Limit

## Database

PostgreSQL (Replit hosted). Run via:
```
cd server && pnpm exec prisma migrate dev
cd server && pnpm exec ts-node prisma/seed.ts
```

Models: User, Album, Track, Video, Event, Comment, Badge, UserBadge, PlayHistory, EventReaction, ContactMessage, AdminUser

## Admin Credentials
- Email: `admin@vanobaby.bj`
- Password: `VanoBaby2024!`
- Admin URL: `/admin/login`

## Spotify Integration
- Artist ID: `6VxXJZxxq0cmpBvbVM8p0E`
- Client ID: `1cf1c8410e114cbcb5974eeede2ac439`
- Credentials via `VITE_SPOTIFY_CLIENT_ID` and `VITE_SPOTIFY_CLIENT_SECRET`

## Pages

### Public (8 pages)
- `/` — Home (hero, latest release, stats)
- `/about` — Biographie (story, timeline, gallery)
- `/career` — Carrière (awards, collabs, press)
- `/music` — Musique (Spotify-powered discography, tracklist, albums)
- `/videos` — Vidéos (YouTube embeds, filters, comments)
- `/concerts` — Concerts (events, tickets, FAQ, gallery)
- `/community` — Communauté (profile, badges, leaderboard)
- `/contact` — Contact (booking form, social links)

### Admin Panel
- `/admin/login` — Admin authentication
- `/admin` — Dashboard (stats, top tracks)
- `/admin/music` — Manage albums
- `/admin/videos` — Manage videos
- `/admin/events` — Manage concerts
- `/admin/moderation` — Comment moderation
- `/admin/users` — User management (ban/unban)

## Key Components
- `PersistentPlayer` — Bottom audio player with 30-second preview rule
- `CustomCursor` — Custom red dot cursor
- `IntroLoader` — Animated intro screen (shows once per session)
- `AuthModal` — Login/register modal (pin-based)
- `Navbar` — Sticky navigation with mobile menu
- `OwlIcon` — SVG owl logo

## Environment Variables

Server `.env`:
```
JWT_SECRET=...
JWT_ADMIN_SECRET=...
PORT=3000
```

Replit secrets: `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

## Features
- Spotify API integration (top tracks, albums, artist info)
- 30-second audio preview player with queue
- Badge/achievement system (8 badges)
- JWT user auth with pin-based registration
- Comment system with flagging and moderation
- Event attendance tracking ("Je serai là")
- Contact/booking form
- Responsive design (mobile + desktop)
- Page transitions with Framer Motion
- SEO with React Helmet Async
