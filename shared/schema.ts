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

// Insert schemas
export const insertDocumentSchema = createInsertSchema(documents)
  .omit({ id: true });

export const insertDocumentLocalitySchema = createInsertSchema(documentLocalities)
  .omit({ id: true });

export const insertDocumentRelationshipSchema = createInsertSchema(documentRelationships)
  .omit({ id: true });

export const insertSearchQuerySchema = createInsertSchema(searchQueries)
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
