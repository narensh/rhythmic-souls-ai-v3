import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory session store for demo purposes
const users = new Map();

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get session from cookie
  const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>) || {};

  const sessionToken = cookies.session;
  
  if (!sessionToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check session
  const session = users.get(`session_${sessionToken}`);
  if (!session) {
    return res.status(401).json({ message: 'Invalid session' });
  }

  // Get user data
  const user = users.get(session.email);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
}