# 🚀 Quick Deploy - Ready Commands

## For Vercel (Recommended)

### 1. Configure Neon Database
```bash
# Create account on Neon: https://console.neon.tech
# Create a new project
# Get the DATABASE_URL
```

### 2. Schema Already Configured
```bash
# Schema is already configured for PostgreSQL (Neon)
# No changes needed in prisma/schema.prisma
```

### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables in Vercel panel:
# DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
# NEXTAUTH_SECRET=your-secret-key-32-chars
# NEXTAUTH_URL=https://yoursite.vercel.app
```

### 4. Configure Production Database
```bash
# Run migrations
npx prisma migrate deploy

# Populate with initial data
npx prisma db seed
```

## For Railway

### 1. Direct Deploy
```bash
# Create account at https://railway.app
# Connect GitHub
# Add PostgreSQL service
# Copy DATABASE_URL
# Configure environment variables
# Automatic deploy
```

## Local Test Commands

```bash
# Production build
npm run build

# Test local build
npm run preview

# Check types
npm run type-check

# Check database
node scripts/check-db.js
```

## Production Environment Variables

### .env.production (example)
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="super-secret-key-with-32-characters"
NODE_ENV="production"
```

## Test URLs

After deployment, test:
- `/` - Home page
- `/admin` - Admin login (admin@portfolio.com / Admin123!)
- `/about` - About page
- `/contact` - Contact page
- `/api/projects` - Projects API

## Final Checklist

- [ ] Local build working
- [ ] Production database configured  
- [ ] Environment variables configured
- [ ] Deployment completed
- [ ] Migrations executed
- [ ] Seed executed
- [ ] Site working in production
- [ ] Admin login working

## Em Caso de Problemas

1. Verificar logs do deploy
2. Testar DATABASE_URL
3. Verificar variáveis de ambiente
4. Executar `npx prisma generate`
5. Verificar DEPLOY.md para troubleshooting completo
