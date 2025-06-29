import { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionStore } from '../lib/session-store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: 'First name, email, and password are required' });
  }

  // Check if user already exists
  if (sessionStore.getUser(email)) {
    return res.status(409).json({ message: 'User already exists with this email' });
  }

  // Create new user
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36)}`,
    firstName,
    lastName,
    email,
    phone: phone || null,
    password, // In production, hash this password
    profileImageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Store user
  sessionStore.setUser(email, newUser);

  // Create session token
  const sessionToken = sessionStore.createSession(email);

  // Set session cookie
  res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
}