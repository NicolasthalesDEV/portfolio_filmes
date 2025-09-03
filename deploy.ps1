# Deploy Script - Portfolio (Windows)
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm found: $pnpmVersion" -ForegroundColor Green
    $npmCmd = "pnpm"
} catch {
    Write-Host "⚠️ pnpm not found. Using npm..." -ForegroundColor Yellow
    $npmCmd = "npm"
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
& $npmCmd install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependency installation failed." -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma client generation failed." -ForegroundColor Red
    exit 1
}

Write-Host "🏗️ Building application..." -ForegroundColor Blue
& $npmCmd run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 Next steps for deployment:" -ForegroundColor Cyan
    Write-Host "1. Configure your production environment variables" -ForegroundColor White
    Write-Host "2. Configure your production database (PostgreSQL/MySQL)" -ForegroundColor White
    Write-Host "3. Run migrations: npx prisma migrate deploy" -ForegroundColor White
    Write-Host "4. Run seed: npx prisma db seed" -ForegroundColor White
    Write-Host "5. Deploy to your hosting provider" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 For more information, check README.md" -ForegroundColor Yellow
} else {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}
