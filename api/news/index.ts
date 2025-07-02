import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Mock data for development/production
  const mockNews = [
    {
      id: 1,
      title: "The Future of Conversational AI in Business",
      content: "Explore how conversational AI is transforming customer interactions...",
      category: "AI Technology",
      author: "Dr. Sarah Chen",
      createdAt: new Date().toISOString(),
      published: true
    },
    {
      id: 2,
      title: "MLOps Best Practices for Enterprise AI",
      content: "Learn about implementing robust MLOps pipelines for production AI systems...",
      category: "MLOps",
      author: "Michael Rodriguez",
      createdAt: new Date().toISOString(),
      published: true
    },
    {
      id: 3,
      title: "Cost Optimization Strategies for GPU Infrastructure",
      content: "Discover proven methods to reduce GPU costs while maintaining performance...",
      category: "Infrastructure",
      author: "Jennifer Park",
      createdAt: new Date().toISOString(),
      published: true
    }
  ];

  return res.status(200).json(mockNews);
}