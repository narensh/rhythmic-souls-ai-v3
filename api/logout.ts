import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Clear the session cookie
  res.setHeader('Set-Cookie', 'session=; HttpOnly; Path=/; Max-Age=0');
  
  // Redirect to home page
  res.redirect(302, '/');
}