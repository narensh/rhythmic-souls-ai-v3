import { VercelRequest, VercelResponse } from '@vercel/node';
import { databaseSessionStore } from '../../../lib/database-session-store.js';

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
              const params = new URLSearchParams();
              params.append('client_id', clientId);
              params.append('client_secret', clientSecret);
              if (Array.isArray(code)) {
                  params.append('code', code[0]);
              } else {
                  params.append('code', code);
              }
              params.append('grant_type', 'authorization_code');
              params.append('redirect_uri', redirectUri);

              const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body: params.toString()
              });

              if (!tokenResponse.ok) {
                  const error = await tokenResponse.json().catch(() => ({}));
                  console.error('Token exchange failed:', error);
                  return res.status(400).json({
                      error: 'Failed to exchange code for tokens',
                      details: error
                  });
              }
              const tokens = await tokenResponse.json() as {
                access_token: string;
                refresh_token?: string;
                expires_in: number;
                token_type: string;
                id_token: string;
              };

              console.log("Access token received:", tokens.access_token);
              const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
              const userData = await userResponse.json();
              // Store user data in session
              const sessionData = {
                  id: userData.id,
                  email: userData.email,
                  firstName: userData.given_name,
                  lastName: userData.family_name,
                  profileImageUrl: userData.picture,
                  accessToken: tokens.access_token,
                  refreshToken: tokens.refresh_token,
              };
              // Store user in database session store
              await databaseSessionStore.setUser(userData.email, sessionData);
              console.log("User data set in session store:", userData);
              // Create and set session cookie
              const cookies = databaseSessionStore.parseCookies(req.headers.cookie);
              var sessionToken = cookies.session;
              sessionToken = await databaseSessionStore.createSession(userData.email, sessionToken);
              console.log("creating session in db for user", userData.email, "session token:", sessionToken);
              const protocol = req.headers['x-forwarded-proto'] || 'https';
              const isSecure = protocol === 'https';
              const cookieOptions = [
                `session=${sessionToken}`,
                'HttpOnly',
                'Path=/',
                `Max-Age=${7 * 24 * 60 * 60}`,
                isSecure ? 'Secure' : '',
                'SameSite=Lax'
              ].filter(Boolean).join('; ');
              res.setHeader('Set-Cookie', cookieOptions);
              return res.redirect('/');
          }
          catch (error) {
              console.error('OAuth error:', error);
              return res.status(500).json({ error: 'Authentication failed' });
          }
      }
      return res.redirect(authUrl);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}