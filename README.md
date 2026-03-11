# TransactionTracker: Financial Transfer Management

A modern, high-fidelity React application for tracking cross-border financial transactions. 

## Features
- **Secure Authentication**: Power by Supabase Auth.
- **Transaction Management**: Create and manage detailed transfer logs.
- **Live Lifecycle Tracking**: Shareable visual timeline of the transfer journey.
- **Real-time Updates**: Instant status changes via Supabase Realtime.
- **Modern Fintech UI**: Designed after Stripe, Mercury, and Linear.

## Tech Stack
- React 18, TypeScript, Tailwind CSS
- Lucide React (Icons), Framer Motion (Animations)
- Supabase (PostgreSQL, Auth, Realtime)

## Setup Instructions

### 1. Supabase Backend
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL provided in `setup_db.sql` in the SQL Editor.
3. Obtain your `Project URL` and `anon key` from Project Settings > API.

### 2. Frontend Configuration
1. Clone this project.
2. Create a `.env.local` file in the root:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Install dependencies:
   ```bash
   npm install @supabase/supabase-js lucide-react framer-motion react-router-dom react-hot-toast clsx tailwind-merge date-fns
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/components`: UI components (common, layout, transactions).
- `src/pages`: Main application views (Dashboard, Track, Create).
- `src/lib`: Supabase client configuration.
- `src/services`: Encapsulated API logic.
- `src/types`: TypeScript interfaces.
