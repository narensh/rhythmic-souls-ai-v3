import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Return unauthorized for now since auth isn't fully configured
  res.status(401).json({ message: "Unauthorized" });
}