import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory user store for demo purposes
// In production, this would be a proper database
const users = new Map();

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if user exists and password matches
  const user = users.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create a session token (in production, use proper JWT)
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36)}`;
  
  // Store session (in production, use proper session store)
  users.set(`session_${sessionToken}`, { userId: user.id, email: user.email });

  // Set session cookie
  res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400`);

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json(userWithoutPassword);
}