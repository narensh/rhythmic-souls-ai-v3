# Rhythmic Souls AI - Intelligent Business Solutions

## Overview

This is a full-stack web application for Rhythmic Souls AI, a company providing intelligent AI business solutions. The platform features a modern React frontend with a Node.js/Express backend, offering services ranging from conversational AI to MLOps platforms. The application includes user authentication, interactive demos, a code editor, search functionality, and comprehensive business showcasing.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Theme Support**: Custom theme context with light/dark mode switching

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage

### Component System
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Design System**: "New York" style with neutral base colors
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA-compliant components from Radix UI

## Key Components

### Authentication System
- **Provider**: Replit Auth with OIDC discovery
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTPS-only cookies, CSRF protection, secure session handling

### Database Schema
- **Users Table**: Stores user profiles from Replit Auth
- **Analytics Table**: Tracks user behavior, page views, and search queries
- **News Articles**: Content management for blog/news section
- **User Projects**: Project management for authenticated users
- **Newsletter Subscriptions**: Email subscription management
- **Testimonials**: Customer testimonials and reviews
- **Sessions**: Secure session storage for authentication

### API Services
- **OpenAI Integration**: GPT-4o-powered search and content generation
- **Analytics Tracking**: Comprehensive user behavior analytics
- **Content Management**: CRUD operations for news, projects, and testimonials
- **Newsletter Service**: Email subscription management

### Core Features
1. **Interactive Demo Platform**: Showcases AI capabilities with live examples
2. **Code Editor**: Browser-based code execution environment
3. **Intelligent Search**: OpenAI-powered search with contextual responses
4. **User Dashboard**: Personalized user experience for authenticated users
5. **Content Management**: Dynamic news, testimonials, and project showcasing

## Data Flow

### Authentication Flow
1. User clicks login → Redirected to Replit Auth
2. Successful auth → User data stored/updated in database
3. Session created with PostgreSQL storage
4. Frontend receives user data via `/api/auth/user`

### Search Flow
1. User submits query → Frontend sends POST to `/api/search`
2. Backend processes with OpenAI GPT-4o
3. Contextual response generated based on company services
4. Results returned as structured JSON with answers and related topics

### Analytics Flow
1. User interactions tracked automatically via middleware
2. Page views, search queries, and actions stored in database
3. IP geolocation and browser fingerprinting for insights
4. Dashboard aggregates data for authenticated users

### Content Flow
1. News articles fetched from `/api/news` endpoint
2. Testimonials loaded dynamically with fallback data
3. Newsletter subscriptions handled via `/api/newsletter/subscribe`
4. User projects managed through authenticated endpoints

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **openai**: GPT-4o integration for intelligent search
- **@radix-ui/react-***: Accessible UI component primitives

### Development Tools
- **Vite**: Fast build tool with React plugin
- **TypeScript**: Type safety across frontend and backend
- **Tailwind CSS**: Utility-first styling framework
- **ESLint/Prettier**: Code quality and formatting

### Authentication & Security
- **openid-client**: OIDC client for Replit Auth
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Node.js server to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OPENAI_API_KEY**: OpenAI API access for search functionality
- **SESSION_SECRET**: Secure session encryption key
- **REPLIT_DOMAINS**: Authorized domains for Replit Auth
- **ISSUER_URL**: OIDC issuer URL (defaults to Replit)

### Production Setup
- **Server**: Express serves static files and API routes
- **Database**: Neon serverless PostgreSQL with connection pooling
- **CDN**: Font Awesome and external assets loaded from CDN
- **Monitoring**: Built-in request logging and error handling

## Deployment

### Vercel Configuration
- **vercel.json**: Full-stack deployment configuration with API routes and static serving
- **Build Process**: Vite builds frontend to `dist/public`, esbuild bundles backend to `dist/index.js`
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET, REPLIT_DOMAINS required
- **Database**: PostgreSQL (Neon, Vercel Postgres, or external provider)
- **Authentication**: Replit Auth configured for production domains

### Required Environment Variables
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
SESSION_SECRET=secure-random-string
REPLIT_DOMAINS=your-domain.vercel.app
REPL_ID=your-replit-app-id
ISSUER_URL=https://replit.com/oidc
```

## Changelog
- June 28, 2025: Initial setup
- June 28, 2025: Added Vercel deployment configuration
- June 29, 2025: Fixed Google OAuth authentication system with shared session storage
- June 29, 2025: Implemented consolidated API architecture (api/[...path].ts) to resolve Vercel function limits
- June 29, 2025: Google OAuth working perfectly in development environment (Replit domain)
- June 29, 2025: Fixed ES Module imports by adding .js extensions to all relative imports for Vercel production compatibility
- June 30, 2025: Fixed path alias resolution by replacing @shared/ imports with relative paths (../shared/schema.js) for production compatibility
- June 30, 2025: Created production-optimized server (server/production.ts) to bypass Vite dependencies in Vercel deployment

## User Preferences

Preferred communication style: Simple, everyday language.