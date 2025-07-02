import { VercelRequest, VercelResponse } from '@vercel/node';
import { databaseSessionStore } from '../../../lib/database-session-store.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = databaseSessionStore.parseCookies(req.headers.cookie);
    const sessionToken = cookies.session;

    if (!sessionToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await databaseSessionStore.validateSession(sessionToken);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await databaseSessionStore.getUser(session.email);
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
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}