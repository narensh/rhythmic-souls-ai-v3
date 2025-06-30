import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../../lib/session-store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

        if (tokenData.error) {
          return res.status(400).json({ error: 'OAuth token exchange failed', details: tokenData });
        }

        // Get user info from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        const userData = await userResponse.json();

        if (userData.error) {
          return res.status(400).json({ error: 'Failed to get user info', details: userData });
        }

        // Create session
        const sessionToken = sessionStore.createSession(userData.email);
        sessionStore.setUser(userData.email, {
          id: userData.id,
          email: userData.email,
          firstName: userData.given_name,
          lastName: userData.family_name,
          profileImageUrl: userData.picture,
        });

        // Set session cookie
        res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${protocol === 'https' ? '; Secure' : ''}`);
        
        // Redirect to home page
        return res.redirect(302, '/');
      } catch (error) {
        console.error('OAuth callback error:', error);
        return res.status(500).json({ error: 'OAuth authentication failed' });
      }
    } else {
      // Redirect to Google OAuth
      return res.redirect(302, authUrl);
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}