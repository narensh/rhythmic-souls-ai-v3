import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../lib/session-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  let route = Array.isArray(path) ? path.join('/') : path || '';
  
  // Remove query parameters from route matching
  route = route.split('?')[0];

  console.log('Consolidated API handler called - Method:', req.method, 'Route:', route, 'Path:', path, 'URL:', req.url);

  try {
    // Auth routes
    if (route === 'auth/google') {
      return await handleGoogleAuth(req, res);
    }
    if (route === 'auth/login') {
      return await handleLogin(req, res);
    }
    if (route === 'auth/register') {
      return await handleRegister(req, res);
    }
    if (route === 'auth/user') {
      return await handleUser(req, res);
    }
    if (route === 'logout') {
      return await handleLogout(req, res);
    }

    // Content routes
    if (route === 'news') {
      return await handleNews(req, res);
    }
    if (route === 'testimonials') {
      return await handleTestimonials(req, res);
    }
    if (route === 'dashboard') {
      return await handleDashboard(req, res);
    }
    if (route === 'test') {
      return await handleTest(req, res);
    }
    if (route === 'debug-oauth') {
      return await handleDebugOAuth(req, res);
    }

    return res.status(404).json({ error: 'Route not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Google OAuth handler
async function handleGoogleAuth(req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return res.status(400).json({
      error: 'Google OAuth not configured',
      message: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required'
    });
  }

  const { method } = req;
  
  if (method === 'GET') {
    const { code, state, error } = req.query;
    
    if (error) {
      return res.redirect(`/auth?error=oauth_error&message=${encodeURIComponent(error as string)}`);
    }
    
    if (!code) {
      // Redirect to Google OAuth
      const host = req.headers.host || 'localhost:5000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      
      // For development, use a consistent redirect URI that's registered in Google Cloud Console
      let redirectUri;
      if (host.includes('localhost')) {
        redirectUri = 'http://localhost:5000/api/auth/google';
      } else if (host.includes('replit.dev')) {
        // Use the current Replit dev URL - this needs to be registered in Google Cloud Console
        redirectUri = `${protocol}://${host}/api/auth/google`;
      } else {
        // Production
        redirectUri = `${protocol}://${host}/api/auth/google`;
      }
      const scope = 'openid email profile';
      const responseType = 'code';
      
      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      googleAuthUrl.searchParams.set('client_id', clientId);
      googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
      googleAuthUrl.searchParams.set('response_type', responseType);
      googleAuthUrl.searchParams.set('scope', scope);
      googleAuthUrl.searchParams.set('state', state as string || 'default');
      
      console.log('Google OAuth redirect URI being used:', redirectUri);
      console.log('Host detected:', host, 'Protocol:', protocol);
      
      return res.redirect(googleAuthUrl.toString());
    }
    
    // Exchange code for tokens
    const host = req.headers.host || 'localhost:5000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/google`;
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      return res.redirect(`/auth?error=token_error&message=${encodeURIComponent(tokenData.error_description || 'Failed to get access token')}`);
    }
    
    // Get user profile
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    const profile = await profileResponse.json();
    
    if (!profileResponse.ok) {
      return res.redirect(`/auth?error=profile_error&message=${encodeURIComponent('Failed to get user profile')}`);
    }
    
    // Create user and session
    const user = {
      id: profile.id,
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      profileImageUrl: profile.picture,
      createdAt: new Date().toISOString(),
    };

    sessionStore.setUser(profile.email, user);
    const sessionToken = sessionStore.createSession(profile.email);
    
    res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
    return res.redirect('/?auth=success');
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}

// Login handler
async function handleLogin(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user exists
  const user = sessionStore.getUser(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create session
  const sessionToken = sessionStore.createSession(email);
  
  // Set session cookie
  res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
  
  return res.status(200).json({ 
    message: 'Login successful',
    user: { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName 
    }
  });
}

// Register handler
async function handleRegister(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user already exists
  const existingUser = sessionStore.getUser(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create new user
  const user = {
    id: Date.now().toString(),
    email,
    password,
    firstName: firstName || '',
    lastName: lastName || '',
    createdAt: new Date().toISOString(),
  };

  sessionStore.setUser(email, user);
  
  // Create session
  const sessionToken = sessionStore.createSession(email);
  
  // Set session cookie
  res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
  
  return res.status(201).json({ 
    message: 'Registration successful',
    user: { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName 
    }
  });
}

// User handler
async function handleUser(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const cookies = parseCookies(req.headers.cookie);
  const sessionToken = cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const session = sessionStore.validateSession(sessionToken);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = sessionStore.getUser(session.email);
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
}

// Logout handler
async function handleLogout(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0');
  return res.status(200).json({ message: 'Logged out successfully' });
}

// News handler
async function handleNews(req: VercelRequest, res: VercelResponse) {
  const mockNews = [
    {
      id: 1,
      title: "The Future of Conversational AI in Business",
      excerpt: "Exploring how advanced conversational AI is transforming customer service and business operations across industries.",
      content: "As businesses continue to evolve in the digital age, conversational AI has emerged as a game-changing technology...",
      author: "Rhythmic Souls AI Team",
      publishedAt: "2025-06-25T10:00:00Z",
      category: "AI Technology",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "MLOps Best Practices for Enterprise Deployment",
      excerpt: "A comprehensive guide to implementing MLOps practices that ensure reliable and scalable machine learning deployments.",
      content: "Machine Learning Operations (MLOps) has become essential for organizations looking to deploy AI solutions at scale...",
      author: "Rhythmic Souls AI Team", 
      publishedAt: "2025-06-20T14:30:00Z",
      category: "MLOps",
      readTime: "8 min read"
    }
  ];

  return res.status(200).json(mockNews);
}

// Testimonials handler
async function handleTestimonials(req: VercelRequest, res: VercelResponse) {
  const mockTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "CTO, TechCorp Solutions",
      company: "TechCorp Solutions",
      content: "Rhythmic Souls AI transformed our customer service operations. Their conversational AI solution reduced response times by 75% while maintaining high customer satisfaction.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Head of Operations, DataFlow Inc",
      company: "DataFlow Inc",
      content: "The MLOps platform provided by Rhythmic Souls AI streamlined our entire machine learning pipeline. We saw a 60% improvement in deployment efficiency.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return res.status(200).json(mockTestimonials);
}

// Dashboard handler
async function handleDashboard(req: VercelRequest, res: VercelResponse) {
  const mockDashboard = {
    analytics: {
      totalUsers: 1250,
      activeProjects: 48,
      apiCalls: 15420,
      successRate: 98.5
    },
    recentActivity: [
      {
        id: 1,
        type: "deployment",
        message: "New conversational AI model deployed",
        timestamp: "2025-06-29T10:30:00Z"
      },
      {
        id: 2,
        type: "user",
        message: "New enterprise client onboarded",
        timestamp: "2025-06-29T09:15:00Z"
      }
    ]
  };

  return res.status(200).json(mockDashboard);
}

// Test handler
async function handleTest(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    method: req.method,
    host: req.headers.host 
  });
}

// Debug OAuth handler
async function handleDebugOAuth(req: VercelRequest, res: VercelResponse) {
  const host = req.headers.host || 'localhost:5000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  let redirectUri;
  if (host.includes('localhost')) {
    redirectUri = 'http://localhost:5000/api/auth/google';
  } else if (host.includes('replit.dev')) {
    redirectUri = `${protocol}://${host}/api/auth/google`;
  } else {
    redirectUri = `${protocol}://${host}/api/auth/google`;
  }
  
  return res.status(200).json({ 
    message: 'OAuth Debug Info',
    host: host,
    protocol: protocol,
    redirectUri: redirectUri,
    environmentDomain: process.env.REPLIT_DOMAINS,
    timestamp: new Date().toISOString()
  });
}

// Utility function
function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}