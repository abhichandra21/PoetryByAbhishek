# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `npm run dev` - Start development server
- **Build**: `npm run build` - TypeScript compile and build for production
- **Lint**: `npm run lint` - Run ESLint
- **Test**: `npm run test` - Run Vitest tests
- **Preview**: `npm run preview` - Preview production build

## Architecture

This is a React + TypeScript + Vite poetry website with the following key components:

### Core Structure
- **Poems**: Stored as JSON in `src/data/poems.json` with TypeScript interfaces in `src/types/index.ts`
- **Components**: React components in `src/components/` handle poem display, navigation, comments, likes, and subscriptions
- **Routing**: React Router setup for individual poem pages and index
- **Styling**: Tailwind CSS with custom animations using Framer Motion

### Key Features
- **Bilingual Support**: Poems support both Devanagari and romanized text with script toggle functionality
- **Interactive Elements**: Comments system, likes, and sharing functionality
- **Email Subscriptions**: Supabase-powered subscriber management with email notifications
- **Analytics**: Google Analytics integration via custom utilities in `src/lib/analytics.ts`

### Data Flow
- Poems are loaded from `src/data/poems.json` and typed with the `Poem` interface
- Comments and likes are stored in Supabase with types defined in `src/lib/supabase.ts`
- Session management for user interactions handled in `src/lib/session.ts`
- Translation system supports tooltips and script conversion via `src/translations/poemTranslations.ts`

### Email System
- New poem notifications sent via `scripts/sendNewPoemEmails.js`
- Uses nodemailer with SMTP configuration
- Tracks last sent poem ID in `scripts/last_poem_id.txt`

### Environment Variables
Required in `.env.local`:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` - Supabase connection
- `VITE_GA_MEASUREMENT_ID` - Google Analytics
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` - Email configuration

### Testing
- Tests located in `src/lib/__tests__/` using Vitest
- Focus on analytics and session utilities