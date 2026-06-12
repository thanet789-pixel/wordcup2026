# WORLD CUP 2026 — LIVE MATCH CENTER

Premium cinematic sports web application built with Next.js 15, TypeScript, TailwindCSS, Framer Motion, and Shadcn/ui.

## Features

- Cinematic dark UI with glassmorphism and neon glow effects
- 11 pages: Splash, Home, Matches, Match Detail, Live Match, Standings, Teams, Team Detail, Player Detail, News, Settings
- Mobile-first with bottom navigation + desktop sidebar
- Live scores, match timeline, stats, AI predictions & summaries
- Fan reaction system and goal flash animations
- Mock football data (ready for API-Football / Supabase integration)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the splash screen, then the home dashboard.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Animation:** Framer Motion
- **UI:** Shadcn/ui + Radix UI
- **Icons:** Lucide React

## Project Structure

```
src/
├── app/           # Pages (App Router)
├── components/    # Reusable UI components
├── data/          # Mock football data
└── lib/           # Utilities
```

## Pages

| Route | Description |
|-------|-------------|
| `/splash` | Cinematic loading screen |
| `/home` | Dashboard homepage |
| `/matches` | Timeline match schedule |
| `/matches/[id]` | Match detail center |
| `/live/[id]` | Fullscreen live experience |
| `/standings` | Group standings tables |
| `/teams` | Team browser |
| `/teams/[id]` | Team profile |
| `/players/[id]` | Player profile |
| `/news` | News feed |
| `/settings` | App settings |

## License

MIT
