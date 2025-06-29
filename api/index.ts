import express, { Request, Response, NextFunction } from "express";
import { setupAuth, isAuthenticated } from "../server/replitAuth";
import { storage } from "../server/storage";
import { searchWithOpenAI } from "../server/services/openai";
import { trackAnalytics } from "../server/services/analytics";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow iframe embedding
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

// Initialize auth in an async wrapper
const initializeApp = async () => {
  try {
    // Setup authentication
    await setupAuth(app);

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

    // Dashboard route
    app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const analytics = await storage.getUserAnalytics(userId);
        const projects = await storage.getUserProjects(userId);
        
        const stats = {
          apiCalls: analytics.reduce((sum, a) => sum + (a.searchQueries?.length || 0), 0),
          sessions: analytics.length,
          projects: projects.length
        };
        
        res.json({ stats, analytics: analytics.slice(0, 10), projects });
      } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
      }
    });

    // Search route
    app.post('/api/search', trackAnalytics, async (req, res) => {
      try {
        const { query } = req.body;
        if (!query) {
          return res.status(400).json({ message: "Query is required" });
        }
        
        const results = await searchWithOpenAI(query);
        res.json(results);
      } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Search failed" });
      }
    });

    // News routes
    app.get('/api/news', async (req, res) => {
      try {
        const news = await storage.getNewsArticles(10);
        res.json(news);
      } catch (error) {
        console.error("News fetch error:", error);
        res.status(500).json({ message: "Failed to fetch news" });
      }
    });

    // Testimonials route
    app.get('/api/testimonials', async (req, res) => {
      try {
        const testimonials = await storage.getTestimonials();
        res.json(testimonials);
      } catch (error) {
        console.error("Testimonials fetch error:", error);
        res.status(500).json({ message: "Failed to fetch testimonials" });
      }
    });

    // Newsletter subscription
    app.post('/api/newsletter/subscribe', async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
        
        const subscription = await storage.subscribeToNewsletter({ email });
        res.json({ message: "Successfully subscribed to newsletter", subscription });
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    });

    // Error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
};

// Initialize the app
initializeApp();

export default app;