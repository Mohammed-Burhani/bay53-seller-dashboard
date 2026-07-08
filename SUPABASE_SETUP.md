# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in the project details and click "Create new project"
4. Wait for your project to provision (this can take a few minutes)

## 2. Get Your Credentials

1. In your Supabase project dashboard, go to **Project Settings → API**
2. Copy the following values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **service_role secret**: `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 4. Set Up Database Schema

### Option 1: Run SQL via Supabase Dashboard
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the content from `supabase/migrations/001-initial-schema.sql`
4. Click "Run" to execute the SQL

### Option 2: Use Migration Tools
You can also use Supabase CLI or other migration tools to apply the schema.

## 5. Configure Authentication (Optional)

By default, Supabase enables email/password authentication. You may want to:
- Enable email confirmation
- Set up custom SMTP
- Configure social logins
- Set up redirect URLs in **Authentication → URL Configuration**

## 6. Test the Application

Start your development server:
```bash
npm run dev
```

Now you can:
- Visit `/seller/auth/register` to create a new seller account
- Visit `/seller/auth/login` to sign in
- Access the dashboard at `/seller/dashboard`

## Next Steps

Once authentication is set up, you can start implementing other modules like:
- Products management
- Orders management
- Inventory tracking
- Etc.
