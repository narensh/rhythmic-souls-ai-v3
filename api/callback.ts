import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Redirect to home page after auth callback
  res.redirect(302, '/');
}