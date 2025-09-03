# Creative Portfolio - Application Documentation

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [API Routes](#api-routes)
4. [Components Structure](#components-structure)
5. [Authentication System](#authentication-system)
6. [Project Management](#project-management)
7. [Media Handling](#media-handling)
8. [Styling and Theming](#styling-and-theming)
9. [Configuration](#configuration)
10. [Development Workflow](#development-workflow)

## 🏗️ Architecture Overview

The Creative Portfolio is built using modern web technologies with a focus on performance, scalability, and developer experience.

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: React 19
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel, Netlify, Railway compatible

### Project Structure

```
portfolio_filmes/
├── app/                     # Next.js 15 App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   └── project/[id]/       # Dynamic project pages
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── *.tsx               # Custom components
├── lib/                    # Utilities and configurations
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## 🗄️ Database Schema

### Tables

#### Users
```sql
- id: String (Primary Key)
- email: String (Unique)
- password: String
- name: String
- user_type: String (admin/regular)
- is_active: Boolean
- created_at: DateTime
- updated_at: DateTime
```

#### Projects
```sql
- id: String (Primary Key)
- title: String
- description: String
- category: String (enum)
- thumbnail: String
- media: JSON (array of media objects)
- visibility: Boolean
- created_at: DateTime
- updated_at: DateTime
```

#### Skills
```sql
- id: String (Primary Key)
- name: String (Unique)
- created_at: DateTime
- updated_at: DateTime
```

#### ProjectSkills (Many-to-Many)
```sql
- projectId: String (Foreign Key)
- skillId: String (Foreign Key)
```

#### PageContent
```sql
- id: String (Primary Key)
- page_type: String (home/about/contact)
- content: JSON
- created_at: DateTime
- updated_at: DateTime
```

### Project Categories

1. **Film project** (default)
2. **Graphic Design Project**
3. **Illustration project**
4. **Architecture Project**
5. **Small fine art project**
6. **Advertising project**

## 🔌 API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Projects
- `GET /api/projects` - Get all visible projects
- `GET /api/projects/[id]` - Get specific project
- `POST /api/projects/manage` - Create new project (admin)
- `PUT /api/projects/manage` - Update project (admin)
- `DELETE /api/projects/manage` - Delete project (admin)

### Content Management
- `GET /api/content/[page]` - Get page content
- `PUT /api/content/[page]` - Update page content (admin)

### Contact
- `POST /api/contact` - Send contact form

### Debug
- `GET /api/debug` - System information
- `GET /api/debug-prisma` - Database status

## 🧩 Components Structure

### Core Components

#### AdminDashboard
- **Location**: `components/admin-dashboard.tsx`
- **Purpose**: Complete admin interface for managing projects
- **Features**:
  - Project CRUD operations
  - Media upload and management
  - Category filtering
  - Vimeo integration
  - Drag-and-drop reordering

#### PortfolioGrid
- **Location**: `components/portfolio-grid-clean.tsx`
- **Purpose**: Display projects in a grid layout
- **Features**:
  - Category filtering
  - Responsive grid
  - Project preview
  - Smooth animations

#### ProjectDetail
- **Location**: `components/project-detail.tsx`
- **Purpose**: Individual project page layout
- **Features**:
  - Media gallery
  - Video support
  - Navigation between projects

### UI Components

Built on top of shadcn/ui for consistency:
- Button, Card, Dialog, Input, Textarea
- Select, Badge, Tabs, Sheet
- Custom theme integration

### Animation Components

#### FadeIn
- **Location**: `components/fade-in.tsx`
- **Purpose**: Entrance animations
- **Configuration**: Customizable delay and direction

#### StaggeredAnimation
- **Location**: `components/staggered-animation.tsx`
- **Purpose**: Sequenced animations for lists

## 🔐 Authentication System

### Implementation
- Cookie-based session management
- Password hashing with bcrypt
- Admin role verification
- Protected route middleware

### Security Features
- CSRF protection
- Input validation
- SQL injection prevention
- XSS protection

### Default Credentials
```
Email: admin@portfolio.com
Password: Admin123!
```

## 📁 Project Management

### Project Structure
```typescript
interface Project {
  id: string
  title: string
  description: string
  category: ProjectCategory
  thumbnail: string
  media: MediaItem[]
  visibility: boolean
  createdAt: Date
  updatedAt: Date
}

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video'
  name: string
  thumbnail?: string
}
```

### Media Types Supported
- **Images**: JPEG, PNG, WebP, SVG
- **Videos**: MP4, WebM, Vimeo embeds
- **Thumbnails**: Auto-generated for videos

### Features
- Drag-and-drop media reordering
- Vimeo video integration
- Automatic thumbnail generation
- Category-based filtering
- Bulk operations

## 🎨 Media Handling

### Upload Process
1. File validation (type, size)
2. Storage to public directory
3. Thumbnail generation (for videos)
4. Database record creation
5. UI update

### Vimeo Integration
- Automatic thumbnail extraction
- Video metadata fetching
- Embed URL generation
- Player optimization

### Storage Structure
```
public/
├── uploads/
│   ├── projects/
│   │   ├── images/
│   │   └── videos/
│   └── thumbnails/
└── placeholder.*
```

## 🎨 Styling and Theming

### Design System
- **Color Scheme**: Dark theme with customizable accents
- **Typography**: 10 Google Fonts available
- **Components**: shadcn/ui with custom modifications
- **Responsive**: Mobile-first approach

### Theme Configuration
```typescript
// Customizable font selections
const AVAILABLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Poppins', 'Nunito', 'Source Sans Pro', 'Raleway', 'Ubuntu'
]

// Theme variants
const themes = {
  light: { /* light theme config */ },
  dark: { /* dark theme config */ }
}
```

### CSS Architecture
- Tailwind CSS for utility-first styling
- CSS custom properties for theming
- Component-scoped styles
- Animation utilities

## ⚙️ Configuration

### Environment Variables

#### Required
```env
DATABASE_URL="file:./dev.db"           # Development SQLite
NEXTAUTH_SECRET="your-secret-key"      # Authentication secret
NEXTAUTH_URL="http://localhost:3000"   # Base URL
```

#### Optional
```env
# Email configuration (for contact form)
EMAIL_HOST="smtp.example.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-password"
EMAIL_TO="contact@yourdomain.com"

# Production database
DATABASE_URL="postgresql://..."        # PostgreSQL for production
```

### Prisma Configuration
```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"        // Change to "postgresql" for production
  url      = env("DATABASE_URL")
}
```

### Next.js Configuration
```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['placeholder.com', 'via.placeholder.com'],
  },
  experimental: {
    serverActions: true,
  },
}
```

## 🔄 Development Workflow

### Getting Started
```bash
# 1. Install dependencies
pnpm install

# 2. Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 3. Start development server
pnpm dev
```

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

### Build and Deploy
```bash
# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Husky for git hooks

## 📊 Performance Optimizations

### Next.js Optimizations
- Image optimization with next/image
- Font optimization with next/font
- Code splitting and lazy loading
- Static generation where possible

### Database Optimizations
- Indexed queries
- Connection pooling
- Query optimization
- Caching strategies

### Frontend Optimizations
- Component memoization
- Virtual scrolling for large lists
- Lazy loading of heavy components
- Optimized animations

## 🔍 Monitoring and Debugging

### Built-in Debug Tools
- `/api/debug` - System information
- `/api/debug-prisma` - Database status
- Console logging for development
- Error boundaries for production

### Recommended Monitoring
- Vercel Analytics (for Vercel deployments)
- Sentry for error tracking
- LogRocket for session replay
- Prisma monitoring for database

## 🚀 Deployment Guide

### Production Checklist
- [ ] Environment variables configured
- [ ] Database provider updated (PostgreSQL)
- [ ] Build successful
- [ ] Migrations deployed
- [ ] Seed data loaded
- [ ] SSL certificate configured
- [ ] Domain configured
- [ ] Monitoring setup

### Platform-Specific Notes

#### Vercel
- Automatic deployments on git push
- Built-in analytics and monitoring
- Serverless functions for API routes
- Edge runtime support

#### Railway
- Integrated PostgreSQL database
- Automatic deployments
- Environment variable management
- Built-in monitoring

#### Netlify
- Build plugins for optimization
- Form handling integration
- Branch deployments
- Analytics and A/B testing

## 📞 Support and Maintenance

### Common Issues
1. **Build Errors**: Usually TypeScript or dependency issues
2. **Database Connection**: Check DATABASE_URL format
3. **Authentication Issues**: Verify NEXTAUTH_SECRET
4. **Media Upload**: Check file permissions and storage

### Maintenance Tasks
- Regular dependency updates
- Database backup and maintenance
- Security updates
- Performance monitoring
- Content backup

### Getting Help
- Check GitHub issues
- Review documentation
- Join community discussions
- Professional support available

---

*This documentation is maintained alongside the codebase. For the latest updates, please refer to the repository.*
