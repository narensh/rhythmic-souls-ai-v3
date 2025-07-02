// Development handler for Vercel API functions
import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { databaseSessionStore } from '../lib/database-session-store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handler for development API routes
export async function handleDevAPIRoute(req: Request, res: Response, apiPath: string) {
  try {
    // Convert Express request/response to Vercel format
    const vercelReq = {
      ...req,
      query: { ...req.query, ...req.params },
      method: req.method,
      headers: req.headers,
      body: req.body,
      url: req.url,
    };

    const vercelRes = {
      status: (code: number) => {
        res.status(code);
        return vercelRes;
      },
      json: (data: any) => {
        res.json(data);
        return vercelRes;
      },
      redirect: (code: number | string, url?: string) => {
        if (typeof code === 'string') {
          res.redirect(code);
        } else {
          res.redirect(code, url || '');
        }
        return vercelRes;
      },
      setHeader: (name: string, value: string) => {
        res.setHeader(name, value);
        return vercelRes;
      },
    };

    // Handle API routes directly (since we removed separate API files)
    await handleAPIRoute(vercelReq, vercelRes, apiPath);
  } catch (error) {
    console.error(`Error handling API route ${apiPath}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Consolidated API route handler
async function handleAPIRoute(req: any, res: any, route: string) {
  var originalRoute = route;
  if (originalRoute && originalRoute.length > 0) {
   route = originalRoute.split('?')[0];
  }

  // Health check
  if (route === 'health') {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: 'development',
      route: route
    });
  }

  // Google OAuth
  if (route === 'auth/google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: 'Google OAuth not configured',
        message: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required'
      });
    }

    if (req.method === 'GET') {
      const host = req.headers.host;
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const redirectUri = `${protocol}://${host}/api/auth/google`;
      const scope = 'openid email profile';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline&prompt=consent`;

      if (req.query.code) {
        // Handle OAuth callback
        try {
          const { code } = req.query;
          
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              code: code as string,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri,
            }),
          });

          const tokens = await tokenResponse.json();
          if (!tokenResponse.ok) {
            return res.status(400).json({ error: 'Failed to exchange code for tokens' });
          }

          const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
          const userData = await userResponse.json();

          await databaseSessionStore.setUser(userData.email, {
            id: userData.id,
            email: userData.email,
            firstName: userData.given_name,
            lastName: userData.family_name,
            profileImageUrl: userData.picture,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          });

          const sessionToken = await databaseSessionStore.createSession(userData.email);
          res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
          return res.redirect('/');
        } catch (error) {
          console.error('OAuth error:', error);
          return res.status(500).json({ error: 'Authentication failed' });
        }
      }

      return res.redirect(authUrl);
    }
  }

  // User authentication
  if (route === 'auth/user') {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const cookies = databaseSessionStore.parseCookies(req.headers.cookie);
      const sessionToken = cookies.session;

      if (!sessionToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const session = await databaseSessionStore.validateSession(sessionToken);
      if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await databaseSessionStore.getUser(session.email);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      return res.status(200).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Logout
  if (route === 'auth/logout') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const cookies = databaseSessionStore.parseCookies(req.headers.cookie);
    const sessionToken = cookies.session;

    if (sessionToken) {
      await databaseSessionStore.deleteSession(sessionToken);
    }

    res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // Mock data for development
  if (route === 'news') {
    return res.status(200).json([
      {
        id: 1,
        title: "The Future of Conversational AI in Business",
        content: "Explore how conversational AI is transforming customer interactions...",
        category: "AI Technology",
        author: "Dr. Sarah Chen",
        createdAt: new Date().toISOString(),
        published: true
      }
    ]);
  }

  if (route === 'testimonials') {
    return res.status(200).json([
      {
        id: 1,
        name: "Sarah Johnson",
        title: "CTO at TechStart",
        content: "Rhythmic Souls AI transformed our customer service operations...",
        rating: 5,
        featured: true,
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // Debug endpoint to check environment and routing
  if (route === 'debug-oauth') {
    return res.status(200).json({
      route: route,
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      environment: process.env.NODE_ENV || 'unknown',
      host: req.headers.host,
      protocol: req.headers['x-forwarded-proto'] || 'http',
      originalUrl: req.originalUrl || req.url,
      method: req.method
    });
  }

  // Debug session endpoint
  if (route === 'debug/session') {
    try {
      const cookies = databaseSessionStore.parseCookies(req.headers.cookie);
      const sessionToken = cookies.session;
      
      const debugInfo = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        host: req.headers.host,
        protocol: req.headers['x-forwarded-proto'] || 'http',
        hasCookieHeader: !!req.headers.cookie,
        cookieHeader: req.headers.cookie ? req.headers.cookie.substring(0, 100) + '...' : null,
        hasSessionToken: !!sessionToken,
        sessionTokenLength: sessionToken ? sessionToken.length : 0,
        hasDatabase: !!process.env.DATABASE_URL,
      };

      if (sessionToken) {
        try {
          const session = await databaseSessionStore.validateSession(sessionToken);
          debugInfo.sessionValid = !!session;
          if (session) {
            debugInfo.sessionEmail = session.email;
            debugInfo.sessionCreated = session.createdAt;
            debugInfo.lastActivity = session.lastActivity;
          }
        } catch (error) {
          debugInfo.sessionError = error.message;
        }
      }

      return res.status(200).json(debugInfo);
    } catch (error) {
      return res.status(500).json({
        error: 'Debug failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(404).json({ error: 'Route not found', route });
}