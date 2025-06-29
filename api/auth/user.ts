import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../lib/session-store.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get session from cookie
  const cookies = sessionStore.parseCookies(req.headers.cookie);
  const sessionToken = cookies.session;
  
  // Validate session and get user
  const user = sessionStore.validateSession(sessionToken);
  
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
}