import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { searchWithOpenAI } from "./services/openai";
import { trackAnalytics } from "./services/analytics";
import { insertNewsletterSubscriptionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Analytics middleware for all requests
  app.use(trackAnalytics);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Search endpoint
  app.post('/api/search', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      const results = await searchWithOpenAI(query);
      res.json({ results });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // News articles endpoint
  app.get('/api/news', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const articles = await storage.getNewsArticles(limit);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // User dashboard endpoint
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analytics = await storage.getUserAnalytics(userId);
      const projects = await storage.getUserProjects(userId);
      
      // Calculate dashboard stats
      const totalApiCalls = analytics.reduce((sum, a) => sum + (a.actionsPerformed?.length || 0), 0);
      const totalSessions = analytics.length;
      const totalProjects = projects.length;
      
      res.json({
        stats: {
          apiCalls: totalApiCalls,
          sessions: totalSessions,
          projects: totalProjects,
          storage: "2.4GB" // Mock storage for now
        },
        recentActivity: analytics.slice(0, 10).map(a => ({
          type: 'activity',
          description: `Session from ${(a.location as any)?.country || 'Unknown location'}`,
          timestamp: a.createdAt
        }))
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // User projects endpoints
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const project = await storage.createUserProject({
        ...req.body,
        userId,
      });
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  // Newsletter subscription
  app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.subscribeToNewsletter(validatedData);
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email address" });
      }
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Testimonials endpoint
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Code execution endpoint for education platform
  app.post('/api/execute-code', isAuthenticated, async (req: any, res) => {
    try {
      const { code, language } = req.body;
      
      // For now, return a mock response
      // In production, integrate with code execution service
      res.json({
        output: "Hello! I'm an AI assistant. How can I help you today?",
        executionTime: "1.2s",
        memoryUsage: "15.3 MB"
      });
    } catch (error) {
      console.error("Code execution error:", error);
      res.status(500).json({ message: "Code execution failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
