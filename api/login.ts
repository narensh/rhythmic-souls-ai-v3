import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // For now, redirect to a placeholder since full auth isn't set up
  res.redirect(302, '/?auth=placeholder');
}