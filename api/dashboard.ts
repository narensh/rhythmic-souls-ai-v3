import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const stats = {
    apiCalls: Math.floor(Math.random() * 100) + 50,
    sessions: Math.floor(Math.random() * 20) + 5,
    projects: Math.floor(Math.random() * 8) + 2
  };
  
  const mockAnalytics = [
    { date: new Date().toISOString(), pageViews: 120, uniqueVisitors: 85 },
    { date: new Date(Date.now() - 24*60*60*1000).toISOString(), pageViews: 98, uniqueVisitors: 76 }
  ];
  
  const mockProjects = [
    { id: 1, name: "AI Chatbot Integration", status: "completed", progress: 100 },
    { id: 2, name: "MLOps Pipeline Setup", status: "in-progress", progress: 65 }
  ];
  
  res.status(200).json({ 
    stats, 
    analytics: mockAnalytics, 
    projects: mockProjects 
  });
}