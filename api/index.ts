import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../lib/session-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract the path from the URL
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  let route = url.pathname.replace(/^\/api\//, '');
  
  console.log('API handler called - Method:', req.method, 'Route:', route, 'URL:', req.url);

  // Health check
  if (route === '' || route === 'index') {
    return res.status(200).json({
      status: 'healthy',
      message: 'API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? 'production' : 'development'
    });
  }

  // Google OAuth
  if (route === 'auth/google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: 'Google OAuth not configured'
      });
    }

    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
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

        sessionStore.setUser(userData.email, {
          id: userData.id,
          email: userData.email,
          firstName: userData.given_name,
          lastName: userData.family_name,
          profileImageUrl: userData.picture,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        });

        const sessionToken = sessionStore.createSession(userData.email);
        res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`);
        return res.redirect('/');
      } catch (error) {
        console.error('OAuth error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
      }
    }

    return res.redirect(authUrl);
  }

  return res.status(404).json({ error: 'Route not found', route });
}