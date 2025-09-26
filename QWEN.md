# Poetry by Abhishek - Development Guide

## Project Overview

Poetry by Abhishek is a bilingual poetry website that publishes Hindi poetry in both Devanagari script and Roman transliteration. The site allows readers to seamlessly switch between scripts and provides inline word lookups via Wiktionary and a curated fallback dictionary. It features a beautiful, accessible UI with poetry presented in a book-like format.

### Key Features
- **Bilingual Display**: Poetry in both Devanagari script and Roman transliteration
- **Interactive Word Lookups**: Click on words to see their meanings, examples, and etymology
- **Responsive Design**: Works well on mobile, tablet, and desktop devices
- **Poem Navigation**: Browse through poems in a book-like interface with swipe support
- **Search and Tagging**: Find poems by tags and other metadata
- **Social Sharing**: Share poems on various platforms
- **Subscription System**: Email notifications for new poems
- **Comment System**: Community feedback on poems
- **SEO Optimized**: Each poem has structured data and meta tags for search engines
- **Analytics Integration**: Google Analytics tracking

### Architecture
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom theming
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router DOM
- **Data Storage**: JSON-based poem storage
- **Hosting**: Static site (deployed on Netlify)
- **External Services**: Wiktionary API, DictionaryAPI, Supabase for subscriptions

## Project Structure

```
PoetryByAbhishek/
├── public/                 # Static assets (images, favicons, dictionary cache)
├── src/
│   ├── components/         # React components (PoemPage, Navigation, etc.)
│   ├── data/              # Poetry content as JSON
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions (dictionary, analytics)
│   ├── translations/      # Manual translations for poems
│   └── types/             # TypeScript type definitions
├── scripts/               # Build scripts (dictionary generation, sitemap, etc.)
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── index.html             # Main HTML entry point
```

## Building and Running

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Setup
```bash
# Install dependencies
npm install

# Copy the environment file template
cp .env.example .env.local  # Create this file and add your environment variables

# Check if dictionary needs to be generated
npm run check:dictionary

# If needed, generate the dictionary cache
npm run generate:dictionary
```

### Development Commands
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Lint code
npm run lint

# Generate sitemap
npm run generate:sitemap

# Generate dictionary cache
npm run generate:dictionary

# Check if dictionary cache is up to date
npm run check:dictionary
```

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase credentials for the subscription system
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# SMTP settings for sending email notifications (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_password
MAIL_FROM="Poetry Bot <bot@example.com>"
```

## Development Conventions

### Poetry Content
- Poetry is stored in `src/data/poems.json`
- Each poem has both Devanagari and Roman transliteration versions
- Poems include metadata like tags, dates, and other attributes
- When adding or modifying poems, regenerate the dictionary cache:
  ```bash
  npm run generate:dictionary
  ```

### Components
- Components are written in TypeScript with functional approach
- Follow React best practices and hooks
- Use Tailwind CSS for styling with custom theme classes
- Components are organized by functionality in the `src/components/` directory

### Dictionary Integration
The word lookup functionality works in this order:
1. Runtime cache (in memory)
2. Static cache (generated from scripts)
3. Wiktionary API
4. DictionaryAPI.dev
5. Manual translations (fallback)

When adding new poems to `src/data/poems.json`, run `npm run check:dictionary` to verify if the cache needs updating, and if so, run `npm run generate:dictionary` to refresh it.

### Bilingual Support
- The site supports both Devanagari script and Roman transliteration
- Users can switch between scripts using the toggle button
- The `ScriptPreferenceProvider` manages the user's script preference in localStorage
- The `ScriptToggle` component allows for switching between scripts

### SEO and Accessibility
- Each poem page includes structured data for search engines
- Proper meta tags and descriptions for social sharing
- Keyboard navigation support
- Responsive design for all screen sizes
- ARIA attributes where appropriate

### Subscription System
- Readers can subscribe to receive notifications about new poems
- Subscribers are stored in a Supabase table with at least an email column
- After adding new poems, run the notification script:
  ```bash
  node scripts/sendNewPoemEmails.js
  ```

### Testing
- Unit tests are written using Vitest
- Component tests should be added for major functionality
- Run tests with `npm run test`

## Key Libraries and Dependencies

- **React 19**: UI library
- **React Router DOM**: Client-side routing
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling framework
- **Framer Motion**: Animations and transitions
- **Vite**: Build tool and development server
- **Supabase**: Database for subscriptions
- **Nodemailer**: Email delivery
- **Floating UI**: Positioning tooltips
- **Vitest**: Testing framework

## Deployment

The site is designed to be deployed as a static site (e.g., on Netlify). The build process:
1. Generates the dictionary cache
2. Creates a sitemap
3. Builds the React application
4. Outputs to the `dist/` directory

## Dictionary Workflow

- After editing `src/data/poems.json`, run `npm run check:dictionary`
- If the script warns that the poems changed more recently than the cache, refresh the cache with `npm run generate:dictionary`
- All builds (`npm run build`) regenerate the static cache automatically
- To debug which source resolved a tooltip during development, temporarily add the debug snippet mentioned in README.md

## Contributing

1. Make changes to poetry content or functionality
2. If adding new poems, update the dictionary cache
3. Test changes locally using `npm run dev`
4. Run linting and tests before committing
5. Submit a pull request with a clear description

## Troubleshooting

- If dictionary lookups aren't working, ensure cache is regenerated after adding new poems
- If build fails, check that all environment variables are set
- For performance issues, ensure dictionary cache generation isn't running frequently during development