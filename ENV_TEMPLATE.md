# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# 3D Model Integration (Nira)
NEXT_PUBLIC_NIRA_API_KEY=your-nira-api-key
NEXT_PUBLIC_NIRA_MODEL_URL=https://app.nira.app/embed/your-model-id

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=Louis Amy AE Studio <noreply@louisamy.com>

# Production URL (for absolute links in emails)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_3D_MODELS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS=false
```

## Supabase Setup Instructions

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy the project URL and anon key from Settings > API

2. **Database Schema:**
   ```sql
   -- Create proposals table
   CREATE TABLE proposals (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     token VARCHAR(255) UNIQUE NOT NULL,
     project_data JSONB NOT NULL,
     client_name VARCHAR(255),
     client_email VARCHAR(255),
     status VARCHAR(50) DEFAULT 'draft',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     viewed_at TIMESTAMP WITH TIME ZONE,
     selected_option VARCHAR(1),
     notes TEXT
   );

   -- Create proposal_views table for analytics
   CREATE TABLE proposal_views (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
     viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     ip_address INET,
     user_agent TEXT,
     duration_seconds INTEGER
   );

   -- Create projects table for saving calculations
   CREATE TABLE projects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     project_data JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );

   -- Add RLS policies
   ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE proposal_views ENABLE ROW LEVEL SECURITY;
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

   -- Allow public read access to proposals via token
   CREATE POLICY "Proposals are viewable by token" ON proposals
     FOR SELECT USING (true);

   -- Allow inserting proposal views
   CREATE POLICY "Anyone can log proposal views" ON proposal_views
     FOR INSERT WITH CHECK (true);
   ```

3. **Configure Authentication (Optional):**
   - Enable email authentication for admin access
   - Set up Google OAuth for team members

## 3D Model Integration

1. **Nira Setup:**
   - Contact Nira team for API access
   - Upload your 3D models to Nira platform
   - Get the embed URL for each model
   - Configure CORS settings for your domain

2. **Implementation Notes:**
   - Models are embedded via iframe
   - Ensure responsive sizing for mobile
   - Add loading states and fallbacks
   - Consider bandwidth on mobile devices

## Email Configuration

1. **Gmail Setup (Development):**
   - Enable 2-factor authentication
   - Generate app-specific password
   - Use smtp.gmail.com with port 587

2. **Production Options:**
   - SendGrid
   - Postmark
   - Amazon SES
   - Resend

## Feature Flags

Control which features are enabled:
- `NEXT_PUBLIC_ENABLE_3D_MODELS`: Show/hide 3D model integration
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable/disable tracking
- `NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS`: Toggle email sending
