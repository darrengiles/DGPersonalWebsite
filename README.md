# dgwebsite

Personal portfolio website for Darren Giles.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, Framer Motion
- **AI**: Vercel AI SDK + Google Generative AI (Snowboard Recommender)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/darrengiles/dgwebsite.git
cd dgwebsite

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Then fill in your API key in .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/chat/         # Chat API route
│   ├── contact/          # Contact page
│   ├── projects/         # Projects + Snowboard Recommender
│   ├── resume/           # Resume page
│   ├── globals.css       # Theme variables + shared keyframes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── cards/            # Education & Experience cards
│   ├── chat/             # ChatMessage & ChatInput
│   ├── game/             # Brick Breaker easter egg
│   ├── sections/         # Page sections
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   ├── PixelWave.tsx
│   └── ThemeToggle.tsx
├── context/              # Theme context provider
├── data/                 # Static data (education, experience, about)
├── styles/               # CSS Modules (chat, brick breaker)
└── types/                # TypeScript type definitions
```
