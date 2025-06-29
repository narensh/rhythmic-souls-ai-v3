import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../lib/session-store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check if Google OAuth is configured
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return res.status(400).json({
      error: 'Google OAuth not configured',
      message: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required'
    });
  }

  try {
    const { method } = req;
    
    if (method === 'GET') {
      // Handle OAuth callback
      const { code, state, error } = req.query;
      
      if (error) {
        return res.redirect(`/auth?error=oauth_error&message=${encodeURIComponent(error as string)}`);
      }
      
      if (!code) {
        // Redirect to Google OAuth
        const redirectUri = `${req.headers.origin || process.env.VERCEL_URL || 'http://localhost:5000'}/api/auth/google`;
        const scope = 'openid email profile';
        const responseType = 'code';
        
        const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        googleAuthUrl.searchParams.set('client_id', clientId);
        googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
        googleAuthUrl.searchParams.set('response_type', responseType);
        googleAuthUrl.searchParams.set('scope', scope);
        googleAuthUrl.searchParams.set('state', state as string || 'default');
        
        return res.redirect(googleAuthUrl.toString());
      }
      
      // Exchange code for tokens
      const redirectUri = `${req.headers.origin || process.env.VERCEL_URL || 'http://localhost:5000'}/api/auth/google`;
      
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
      
      // Create user and session using the shared session store
      const user = {
        id: profile.id,
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        profileImageUrl: profile.picture,
        createdAt: new Date().toISOString(),
      };

      // Store user data in shared session store
      sessionStore.setUser(profile.email, user);
      
      // Create session token
      const sessionToken = sessionStore.createSession(profile.email);
      
      // Set session cookie
      res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
      
      return res.redirect('/?auth=success');
    }
    
    res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.redirect(`/auth?error=server_error&message=${encodeURIComponent('Authentication failed')}`);
  }
}