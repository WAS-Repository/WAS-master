import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  insertDocumentSchema, 
  insertDocumentLocalitySchema, 
  insertDocumentRelationshipSchema,
  insertSearchQuerySchema
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and data file types
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/json',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg',
      'image/gif',
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoints
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileInfo = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date()
      };

      // Store file metadata in database
      const document = await storage.createDocument({
        title: req.file.originalname,
        type: 'uploaded_file',
        authors: ['User'],
        fileFormat: req.file.mimetype,
        fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
        metadata: fileInfo
      });

      res.status(201).json({
        message: "File uploaded successfully",
        document,
        fileInfo
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });

  app.post("/api/upload/multiple", upload.array('files', 10), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedFiles = [];
      
      for (const file of req.files as Express.Multer.File[]) {
        const fileInfo = {
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype,
          uploadedAt: new Date()
        };

        const document = await storage.createDocument({
          title: file.originalname,
          type: 'uploaded_file',
          authors: ['User'],
          fileFormat: file.mimetype,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          metadata: fileInfo
        });

        uploadedFiles.push({ document, fileInfo });
      }

      res.status(201).json({
        message: `${uploadedFiles.length} files uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      res.status(500).json({ message: "Error uploading files" });
    }
  });

  // File serving endpoint
  app.get("/api/files/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(process.cwd(), 'uploads', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      const stat = fs.statSync(filePath);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('File serving error:', error);
      res.status(500).json({ message: "Error serving file" });
    }
  });

  // File management endpoints
  app.get("/api/files", async (req, res) => {
    try {
      const { type, limit = 50, offset = 0 } = req.query;
      
      const options: { type?: string; limit?: number; offset?: number } = {};
      if (type) options.type = type as string;
      if (limit) options.limit = parseInt(limit as string);
      if (offset) options.offset = parseInt(offset as string);
      
      const files = await storage.getDocuments({ ...options, type: 'uploaded_file' });
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Error fetching files" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid file ID" });
      }

      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete physical file
      if (document.metadata && document.metadata.path) {
        const filePath = document.metadata.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Delete from database
      const success = await storage.deleteDocument(id);
      if (!success) {
        return res.status(404).json({ message: "File not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting file" });
    }
  });

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
  
  // GeoJSON data endpoint
  app.get("/api/geojson", (req, res) => {
    try {
      // Read the GeoJSON file from attached_assets
      const filePath = process.cwd() + '/attached_assets/hampton_roads_localities.geojson';
      const fs = require('fs');
      
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const geojson = JSON.parse(data);
        res.json(geojson);
      } else {
        console.error('GeoJSON file not found at:', filePath);
        res.status(404).json({ message: "GeoJSON file not found" });
      }
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      res.status(500).json({ message: "Error loading GeoJSON data" });
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

  // Session management endpoints
  app.get("/api/sessions/latest/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const session = await storage.getLatestSession(userId);
      
      if (!session) {
        return res.status(404).json({ message: "No session found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Error fetching session" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createOrUpdateSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ message: "Error creating/updating session" });
    }
  });

  app.post("/api/sessions/documents", async (req, res) => {
    try {
      const { sessionId, documentPath, content, workspaceMode } = req.body;
      const document = await storage.saveSessionDocument({
        sessionId,
        documentPath,
        content,
        workspaceMode
      });
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Error saving document" });
    }
  });

  app.get("/api/sessions/documents/:sessionId/:documentPath/:workspaceMode", async (req, res) => {
    try {
      const { sessionId, documentPath, workspaceMode } = req.params;
      const document = await storage.getSessionDocument(sessionId, decodeURIComponent(documentPath), workspaceMode);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Error fetching document" });
    }
  });

  // Version control endpoints
  app.post("/api/was/commits", async (req, res) => {
    try {
      const commitData = req.body;
      const commit = await storage.saveWasCommit(commitData);
      res.status(201).json(commit);
    } catch (error) {
      res.status(500).json({ message: "Error saving commit" });
    }
  });

  app.get("/api/was/commits/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const commits = await storage.getWasCommits(sessionId);
      res.json(commits);
    } catch (error) {
      res.status(500).json({ message: "Error fetching commits" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
