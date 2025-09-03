# 📋 Deployment Checklist - Creative Portfolio

## Pre-Deployment

### ✅ Local Preparation
- [ ] Code tested in development environment
- [ ] Build executed successfully (`npm run build`)
- [ ] All TypeScript types verified
- [ ] Database working locally
- [ ] Seed executed successfully

### ✅ Production Configuration
- [ ] Create Neon database at [console.neon.tech](https://console.neon.tech)
- [ ] Configure PostgreSQL database in Neon
- [ ] Obtain Neon database connection URL
- [ ] Schema is already configured for PostgreSQL

### ✅ Environment Variables
- [ ] `DATABASE_URL` - Neon database connection string
- [ ] `NEXTAUTH_SECRET` - Random secret key (minimum 32 characters)
- [ ] `NEXTAUTH_URL` - Production site URL
- [ ] `NODE_ENV=production`

## Vercel Deployment

### ✅ Configuration
- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables in Vercel panel
- [ ] Verify build command is correct: `prisma generate && next build`
- [ ] Verify install command is correct: `pnpm install`

### ✅ Deploy
- [ ] Push to main/master branch
- [ ] Wait for Vercel automatic deployment
- [ ] Check build logs
- [ ] Run database migrations

### ✅ Post-Deploy
- [ ] Access production URL
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Run seed: `npx prisma db seed`
- [ ] Test administrative login
- [ ] Test project creation
- [ ] Test category filters
- [ ] Test contact form

## Other Providers Deployment

### ✅ Railway
- [ ] Connect repository
- [ ] Add PostgreSQL service
- [ ] Configure environment variables
- [ ] Automatic deploy

### ✅ DigitalOcean App Platform
- [ ] Connect repository
- [ ] Configure database cluster
- [ ] Configure environment variables
- [ ] Deploy

### ✅ Netlify
- [ ] Connect repository
- [ ] Configure external database (Supabase/PlanetScale)
- [ ] Configure environment variables
- [ ] Build command: `prisma generate && next build`
- [ ] Deploy

## ⚙️ Important Commands

### Database Migration
```bash
# Run migrations in production
npx prisma migrate deploy

# Populate database with initial data
npx prisma db seed

# View migration status
npx prisma migrate status
```

### Local Build
```bash
# Complete build
npm run build:prod

# Build only
npm run build

# Local preview
npm run preview
```

### Troubleshooting
```bash
# Regenerate Prisma client
npx prisma generate

# Check database connection
npx prisma db pull

# Studio to visualize data
npx prisma studio
```

## 🔧 Important URLs

### Database Providers
- **Neon** (Recommended): https://console.neon.tech
- **Supabase**: https://supabase.com
- **PlanetScale**: https://planetscale.com
- **Railway**: https://railway.app
- **Neon**: https://neon.tech

### Deploy Providers
- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **Railway**: https://railway.app
- **DigitalOcean**: https://digitalocean.com

## 🚨 Common Troubleshooting

### Build Issues
- Check TypeScript types
- Regenerate Prisma client
- Clear cache: `rm -rf .next`

### Database Issues
- Check connection URL
- Verify credentials
- Test local connection

### Deploy Issues
- Check environment variables
- Check provider logs
- Verify build commands

## ✅ Final Verification

- [ ] Site loading in production
- [ ] Administrative login working
- [ ] Project CRUD working
- [ ] Category filters working
- [ ] Media upload working
- [ ] Contact form working
- [ ] Responsiveness working
- [ ] Satisfactory performance

## 📞 Support

In case of issues:
1. Check this checklist
2. Consult README.md
3. Check provider logs
4. Open issue in repository
