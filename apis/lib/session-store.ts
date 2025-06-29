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
    const session = {
      email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
    
    this.sessions.set(`session_${sessionToken}`, session);
    return sessionToken;
  }

  getSession(sessionToken: string) {
    return this.sessions.get(`session_${sessionToken}`);
  }

  deleteSession(sessionToken: string) {
    this.sessions.delete(`session_${sessionToken}`);
  }

  // Utility to parse cookies
  parseCookies(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) return {};
    
    return cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  }

  // Validate session and return user
  validateSession(sessionToken?: string) {
    if (!sessionToken) return null;

    const session = this.getSession(sessionToken);
    if (!session) return null;

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      this.deleteSession(sessionToken);
      return null;
    }

    // Return user data
    const user = this.getUser(session.email);
    return user;
  }
}

// Export singleton instance
export const sessionStore = new SessionStore();