
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User analytics table
export const userAnalytics = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  location: jsonb("location"), // {country, city, timezone}
  browserInfo: jsonb("browser_info"), // {name, version, os}
  pageViews: jsonb("page_views").array(), // array of page visit data
  searchQueries: text("search_queries").array(),
  actionsPerformed: jsonb("actions_performed").array(),
  sessionDuration: integer("session_duration"), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// News articles table
export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  imageUrl: varchar("image_url"),
  category: varchar("category"), // AI Trends, MLOps, DevOps, etc.
  tags: varchar("tags").array(),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User projects/code snippets
export const userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  description: text("description"),
  code: text("code"),
  language: varchar("language"), // python, javascript
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Newsletter subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  title: varchar("title"),
  company: varchar("company"),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  imageUrl: varchar("image_url"),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUserAnalytics = typeof userAnalytics.$inferInsert;
export type UserAnalytics = typeof userAnalytics.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertUserProject = typeof userProjects.$inferInsert;
export type UserProject = typeof userProjects.$inferSelect;
export type InsertNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;

export const insertUserAnalyticsSchema = createInsertSchema(userAnalytics);
export const insertNewsArticleSchema = createInsertSchema(newsArticles);
export const insertUserProjectSchema = createInsertSchema(userProjects);
export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions);
export const insertTestimonialSchema = createInsertSchema(testimonials);
