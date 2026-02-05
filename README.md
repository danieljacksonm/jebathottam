# Digital Ministry Platform

A long-term digital ministry platform built to preserve God-spoken words (prophecies, revelations) for future generations, encourage believers using digital tools, and provide a clean, calm, trustworthy platform for ministry growth.

## Project Vision

This website is designed for a Christian ministry with the following goals:
- Preserve God-spoken words (prophecies, revelations) for future generations
- Encourage believers using digital tools
- Provide a clean, calm, trustworthy platform for ministry growth

## Core Principles

- **Data longevity and safety** are more important than trends
- **Clarity over visual noise**
- **Calm, respectful, ministry-appropriate design**
- **Security and role-based access** are mandatory
- **Build simple first, scale later**

## Architecture

- **Frontend**: Next.js 16 (App Router) with TypeScript
- **Backend API**: Next.js API Routes (Node.js/Express)
- **Database**: MySQL (PlanetScale, Railway, or other hosting)
- **Styling**: Tailwind CSS v4
- **Font**: Inter (Google Fonts)
- **Hosting**: Vercel (recommended)

## User Roles

- **Master Admin**: Full access
- **Pastor**: Manage prophecies, sermons, notes
- **Ministry Member**: Limited access (notes, prayer, content)
- **Public Visitor**: Read-only access

## Core Features (Phase 1)

- ✅ Authentication UI (API-based, to be connected)
- ✅ Role-based access control (UI ready)
- ✅ Prophecy / God-spoken words storage (UI ready)
- ✅ Notes system (UI ready)
- ✅ Sermons / teachings archive (UI ready)
- ✅ Admin management panel (UI ready)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

This project is ready to deploy to Vercel. See [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md) for complete deployment instructions.

### Quick Deploy Steps:

1. **Push code to Git repository**
2. **Set up database** (PlanetScale, Railway, or other MySQL hosting)
3. **Import database schema** from `database/schema.sql`
4. **Deploy to Vercel**:
   - Connect your Git repository
   - Add environment variables (see VERCEL-DEPLOYMENT.md)
   - Deploy!

### Required Environment Variables:

- `DB_HOST` - Database hostname
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Strong random string for JWT tokens
- `NEXT_PUBLIC_API_URL` - Your Vercel domain + /api

See [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md) for detailed instructions.

## Project Structure

```
newjebathottam/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── dashboard/          # Dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Reusable UI components
│       ├── button.tsx    # Button component
│       ├── card.tsx      # Card components
│       ├── input.tsx     # Input component
│       └── label.tsx     # Label component
├── lib/                  # Utility functions
│   └── utils.ts         # Helper functions
└── docs/                 # Documentation
    └── design-system.md  # Design system guidelines
```

## Design System

All UI components follow the design system documented in `/docs/design-system.md`. Key principles:

- Calm, respectful, ministry-appropriate design
- Clean, uncluttered interfaces
- Mobile-first, responsive design
- Accessible (WCAG compliant)
- Minimal animations (only on user interaction)

## Development Rules

- **Do NOT** refactor existing working logic unless explicitly asked
- **Do NOT** redesign the entire project at once
- **Do NOT** mix backend logic into frontend
- Modify one component or feature at a time
- When improving UI, change only JSX and Tailwind classes
- No new dependencies unless explicitly approved

## Documentation

- [Backend Setup Guide](./README-BACKEND.md) - Database and API setup
- [Vercel Deployment Guide](./VERCEL-DEPLOYMENT.md) - Complete deployment instructions
- [Deployment Checklist](./DEPLOYMENT-CHECKLIST.md) - Pre-deployment checklist
- [Design System](./docs/design-system.md) - UI/UX guidelines

## Next Steps

1. ✅ Backend API implemented (Next.js API Routes)
2. ✅ Database schema created
3. ✅ Authentication system ready
4. ⏳ Deploy to Vercel
5. ⏳ Set up production database
6. ⏳ Connect frontend to backend APIs
7. ⏳ Test all features

## License

Private project - All rights reserved
