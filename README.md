# BioLongevity Labs - Peptides & Bioregulators Research Platform

BioLongevity Labs is a premium, research-focused e-commerce platform built for the scientific community. It features a modern, high-performance architecture integrated with Supabase for data management and Vercel for deployment.

## 🚀 Key Features
- **Dynamic Product Catalog**: Real-time product management with Supabase.
- **Advanced Admin Dashboard**: Order tracking, sales metrics, and research-compliant management tools.
- **Premium UI/UX**: Dark-mode first design with glassmorphism and smooth animations (Framer Motion).
- **Secure Checkout**: Integrated checkout flow with support for research-compliant manual payment methods.
- **Peptide Tools**: Includes laboratory utilities like a peptide reconstitution calculator.

## 🛠 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS (v4 compatible)
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion & Lucide Icons
- **Deployment**: Vercel

## 📦 Getting Started

### 1. Environment Configuration
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Install & Run
```bash
npm install
npm run dev
```

## 🚢 Deployment (Vercel + Supabase)

### 1. Database Setup
1. Create a new project in [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the schema found in `supabase_schema.sql`.

### 2. Data Migration
To push your local product data to Supabase, run:
```bash
node scripts/migrate-to-supabase.js
```

### 3. Vercel Push
1. Push this code to a private GitHub repository.
2. Connect the repository to [Vercel](https://vercel.com).
3. Add the environment variables from step 1 in the Vercel dashboard.

## ⚖️ License
Research use only. Not for human consumption.
