import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${protocol}://${host}/api/auth/google`;

  return res.status(200).json({
    message: 'OAuth Debug Information',
    environment: process.env.VERCEL ? 'production' : 'development',
    host: host,
    protocol: protocol,
    redirectUri: redirectUri,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    timestamp: new Date().toISOString()
  });
}