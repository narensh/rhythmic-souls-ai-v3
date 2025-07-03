import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from "../../../lib/storage.js";
import { insertNewsletterSubscriptionSchema } from "../../../shared/schema.js";
import { z } from "zod";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
}