import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertDocumentSchema, 
  insertDocumentLocalitySchema, 
  insertDocumentRelationshipSchema,
  insertSearchQuerySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints for documents
  app.get("/api/documents", async (req, res) => {
    try {
      const { type, locality, keywords } = req.query;
      
      const options: { type?: string; localityName?: string; keywords?: string[] } = {};
      if (type) options.type = type as string;
      if (locality) options.localityName = locality as string;
      if (keywords) options.keywords = (keywords as string).split(',');
      
      const documents = await storage.getDocuments(options);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Error fetching documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Error fetching document" });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating document" });
    }
  });

  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const validatedData = insertDocumentSchema.partial().parse(req.body);
      const document = await storage.updateDocument(id, validatedData);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const success = await storage.deleteDocument(id);
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting document" });
    }
  });

  // API endpoints for document localities
  app.get("/api/documents/:id/localities", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const localities = await storage.getDocumentLocalities(documentId);
      res.json(localities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching document localities" });
    }
  });

  app.post("/api/document-localities", async (req, res) => {
    try {
      const validatedData = insertDocumentLocalitySchema.parse(req.body);
      const documentLocality = await storage.createDocumentLocality(validatedData);
      res.status(201).json(documentLocality);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document locality data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating document locality" });
    }
  });

  app.delete("/api/document-localities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document locality ID" });
      }
      
      const success = await storage.deleteDocumentLocality(id);
      if (!success) {
        return res.status(404).json({ message: "Document locality not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting document locality" });
    }
  });

  // API endpoints for document relationships
  app.get("/api/documents/:id/relationships", async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const relationships = await storage.getDocumentRelationships(documentId);
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ message: "Error fetching document relationships" });
    }
  });

  app.post("/api/document-relationships", async (req, res) => {
    try {
      const validatedData = insertDocumentRelationshipSchema.parse(req.body);
      const relationship = await storage.createDocumentRelationship(validatedData);
      res.status(201).json(relationship);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document relationship data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating document relationship" });
    }
  });

  app.delete("/api/document-relationships/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document relationship ID" });
      }
      
      const success = await storage.deleteDocumentRelationship(id);
      if (!success) {
        return res.status(404).json({ message: "Document relationship not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting document relationship" });
    }
  });

  // API endpoints for search queries
  app.post("/api/search", async (req, res) => {
    try {
      const validatedData = insertSearchQuerySchema.parse(req.body);
      const searchQuery = await storage.saveSearchQuery(validatedData);
      
      // This would be where you integrate with a search API
      // For now, we'll just return documents based on simple filtering
      const keywords = validatedData.query.split(' ').filter(k => k.length > 3);
      const documents = await storage.getDocuments({ keywords });
      
      // Update the result count
      searchQuery.resultCount = documents.length;
      
      res.json({
        query: searchQuery,
        results: documents
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search query", errors: error.errors });
      }
      res.status(500).json({ message: "Error processing search query" });
    }
  });

  app.get("/api/search/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentQueries = await storage.getRecentSearchQueries(limit);
      res.json(recentQueries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recent search queries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
