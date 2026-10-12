# E-Commerce Platform - Installation & Setup Guide

## System Requirements

- **Node.js**: v18+ (Download from https://nodejs.org/)
- **npm**: v9+ (comes with Node.js)
- **PostgreSQL**: v12+ (Download from https://www.postgresql.org/)
- **Redis**: Optional but recommended (Download from https://redis.io/)
- **Git**: For cloning the repository

## Check System Requirements

```bash
node --version
npm --version
```

## Installation Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/patilanuja678-dev/ecommerce-platform.git
cd ecommerce-platform
```

### Step 2: Install Root Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd apps/api
npm install express cors helmet morgan cookie-parser dotenv @prisma/client bcryptjs jsonwebtoken nodemailer express-rate-limit redis stripe razorpay zod
npm install --save-dev typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs @types/cookie-parser @types/morgan tsx eslint vitest prisma
```

### Step 4: Install Frontend Dependencies

```bash
cd ../web
npm install react react-dom react-router-dom zustand axios
npm install --save-dev typescript @types/react @types/react-dom @vitejs/plugin-react vite tailwindcss postcss autoprefixer eslint
cd ../..
```

### Step 5: Create Environment Files

#### Backend Environment (.env in apps/api)
```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce"

# JWT
JWT_ACCESS_SECRET="your_access_secret_key_here"
JWT_REFRESH_SECRET="your_refresh_secret_key_here"

# Payment Gateway
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# App
CLIENT_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3001

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

#### Frontend Environment (.env in apps/web)
```bash
VITE_API_URL="http://localhost:3001/api"
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

### Step 6: Setup Database

#### Start PostgreSQL (if not running)
```bash
# On macOS with Homebrew
brew services start postgresql

# On Windows
# Start PostgreSQL from Services or Command Prompt

# On Linux
sudo systemctl start postgresql
```

#### Generate Prisma Client
```bash
cd apps/api
npx prisma generate
```

#### Run Database Migrations
```bash
npx prisma migrate dev --name init
```

#### Seed Database (Sample Data)
```bash
npx prisma db seed
```

### Step 7: Start Development Servers

#### Terminal 1 - Backend API (port 3001)
```bash
cd apps/api
npm run dev
```

#### Terminal 2 - Frontend App (port 3000)
```bash
cd apps/web
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health

## Demo Credentials

**Admin Account:**
- Email: `admin@brand.com`
- Password: `Admin@123`

**Demo Products:**
- Aurora Smartwatch Pro - ₹24,999
- Nova Air True Wireless - ₹14,999

## Build for Production

### Backend Build
```bash
cd apps/api
npm run build
npm start
```

### Frontend Build
```bash
cd apps/web
npm run build
npm run preview
```

## Common Commands

### Prisma Commands
```bash
# View database in Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Linting
```bash
cd apps/api
npm run lint

cd apps/web
npm run lint
```

### Testing
```bash
cd apps/api
npm run test
```

## Troubleshooting

### PostgreSQL Connection Error
```bash
# Verify PostgreSQL is running
psql -U postgres

# Check DATABASE_URL in .env
# Default: postgresql://postgres:postgres@localhost:5432/ecommerce
```

### Port Already in Use
```bash
# Backend (port 3001)
lsof -i :3001
kill -9 <PID>

# Frontend (port 3000)
lsof -i :3000
kill -9 <PID>
```

### Clear Node Modules and Reinstall
```bash
# Backend
cd apps/api
rm -rf node_modules package-lock.json
npm install

# Frontend
cd apps/web
rm -rf node_modules package-lock.json
npm install
```

### Prisma Migration Issues
```bash
cd apps/api
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

## Environment Variables Checklist

- [ ] DATABASE_URL set correctly
- [ ] JWT_ACCESS_SECRET is random and secure
- [ ] JWT_REFRESH_SECRET is random and secure
- [ ] RAZORPAY_KEY_ID added
- [ ] RAZORPAY_KEY_SECRET added
- [ ] CLIENT_URL points to frontend
- [ ] VITE_API_URL points to backend

## Project Structure

```
ecommerce-platform/
├── apps/
│   ├── api/                 # Backend (Express + Node.js)
│   │   ├── src/
│   │   │   ├── routes/      # API routes
│   │   │   ├── services/    # Business logic
│   │   │   ├── controllers/ # Request handlers
│   │   │   ├── validators/  # Input validation
│   │   │   ├── config/      # Configuration
│   │   │   └── server.ts    # Entry point
│   │   ├── package.json
│   │   └── .env             # Environment variables
│   │
│   └── web/                 # Frontend (React + Vite)
│       ├── src/
│       │   ├── pages/       # Page components
│       │   ├── components/  # Reusable components
│       │   ├── store/       # Zustand stores
│       │   ├── lib/         # Utilities
│       │   └── App.tsx      # Root component
│       ├── package.json
│       └── .env             # Environment variables
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
│
└── package.json             # Monorepo root
```

## Next Steps

1. Complete all installation steps
2. Set up environment variables
3. Start PostgreSQL
4. Run database migrations
5. Start both servers
6. Access http://localhost:3000
7. Login with admin credentials
8. Explore the application

## Support & Documentation

- **Prisma Docs**: https://www.prisma.io/docs/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Razorpay Docs**: https://razorpay.com/docs/

## License

MIT

## Author

patilanuja678-dev
