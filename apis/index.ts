import express, { Request, Response, NextFunction } from "express";

// Simple storage implementation for Vercel deployment
const mockStorage = {
  async getUser(id: string) { return null; },
  async getUserAnalytics(userId: string) { return []; },
  async getUserProjects(userId: string) { return []; },
  async getNewsArticles(limit = 10) { 
    return [
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
      }
    ];
  },
  async getTestimonials() {
    return [
      {
        id: 1,
        name: "Sarah Johnson",
        title: "CTO, TechCorp",
        content: "Rhythmic Souls AI transformed our customer service with their conversational AI solution. Response times improved by 80%.",
        rating: 5,
        imageUrl: "/api/placeholder/100/100",
        createdAt: new Date()
      }
    ];
  },
  async subscribeToNewsletter(subscription: { email: string }) {
    return { id: 1, email: subscription.email, createdAt: new Date() };
  }
};

// Simple auth middleware for Vercel  
const isAuthenticated = (req: any, res: any, next?: any) => {
  if (next) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

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



// Auth routes
app.get('/api/login', (req, res) => {
  res.redirect('/api/auth/error?error=not_implemented');
});

app.get('/api/logout', (req, res) => {
  res.redirect('/');
});

app.get('/api/callback', (req, res) => {
  res.redirect('/');
});

app.get('/api/auth/user', (req, res) => {
  // For now, return unauthorized since full auth isn't implemented in Vercel handler
  res.status(401).json({ message: "Unauthorized" });
});

// Dashboard route
app.get('/api/dashboard', async (req: any, res) => {
  try {
    const stats = {
      apiCalls: 0,
      sessions: Math.floor(Math.random() * 10) + 1,
      projects: Math.floor(Math.random() * 5) + 1
    };
    
    res.json({ stats, analytics: [], projects: [] });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

// Search route
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }
    
    // Mock search response
    res.json({
      answer: `Here's information about ${query}`,
      relatedTopics: ["AI Solutions", "Business Intelligence"]
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

// News routes
app.get('/api/news', async (req, res) => {
  try {
    const news = await mockStorage.getNewsArticles(10);
    res.json(news);
  } catch (error) {
    console.error("News fetch error:", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

// Testimonials route
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await mockStorage.getTestimonials();
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
    
    const subscription = await mockStorage.subscribeToNewsletter({ email });
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

export default app;