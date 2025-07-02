import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Mock data for development/production
  const mockTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "CTO at TechStart",
      content: "Rhythmic Souls AI transformed our customer service operations...",
      rating: 5,
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "David Chen",
      title: "Operations Director at Global Corp",
      content: "The MLOps platform streamlined our entire AI deployment process...",
      rating: 5,
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      title: "Head of Innovation at Future Systems",
      content: "Cost optimization reduced our GPU expenses by 40% while improving performance...",
      rating: 5,
      featured: false,
      createdAt: new Date().toISOString()
    }
  ];

  return res.status(200).json(mockTestimonials);
}