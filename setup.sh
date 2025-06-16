#!/usr/bin/env bash
# Setup script for PoetryByAbhishek React application
set -euo pipefail

# Ensure npm is available
if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Please install Node.js (https://nodejs.org/) and try again." >&2
  exit 1
fi

# Install npm dependencies
echo "Installing dependencies..."
npm install

# Create environment file if it does not exist
if [ ! -f .env.local ]; then
  cat > .env.local <<'EOT'
# Supabase configuration
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
EOT
  echo "Created .env.local with placeholder values. Update it with your Supabase credentials." >&2
fi

# Run lint to ensure code quality
npm run lint

# Build the project for production
npm run build

# Run tests if Vitest is available
if npx vitest --version >/dev/null 2>&1; then
  npx vitest run
fi

echo "Setup complete. Start the dev server with 'npm run dev'."
