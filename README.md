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
- **Backend API**: Laravel (to be integrated)
- **Database**: MySQL (to be integrated)
- **Styling**: Tailwind CSS v4
- **Font**: Inter (Google Fonts)

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

## Next Steps

1. Set up Laravel backend API
2. Connect authentication endpoints
3. Implement API integration layer
4. Add database models and migrations
5. Implement role-based access control
6. Add content management features

## License

Private project - All rights reserved
