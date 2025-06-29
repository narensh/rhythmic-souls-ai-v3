import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../../lib/session-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    // Get the host from the request to determine the correct redirect URI
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const redirectUri = `${protocol}://${host}/api/auth/google`;

    const scope = 'openid email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline&prompt=consent`;

    console.log('Google OAuth redirect URI:', redirectUri);
    console.log('Google Auth URL:', authUrl);

    return res.redirect(authUrl);
  }

  if (method === 'GET' && req.query.code) {
    try {
      const { code } = req.query;
      const host = req.headers.host;
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const redirectUri = `${protocol}://${host}/api/auth/google`;

      // Exchange code for tokens
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

      const tokens = await tokenResponse.json();

      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', tokens);
        return res.status(400).json({ error: 'Failed to exchange code for tokens', details: tokens });
      }

      // Get user info from Google
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        console.error('Failed to get user data:', userData);
        return res.status(400).json({ error: 'Failed to get user data from Google' });
      }

      // Store user data and create session
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

      // Set session cookie
      res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`);

      // Redirect to home page
      return res.redirect('/');
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.status(500).json({ error: 'Authentication failed', message: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}