#!/bin/bash

# Deploy Script - Portfolio
echo "🚀 Starting deployment process..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️ pnpm not found. Using npm..."
    NPM_CMD="npm"
else
    NPM_CMD="pnpm"
fi

echo "📦 Installing dependencies..."
$NPM_CMD install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🏗️ Building application..."
$NPM_CMD run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🎯 Next steps for deployment:"
    echo "1. Configure your production environment variables"
    echo "2. Configure your production database (PostgreSQL/MySQL)"
    echo "3. Run migrations: npx prisma migrate deploy"
    echo "4. Run seed: npx prisma db seed"
    echo "5. Deploy to your hosting provider"
    echo ""
    echo "📚 For more information, check README.md"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
