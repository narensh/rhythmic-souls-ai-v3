import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "CTO, TechCorp",
      content: "Rhythmic Souls AI transformed our customer service with their conversational AI solution. Response times improved by 80%.",
      rating: 5,
      imageUrl: "/api/placeholder/100/100",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Operations Director, StartupXYZ",
      content: "Their MLOps platform streamlined our ML deployment process. We went from weeks to hours for model deployment.",
      rating: 5,
      imageUrl: "/api/placeholder/100/100",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: "Amanda Rodriguez",
      title: "DevOps Lead, InnovateCorp",
      content: "The DevOps solutions helped us achieve 99.9% uptime and reduced deployment risks significantly.",
      rating: 5,
      imageUrl: "/api/placeholder/100/100",
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  res.status(200).json(testimonials);
}