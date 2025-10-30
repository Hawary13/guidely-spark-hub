import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getFacebookPosts, getFacebookPageInfo } from "./facebook";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Facebook API routes
  app.get('/api/facebook/posts', getFacebookPosts);
  app.get('/api/facebook/page-info', getFacebookPageInfo);

  const httpServer = createServer(app);

  return httpServer;
}
