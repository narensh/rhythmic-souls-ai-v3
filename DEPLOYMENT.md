# Vercel Deployment Guide for Rhythmic Souls AI

This guide explains how to deploy the Rhythmic Souls AI application to Vercel.

## Git Author Configuration Fix

If you see "A commit author is required" error during deployment, configure Git first:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Then commit and push your changes:
```bash
git add .
git commit -m "Initial deployment setup"
git push origin main
```

## Prerequisites

1. A Vercel account (https://vercel.com)
2. Git repository hosted on GitHub, GitLab, or Bitbucket
3. Environment variables configured

## Required Environment Variables

**For Basic Deployment (Current Setup):**
No environment variables are required for the basic deployment. The app will work with mock data.

**Authentication System:** Complete authentication with multiple methods:
- Email/password registration and login forms
- Google OAuth integration (fully configured)
- Session-based authentication with HTTP-only cookies  
- Shared session storage across all auth methods
- Proper user management and session handling

**API Routes (Vercel Compatible):**
- `/api/auth/login` - Email/password login
- `/api/auth/register` - User registration  
- `/api/auth/user` - Get current user session
- `/api/auth/google` - Google OAuth (fully functional)
- `/api/logout` - Clear session and logout
- `/api/news.ts` - Serves news articles
- `/api/testimonials.ts` - Serves customer testimonials
- `/api/dashboard.ts` - Serves dashboard data

**Google OAuth Setup:**
To enable Google authentication, add these redirect URIs in Google Cloud Console:
- Development (localhost): `http://localhost:5000/api/auth/google`
- Development (Replit): `https://ce9f20fc-852d-4f58-bead-167cd299e38c-00-213uay6x6sse5.kirk.replit.dev/api/auth/google`
- Production: `https://v3.rhythmicsouls.ai/api/auth/google`

**Note:** The Replit development URL changes periodically. If you encounter `redirect_uri_mismatch` errors, check the current Replit URL and update it in Google Cloud Console.

**Vercel Free Plan Optimization:**
Created a consolidated API handler (`api/[...path].ts`) that manages all routes internally, reducing serverless function count from 13 to 1. This eliminates Vercel's 12-function limit issue on the Hobby plan while maintaining full API functionality.

**For Full Functionality (Optional):**
Set these environment variables in your Vercel project settings:

```bash
# Database Configuration (Optional - for production data)
DATABASE_URL=your_postgresql_connection_string

# OpenAI Integration (Optional - for search functionality)
OPENAI_API_KEY=your_openai_api_key

# Session Security (Optional - for authentication)
SESSION_SECRET=your_secure_random_string

# Replit Auth Configuration (Optional - for user login)
REPLIT_DOMAINS=your-vercel-domain.vercel.app
REPL_ID=your_replit_app_id
ISSUER_URL=https://replit.com/oidc
```

## Deployment Steps

### 1. Prepare Your Repository

1. Ensure all files are committed to your Git repository
2. Push your code to GitHub/GitLab/Bitbucket

### 2. Connect to Vercel

1. Log in to your Vercel dashboard
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect the framework

### 3. Configure Build Settings

Vercel should automatically detect the configuration from `vercel.json`, but verify these settings:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 4. Set Environment Variables

In your Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add all the required environment variables listed above
3. Make sure to set them for "Production", "Preview", and "Development" environments

### 5. Deploy

1. Click "Deploy" to start the first deployment
2. Vercel will build and deploy your application
3. You'll get a live URL once deployment completes

## Database Setup

### Option 1: Neon (Recommended)
```bash
# Get connection string from Neon console
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
```

### Option 2: Vercel Postgres
```bash
# Enable Vercel Postgres addon in your project
# Vercel will automatically set DATABASE_URL
```

### Option 3: External PostgreSQL
```bash
# Use any PostgreSQL provider (AWS RDS, Digital Ocean, etc.)
DATABASE_URL=postgresql://username:password@host:port/database
```

## Configuration Files

The following files are already configured for Vercel deployment:

### vercel.json
- Defines build configuration
- Sets up API routes
- Configures static file serving

### .vercelignore
- Excludes unnecessary files from deployment
- Reduces deployment size

## Post-Deployment Steps

1. **Test the Application**: Visit your Vercel URL and test all functionality
2. **Check Logs**: Monitor the Vercel function logs for any errors
3. **Database Migration**: Run database migrations if needed:
   ```bash
   npm run db:push
   ```

## Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Update `REPLIT_DOMAINS` environment variable to include your custom domain
4. Configure DNS records as instructed by Vercel

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are listed in package.json

2. **Database Connection Issues**
   - Ensure DATABASE_URL is correctly formatted
   - Check database allows connections from Vercel's IP ranges

3. **Authentication Issues**
   - Verify REPLIT_DOMAINS matches your Vercel domain
   - Check REPL_ID and SESSION_SECRET are set

4. **API Route Issues**
   - Ensure API routes are working locally first
   - Check Vercel function logs for errors

### Monitoring

1. **Vercel Analytics**: Enable in project settings for traffic insights
2. **Function Logs**: Monitor API performance and errors
3. **Error Tracking**: Consider integrating Sentry or similar service

## Environment-Specific Notes

### Development
- Use preview deployments for testing
- Environment variables can be different for preview branches

### Production
- Use production environment variables
- Monitor performance and usage
- Set up alerts for downtime

## Support

For deployment issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review function logs in Vercel dashboard
3. Test locally first to isolate issues

## Security Considerations

1. **Never commit sensitive environment variables to Git**
2. **Use strong SESSION_SECRET values**
3. **Rotate API keys regularly**
4. **Enable HTTPS-only cookies in production**
5. **Review Vercel security best practices**