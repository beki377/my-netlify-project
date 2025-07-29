# Server Management Dashboard

A modern server management dashboard with persistent data storage using Supabase.

## 🚀 Quick Setup

### 1. Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub or email
4. Create a new project

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**

### 3. Configure Environment Variables
1. Open the `.env` file in this project
2. Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Run Database Migration
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/migrations/20250703021023_crimson_canyon.sql`
3. Paste and run the SQL to create tables and default data

### 5. Start the Application
```bash
npm run dev
```

## ✅ Verification

Once connected, you should see:
- "Database Connected" in the status bar
- All server data loads from the database
- Changes persist across browser sessions
- Data is shared when you share the URL

## 🔧 Features

- **Persistent Data**: All changes saved to Supabase database
- **Real-time Sync**: Data shared across all users
- **Admin Controls**: Login with password "Beki123"
- **Environment Management**: Separate UAT and Production servers
- **Search & Filter**: Find servers quickly
- **Offline Support**: Works offline with local caching

## 🛠️ Admin Features

- Add new servers
- Edit server details (IP, port, name)
- Delete servers
- Reset to default configuration
- Ping and Telnet functionality

## 🔒 Security

- Row Level Security (RLS) enabled
- Public read/write policies for demo purposes
- In production, implement proper authentication

## 📱 Responsive Design

- Mobile-friendly interface
- Touch-optimized controls
- Adaptive layouts for all screen sizes