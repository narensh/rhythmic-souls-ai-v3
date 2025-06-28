import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

interface AnalyticsRequest extends Request {
  user?: any;
}

export async function trackAnalytics(req: AnalyticsRequest, res: Response, next: NextFunction) {
  // Only track for non-API routes and authenticated users
  if (req.path.startsWith('/api/') || req.method !== 'GET') {
    return next();
  }

  try {
    const userId = req.user?.claims?.sub;
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.get('User-Agent') || '';
    
    // Extract browser information
    const browserInfo = parseBrowserInfo(userAgent);
    
    // Mock location data (in production, use IP geolocation service)
    const location = {
      country: 'Unknown',
      city: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Only track analytics for authenticated users
    if (!userId) {
      return next();
    }

    const analyticsData = {
      userId,
      sessionId: req.sessionID || `session_${userId}_${Date.now()}`,
      ipAddress,
      userAgent,
      location,
      browserInfo,
      pageViews: [{
        path: req.path,
        timestamp: new Date(),
        referrer: req.get('Referrer') || ''
      }],
      searchQueries: [],
      actionsPerformed: [{
        action: 'page_view',
        path: req.path,
        timestamp: new Date()
      }],
      sessionDuration: 0
    };

    // Track analytics in background (don't block request)
    setImmediate(async () => {
      try {
        await storage.trackUserAnalytics(analyticsData);
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    });

  } catch (error) {
    console.error('Analytics middleware error:', error);
  }

  next();
}

function parseBrowserInfo(userAgent: string) {
  const browserRegex = {
    Chrome: /Chrome\/([0-9.]+)/,
    Firefox: /Firefox\/([0-9.]+)/,
    Safari: /Safari\/([0-9.]+)/,
    Edge: /Edge\/([0-9.]+)/,
    IE: /MSIE ([0-9.]+)/
  };

  const osRegex = {
    Windows: /Windows NT ([0-9.]+)/,
    macOS: /Mac OS X ([0-9_.]+)/,
    Linux: /Linux/,
    Android: /Android ([0-9.]+)/,
    iOS: /OS ([0-9_]+)/
  };

  let browser = 'Unknown';
  let browserVersion = '';
  let os = 'Unknown';

  for (const [name, regex] of Object.entries(browserRegex)) {
    const match = userAgent.match(regex);
    if (match) {
      browser = name;
      browserVersion = match[1];
      break;
    }
  }

  for (const [name, regex] of Object.entries(osRegex)) {
    if (regex.test(userAgent)) {
      os = name;
      break;
    }
  }

  return {
    name: browser,
    version: browserVersion,
    os: os,
    userAgent: userAgent
  };
}
