# Creative Portfolio - Next.js

A modern professional portfolio built with Next.js 15, Prisma, SQLite and Tailwind CSS.

## 🚀 Features

- ✅ Modern and responsive design
- ✅ Project categorization system (Film, Design, Illustration, Architecture, Fine Art, Advertising)
- ✅ Complete admin dashboard
- ✅ Authentication system
- ✅ Media upload and management
- ✅ Vimeo video support
- ✅ Contact system
- ✅ Customizable typography (10 Google Fonts)
- ✅ SQLite database (development) / PostgreSQL/MySQL (production)

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Prisma ORM, SQLite (dev), PostgreSQL/MySQL (prod)
- **Animations**: Framer Motion
- **Forms**: React Hook Form, Zod
- **Deployment**: Vercel, Netlify, or any Node.js platform

## 📦 Installation

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd portfolio_filmes
\`\`\`

### 2. Install dependencies
\`\`\`bash
pnpm install
# or
npm install
# or
yarn install
\`\`\`

### 3. Configure environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit the \`.env.local\` file with your configurations.

### 4. Setup database
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed
\`\`\`

### 5. Run the project
\`\`\`bash
pnpm dev
# or
npm run dev
\`\`\`

Access \`http://localhost:3000\`

## 🔑 Default Credentials

After running the seed:
- **Email**: admin@portfolio.com
- **Password**: Admin123!

## 🚀 Deployment

### Vercel + Neon DB (Recommended)

1. **Create Neon Database**:
   - Go to [https://console.neon.tech](https://console.neon.tech)
   - Create a new project
   - Copy the connection string

2. **Prepare project for production**:
\`\`\`bash
npm run build
\`\`\`

3. **Prisma schema is already configured for PostgreSQL (Neon)**:
\`\`\`prisma
// Already configured in prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Configure environment variables:
     - `DATABASE_URL`: Your Neon database connection string
     - `NEXTAUTH_SECRET`: Random secret key (generate with `openssl rand -base64 32`)
     - `NEXTAUTH_URL`: Your production site URL

5. **Run production migrations**:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Alternative: Other Providers

For other providers (Netlify, Railway, DigitalOcean, etc.):

1. Create Neon database at [console.neon.tech](https://console.neon.tech)
2. Configure environment variables with Neon connection string
3. Run build: `npm run build`
3. Run migrations: \`npx prisma migrate deploy\`
4. Run seed: \`npx prisma db seed\`
5. Start server: \`npm start\`

## 📁 Project Structure

\`\`\`
portfolio_filmes/
├── app/                    # Next.js 15 pages (App Router)
│   ├── admin/             # Admin dashboard
│   ├── api/               # API Routes
│   ├── auth/              # Authentication pages
│   └── project/           # Project pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utilities and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static files
└── styles/               # Global styles
\`\`\`

## 🎨 Project Categories

The system supports 6 main categories:
- **Film project** (default)
- **Graphic Design Project**
- **Illustration project**
- **Architecture Project**
- **Small fine art project**
- **Advertising project**

## 📝 Available Scripts

\`\`\`bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # Linting
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio
\`\`\`

## 🔧 Production Configuration

### Neon Database Setup

The project is already configured for Neon PostgreSQL:

1. **Schema is ready**:
\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

2. **Configure Neon database URL**:
\`\`\`
DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
\`\`\`

3. **Run migrations**:
\`\`\`bash
npx prisma migrate deploy
\`\`\`

### Production Environment Variables

\`\`\`env
DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secure-secret-key"
NODE_ENV="production"
\`\`\`

## 🐛 Troubleshooting

### Common Issues

1. **Database connection error**: Check \`DATABASE_URL\`
2. **Build error**: Run \`npx prisma generate\`
3. **Type errors**: Run \`npm run build\` to check

### Reset Database

If you need to reset the database:
\`\`\`bash
npx prisma migrate reset
npx prisma db seed
\`\`\`

## 📄 License

This project is under the MIT license.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, open an issue in the repository or contact through the website's contact form.
