#!/bin/bash

echo "🚀 Starting Vercel deployment build..."

# Generate Prisma Client
echo "📦 Generating Prisma client..."
npx prisma generate

# Check if we're in production and run migrations
if [ "$NODE_ENV" = "production" ]; then
  echo "🗄️ Running database migrations..."
  npx prisma migrate deploy
fi

# Build Next.js application
echo "🔨 Building Next.js application..."
npx next build

echo "✅ Build completed successfully!"
