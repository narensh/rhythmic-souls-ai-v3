// Shared in-memory session storage for all API endpoints
// In production, this would be replaced with a proper database or Redis

class SessionStore {
  private users = new Map<string, any>();
  private sessions = new Map<string, any>();

  // User management
  setUser(email: string, userData: any) {
    this.users.set(email, userData);
  }

  getUser(email: string) {
    return this.users.get(email);
  }

  // Session management
  createSession(email: string): string {
    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const sessionData = {
      email,
      createdAt: new Date(),
      lastAccessed: new Date(),
    };
    this.sessions.set(sessionToken, sessionData);
    return sessionToken;
  }

  getSession(sessionToken: string) {
    return this.sessions.get(sessionToken);
  }

  deleteSession(sessionToken: string) {
    this.sessions.delete(sessionToken);
  }

  // Helper methods
  parseCookies(cookieHeader?: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });

    return cookies;
  }

  validateSession(sessionToken?: string) {
    if (!sessionToken) return null;
    const session = this.getSession(sessionToken);
    if (!session) return null;
    
    // Update last accessed time
    session.lastAccessed = new Date();
    return session;
  }
}

export const sessionStore = new SessionStore();