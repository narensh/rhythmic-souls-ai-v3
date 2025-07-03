import {
  users,
  userAnalytics,
  newsArticles,
  userProjects,
  newsletterSubscriptions,
  testimonials,
  type User,
  type UpsertUser,
  type UserAnalytics,
  type InsertUserAnalytics,
  type NewsArticle,
  type InsertNewsArticle,
  type UserProject,
  type InsertUserProject,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type Testimonial,
  type InsertTestimonial,
} from "../shared/schema.js";
import { db } from "../server/db.js";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Analytics operations
  trackUserAnalytics(analytics: InsertUserAnalytics): Promise<UserAnalytics>;
  getUserAnalytics(userId: string): Promise<UserAnalytics[]>;

  // News operations
  getNewsArticles(limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;

  // User projects operations
  getUserProjects(userId: string): Promise<UserProject[]>;
  createUserProject(project: InsertUserProject): Promise<UserProject>;
  updateUserProject(id: number, project: Partial<InsertUserProject>): Promise<UserProject | undefined>;

  // Newsletter operations
  subscribeToNewsletter(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription>;

  // Testimonials operations
  getTestimonials(): Promise<Testimonial[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async trackUserAnalytics(analytics: InsertUserAnalytics): Promise<UserAnalytics> {
    const [result] = await db
      .insert(userAnalytics)
      .values(analytics)
      .returning();
    return result;
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics[]> {
    return await db
      .select()
      .from(userAnalytics)
      .where(eq(userAnalytics.userId, userId))
      .orderBy(desc(userAnalytics.createdAt));
  }

  async getNewsArticles(limit = 10): Promise<NewsArticle[]> {
    return await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.isPublished, true))
      .orderBy(desc(newsArticles.createdAt))
      .limit(limit);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [result] = await db
      .insert(newsArticles)
      .values(article)
      .returning();
    return result;
  }

  async getUserProjects(userId: string): Promise<UserProject[]> {
    return await db
      .select()
      .from(userProjects)
      .where(eq(userProjects.userId, userId))
      .orderBy(desc(userProjects.updatedAt));
  }

  async createUserProject(project: InsertUserProject): Promise<UserProject> {
    const [result] = await db
      .insert(userProjects)
      .values(project)
      .returning();
    return result;
  }

  async updateUserProject(id: number, project: Partial<InsertUserProject>): Promise<UserProject | undefined> {
    const [result] = await db
      .update(userProjects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(userProjects.id, id))
      .returning();
    return result;
  }

  async subscribeToNewsletter(subscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    const [result] = await db
      .insert(newsletterSubscriptions)
      .values(subscription)
      .returning();
    return result;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(desc(testimonials.createdAt));
  }
}

export const storage = new DatabaseStorage();
