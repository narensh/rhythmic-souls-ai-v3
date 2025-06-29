import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory user store for demo purposes
const users = new Map();

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: 'First name, email, and password are required' });
  }

  // Check if user already exists
  if (users.has(email)) {
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
  users.set(email, newUser);

  // Create a session token
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36)}`;
  
  // Store session
  users.set(`session_${sessionToken}`, { userId: newUser.id, email: newUser.email });

  // Set session cookie
  res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400`);

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
}