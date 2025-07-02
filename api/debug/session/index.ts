import { VercelRequest, VercelResponse } from '@vercel/node';
import { databaseSessionStore } from '../../../lib/database-session-store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const cookies = databaseSessionStore.parseCookies(req.headers.cookie);
    console.log("cookies: ", cookies);
    const sessionToken = cookies.session;
    console.log("sessionToken: ", sessionToken);
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      host: req.headers.host,
      protocol: req.headers['x-forwarded-proto'] || 'unknown',
      hasCookieHeader: !!req.headers.cookie,
      cookieHeader: req.headers.cookie ? req.headers.cookie.substring(0, 100) + '...' : null,
      hasSessionToken: !!sessionToken,
      sessionTokenLength: sessionToken ? sessionToken.length : 0,
      hasDatabase: !!process.env.DATABASE_URL,
      userAgent: req.headers['user-agent'],
      origin: req.headers.origin,
      referer: req.headers.referer,
      sessionValid: false,
      sessionEmail: "",
      sessionCreated: new Date(),
      lastActivity: new Date(),
      accessToken: "",
      sessionError: ""
    };

    if (sessionToken) {
      try {
        const session = await databaseSessionStore.validateSession(sessionToken);
        console.log("session: ", session);
        debugInfo.sessionValid = !!session;
        if (session) {
          debugInfo.sessionEmail = session.email;
          debugInfo.sessionCreated = session.createdAt;
          debugInfo.lastActivity = session.lastActivity;
          debugInfo.accessToken = sessionToken;
          console.log("session is valid: ", session);
        } else { console.log("session is invalid: ", session); }
      } catch (error) {
//         debugInfo.sessionError = error;
        console.log("error: ", error);
      }
    }

    return res.status(200).json(debugInfo);
  } catch (error) {
    return res.status(500).json({
      error: 'Debug failed',
      message: error,
      timestamp: new Date().toISOString()
    });
  }
}