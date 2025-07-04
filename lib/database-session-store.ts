import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sessions, users } from '../shared/schema.js';
import { eq, lt } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// Database connection
let pool: Pool | null = null;
let db: any = null;

function getDatabase() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: { sessions, users } });
  }
  return db;
}

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface SessionData {
  email: string;
  createdAt: Date;
  lastActivity: Date;
}

export class DatabaseSessionStore {
  private readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  async setUser(email: string, userData: UserData): Promise<void> {
    const database = getDatabase();
    
    try {
      await database
        .insert(users)
        .values({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          },
        });
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  }

  async getUser(email: string): Promise<UserData | null> {
    const database = getDatabase();
    
    try {
      const [user] = await database
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      return user || null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async createSession(email: string, sessionToken: string): Promise<string> {
    const database = getDatabase();
    if (!sessionToken) {
      sessionToken = randomBytes(32).toString('hex');
    }
    const expireDate = new Date(Date.now() + this.TTL);
    
    const sessionData: SessionData = {
      email,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    try {
      await database
        .insert(sessions)
        .values({
          sid: sessionToken,
          sess: sessionData as any,
          expire: expireDate,
        });
      
      return sessionToken;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async getSession(sessionToken: string): Promise<SessionData | null> {
    const database = getDatabase();
    
    try {
      const [session] = await database
        .select()
        .from(sessions)
        .where(eq(sessions.sid, sessionToken))
        .limit(1);
      
      if (!session) {
        return null;
      }

      // Check if session is expired
      if (session.expire < new Date()) {
        await this.deleteSession(sessionToken);
        return null;
      }

      // Update last activity
      await database
        .update(sessions)
        .set({
          sess: {
            ...session.sess,
            lastActivity: new Date(),
          } as any,
        })
        .where(eq(sessions.sid, sessionToken));

      return session.sess as SessionData;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async deleteSession(sessionToken: string): Promise<void> {
    const database = getDatabase();
    
    try {
      await database
        .delete(sessions)
        .where(eq(sessions.sid, sessionToken));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  async validateSession(sessionToken?: string): Promise<SessionData | null> {
    console.log("validateSession::sessionToken: ", sessionToken);
    if (!sessionToken) {
      return null;
    }

    return await this.getSession(sessionToken);
  }

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

  async cleanupExpiredSessions(): Promise<void> {
    const database = getDatabase();
    
    try {
      await database
        .delete(sessions)
        .where(lt(sessions.expire, new Date()));
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }
}

export const databaseSessionStore = new DatabaseSessionStore();