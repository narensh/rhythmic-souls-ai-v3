import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../lib/session-store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user exists and password matches
  const user = sessionStore.getUser(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create session token
  const sessionToken = sessionStore.createSession(email);

  // Set session cookie
  res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
}