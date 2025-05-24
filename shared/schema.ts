import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Document types enum
export const DocumentType = {
  RESEARCH_PAPER: "research_paper",
  PATENT: "patent",
  SCHEMATIC: "schematic",
  ENGINEERING_DRAWING: "engineering_drawing",
} as const;

// Base document schema
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // One of DocumentType
  authors: text("authors").array().notNull(),
  publishedDate: timestamp("published_date"),
  institution: text("institution"),
  keywords: text("keywords").array(),
  description: text("description"),
  fileFormat: text("file_format"),
  fileSize: text("file_size"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  metadata: jsonb("metadata"), // Any additional metadata
});

// Document-locality relationships
export const documentLocalities = pgTable("document_localities", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  localityName: text("locality_name").notNull(),
  localityGeoid: text("locality_geoid"),
});

// Document-document relationships
export const documentRelationships = pgTable("document_relationships", {
  id: serial("id").primaryKey(),
  sourceDocumentId: integer("source_document_id").notNull(),
  targetDocumentId: integer("target_document_id").notNull(),
  relationshipType: text("relationship_type").notNull(), // e.g., "references", "cites", "related to"
});

// Search queries history
export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  resultCount: integer("result_count"),
});

// User sessions for workspace persistence
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: text("user_id").notNull(),
  workspaceMode: text("workspace_mode").notNull(),
  researchData: jsonb("research_data"),
  storyData: jsonb("story_data"),
  developerData: jsonb("developer_data"),
  wasRepositories: jsonb("was_repositories"),
  lastAccessed: timestamp("last_accessed").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Session documents for cross-workspace persistence
export const sessionDocuments = pgTable("session_documents", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  documentPath: text("document_path").notNull(),
  content: text("content").notNull(),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
  workspaceMode: text("workspace_mode").notNull(),
});

// WAS commit history for version control persistence
export const wasCommitHistory = pgTable("was_commit_history", {
  id: serial("id").primaryKey(),
  commitId: text("commit_id").notNull().unique(),
  sessionId: text("session_id").notNull(),
  documentPath: text("document_path").notNull(),
  content: text("content").notNull(),
  message: text("message").notNull(),
  author: text("author").notNull(),
  email: text("email").notNull(),
  contentHash: text("content_hash").notNull(),
  parentCommitId: text("parent_commit_id"),
  changes: jsonb("changes").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertDocumentSchema = createInsertSchema(documents)
  .omit({ id: true });

export const insertDocumentLocalitySchema = createInsertSchema(documentLocalities)
  .omit({ id: true });

export const insertDocumentRelationshipSchema = createInsertSchema(documentRelationships)
  .omit({ id: true });

export const insertSearchQuerySchema = createInsertSchema(searchQueries)
  .omit({ id: true, timestamp: true });

export const insertUserSessionSchema = createInsertSchema(userSessions)
  .omit({ id: true, lastAccessed: true, createdAt: true });

export const insertSessionDocumentSchema = createInsertSchema(sessionDocuments)
  .omit({ id: true, lastModified: true });

export const insertWasCommitHistorySchema = createInsertSchema(wasCommitHistory)
  .omit({ id: true, timestamp: true });

// Types
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type DocumentLocality = typeof documentLocalities.$inferSelect;
export type InsertDocumentLocality = z.infer<typeof insertDocumentLocalitySchema>;

export type DocumentRelationship = typeof documentRelationships.$inferSelect;
export type InsertDocumentRelationship = z.infer<typeof insertDocumentRelationshipSchema>;

export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;

export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export type SessionDocument = typeof sessionDocuments.$inferSelect;
export type InsertSessionDocument = z.infer<typeof insertSessionDocumentSchema>;

export type WasCommitHistory = typeof wasCommitHistory.$inferSelect;
export type InsertWasCommitHistory = z.infer<typeof insertWasCommitHistorySchema>;
