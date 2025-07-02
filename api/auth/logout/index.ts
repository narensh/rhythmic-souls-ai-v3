import { VercelRequest, VercelResponse } from '@vercel/node';
import { databaseSessionStore } from '../../../lib/database-session-store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookies = databaseSessionStore.parseCookies(req.headers.cookie);
  const sessionToken = cookies.session;

  if (sessionToken) {
    await databaseSessionStore.deleteSession(sessionToken);
  }

  res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
  return res.status(200).json({ message: 'Logged out successfully' });
}