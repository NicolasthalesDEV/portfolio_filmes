# 🚀 Neon Database Setup Guide

## What is Neon?

Neon is a serverless PostgreSQL platform that's perfect for modern applications. It offers:
- ✅ Serverless architecture (perfect for Vercel)
- ✅ Auto-scaling and auto-pause
- ✅ Branching for databases
- ✅ Built-in connection pooling
- ✅ Free tier available

## 📋 Setup Steps

### 1. Create Neon Account

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub, Google, or email
3. Verify your email if needed

### 2. Create Database Project

1. Click "Create Project"
2. Choose your settings:
   - **Project Name**: `portfolio-app` (or your preferred name)
   - **PostgreSQL Version**: Latest (recommended)
   - **Region**: Choose closest to your users
3. Click "Create Project"

### 3. Get Connection String

1. In your project dashboard, go to "Connection Details"
2. Select "Pooled connection" (recommended for serverless)
3. Copy the connection string - it should look like:
   ```
   postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 4. Configure Your Application

#### Local Development

1. Create `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
   NEXTAUTH_SECRET="your-32-character-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. Install dependencies and run migrations:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   ```

#### Production (Vercel)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   ```
   DATABASE_URL: postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
   NEXTAUTH_SECRET: your-32-character-secret-key
   NEXTAUTH_URL: https://your-app.vercel.app
   ```

### 5. Deploy and Migrate

1. Deploy your application to Vercel
2. After successful deployment, run migrations:
   ```bash
   # Using Vercel CLI
   vercel env pull .env.production
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 🔧 Neon-Specific Optimizations

### Connection Pooling

Neon automatically provides connection pooling, but you can optimize further:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query','error','warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Database Branching (Optional)

Neon supports database branches for different environments:

```bash
# Create a development branch
neon branches create --project-id your-project-id dev

# Get branch connection string
neon branches get --project-id your-project-id dev
```

## 🚨 Important Notes

### SSL Connection
Always use `?sslmode=require` in your connection string for security.

### Connection Limits
- **Free Tier**: 20 concurrent connections
- **Pro Tier**: 1000+ concurrent connections

### Auto-Pause
Free tier databases auto-pause after 5 minutes of inactivity. This is normal and doesn't affect your application.

### Pricing
- **Free Tier**: 512 MB storage, 20 concurrent connections
- **Pro Tier**: Starts at $19/month with more resources

## 🔍 Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```bash
   # Check your connection string format
   echo $DATABASE_URL
   
   # Test connection
   npx prisma db pull
   ```

2. **SSL Error**
   - Ensure your connection string includes `?sslmode=require`
   - Check firewall settings

3. **Migration Issues**
   ```bash
   # Reset migrations if needed
   npx prisma migrate reset
   npx prisma migrate deploy
   ```

### Verify Setup
```bash
# Test database connection
node scripts/check-db.js

# Check Prisma client
npx prisma generate
npx prisma studio
```

## 📞 Support

- **Neon Docs**: https://neon.tech/docs
- **Neon Community**: https://community.neon.tech
- **Prisma Docs**: https://prisma.io/docs

## 🎯 Next Steps

After setting up Neon:

1. ✅ Test local development
2. ✅ Deploy to Vercel
3. ✅ Run production migrations
4. ✅ Test admin dashboard
5. ✅ Monitor performance in Neon console

Your portfolio application is now ready for production with Neon's serverless PostgreSQL!
