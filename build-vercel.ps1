# PowerShell script for Vercel deployment build

Write-Host "🚀 Starting Vercel deployment build..." -ForegroundColor Green

# Generate Prisma Client
Write-Host "📦 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Check if we're in production and run migrations
if ($env:NODE_ENV -eq "production") {
    Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
    npx prisma migrate deploy
}

# Build Next.js application
Write-Host "🔨 Building Next.js application..." -ForegroundColor Yellow
npx next build

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
