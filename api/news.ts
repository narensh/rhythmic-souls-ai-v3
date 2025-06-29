import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const news = [
    {
      id: 1,
      title: "The Future of Conversational AI in Business",
      description: "Explore how AI-powered conversations are transforming customer experiences and business operations.",
      content: "Conversational AI is revolutionizing the way businesses interact with customers...",
      imageUrl: "/api/placeholder/400/200",
      category: "AI Trends",
      tags: ["AI", "Chatbots", "Customer Service"],
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: "MLOps: Streamlining Machine Learning Operations",
      description: "Learn how MLOps practices are making machine learning more reliable and scalable.",
      content: "MLOps combines machine learning, DevOps, and data engineering...",
      imageUrl: "/api/placeholder/400/200",
      category: "Technology",
      tags: ["MLOps", "Machine Learning", "DevOps"],
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  res.status(200).json(news);
}