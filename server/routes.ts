import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { searchWithOpenAI } from "./services/openai";
import { trackAnalytics } from "./services/analytics";
import { insertNewsletterSubscriptionSchema } from "@shared/schema";
import { z } from "zod";
import { handleDevAPIRoute } from "./dev-api-handler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Development API routes - handle Vercel functions in development
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/auth/google', (req, res) => handleDevAPIRoute(req, res, 'auth/google'));
    app.post('/api/auth/login', (req, res) => handleDevAPIRoute(req, res, 'auth/login'));
    app.post('/api/auth/register', (req, res) => handleDevAPIRoute(req, res, 'auth/register'));
    app.get('/api/auth/user', (req, res) => handleDevAPIRoute(req, res, 'auth/user'));
    app.get('/api/logout', (req, res) => handleDevAPIRoute(req, res, 'logout'));
  } else {
    // Production routes (not used in Vercel deployment)
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
  }

  // Search endpoint
  app.post('/api/search', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      const results = await searchWithOpenAI(query);
      
      // Track search analytics for authenticated users
      const userId = (req as any).user?.claims?.sub;
      if (userId) {
        try {
          await storage.trackUserAnalytics({
            userId,
            sessionId: req.sessionID || `session_${userId}_${Date.now()}`,
            ipAddress: req.ip || '',
            userAgent: req.get('User-Agent') || '',
            location: { country: 'Unknown', city: 'Unknown' },
            browserInfo: {},
            pageViews: [],
            searchQueries: [query],
            actionsPerformed: [{ type: 'search', query, timestamp: new Date() }],
            sessionDuration: 0
          });
        } catch (analyticsError) {
          console.error("Analytics tracking error:", analyticsError);
          // Continue with search even if analytics fails
        }
      }
      
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
      
      // Filter analytics for current user
      const userAnalytics = analytics.filter(a => a.userId === userId);
      
      // Calculate dashboard stats  
      const totalSearchQueries = userAnalytics.reduce((sum, a) => sum + (a.searchQueries?.length || 0), 0);
      const totalSessions = new Set(userAnalytics.map(a => a.sessionId).filter(Boolean)).size;
      const totalProjects = projects.length;
      
      res.json({
        stats: {
          apiCalls: totalSearchQueries,
          sessions: totalSessions,
          projects: totalProjects,
          storage: "2.4GB"
        },
        recentActivity: userAnalytics.slice(0, 10).map(a => {
          let description = '';
          if (a.searchQueries && a.searchQueries.length > 0) {
            description = `Search: "${a.searchQueries[0]?.substring(0, 30)}..."`;
          } else if (a.pageViews && Array.isArray(a.pageViews) && a.pageViews.length > 0) {
            const lastPageView = a.pageViews[a.pageViews.length - 1] as any;
            description = `Visited ${lastPageView?.path || 'page'}`;
          } else {
            description = 'Session activity';
          }
          
          return {
            type: 'activity',
            description,
            timestamp: a.createdAt
          };
        })
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
