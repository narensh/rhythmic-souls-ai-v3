import express, { Request, Response } from "express";
import { registerRoutes } from "./routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow iframe embedding for Replit preview
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Simple request logging for production
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - start;
    console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    return originalJson.call(this, body);
  };
  
  next();
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`Error on ${req.method} ${req.path}:`, err);
  
  if (res.headersSent) {
    return next(err);
  }
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Initialize routes once
let initialized = false;

async function initializeApp() {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
}

// Vercel handler
export default async function handler(req: Request, res: Response) {
  await initializeApp();
  
  // Use the Express app as middleware
  app(req, res);
}