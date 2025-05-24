import { 
  Document, InsertDocument, 
  DocumentLocality, InsertDocumentLocality,
  DocumentRelationship, InsertDocumentRelationship,
  SearchQuery, InsertSearchQuery
} from "@shared/schema";

export interface IStorage {
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocuments(options?: { type?: string; localityName?: string; keywords?: string[] }): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Document-locality operations
  getDocumentLocalities(documentId: number): Promise<DocumentLocality[]>;
  createDocumentLocality(documentLocality: InsertDocumentLocality): Promise<DocumentLocality>;
  deleteDocumentLocality(id: number): Promise<boolean>;
  
  // Document relationship operations
  getDocumentRelationships(documentId: number): Promise<DocumentRelationship[]>;
  createDocumentRelationship(relationship: InsertDocumentRelationship): Promise<DocumentRelationship>;
  deleteDocumentRelationship(id: number): Promise<boolean>;
  
  // Search operations
  saveSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  getRecentSearchQueries(limit?: number): Promise<SearchQuery[]>;
  
  // Session persistence operations
  createOrUpdateSession(session: InsertUserSession): Promise<UserSession>;
  getLatestSession(userId: string): Promise<UserSession | undefined>;
  saveSessionDocument(doc: InsertSessionDocument): Promise<SessionDocument>;
  getSessionDocument(sessionId: string, documentPath: string, workspaceMode: string): Promise<SessionDocument | undefined>;
  saveWasCommit(commit: InsertWasCommitHistory): Promise<WasCommitHistory>;
  getWasCommits(sessionId: string): Promise<WasCommitHistory[]>;
}

export class MemStorage implements IStorage {
  private documents: Map<number, Document>;
  private documentLocalities: Map<number, DocumentLocality>;
  private documentRelationships: Map<number, DocumentRelationship>;
  private searchQueries: Map<number, SearchQuery>;
  private currentDocumentId: number;
  private currentDocumentLocalityId: number;
  private currentDocumentRelationshipId: number;
  private currentSearchQueryId: number;

  constructor() {
    this.documents = new Map();
    this.documentLocalities = new Map();
    this.documentRelationships = new Map();
    this.searchQueries = new Map();
    this.currentDocumentId = 1;
    this.currentDocumentLocalityId = 1;
    this.currentDocumentRelationshipId = 1;
    this.currentSearchQueryId = 1;
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocuments(options?: { type?: string; localityName?: string; keywords?: string[] }): Promise<Document[]> {
    let documents = Array.from(this.documents.values());

    if (options) {
      if (options.type) {
        documents = documents.filter(doc => doc.type === options.type);
      }

      if (options.localityName) {
        const localityDocumentIds = Array.from(this.documentLocalities.values())
          .filter(dl => dl.localityName === options.localityName)
          .map(dl => dl.documentId);
        
        documents = documents.filter(doc => localityDocumentIds.includes(doc.id));
      }

      if (options.keywords && options.keywords.length > 0) {
        documents = documents.filter(doc => {
          if (!doc.keywords) return false;
          return options.keywords!.some(keyword => 
            doc.keywords!.some(k => k.toLowerCase().includes(keyword.toLowerCase()))
          );
        });
      }
    }

    return documents;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentDocumentId++;
    const newDocument = { ...document, id } as Document;
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const existingDocument = this.documents.get(id);
    if (!existingDocument) return undefined;

    const updatedDocument = { ...existingDocument, ...document };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Document-locality operations
  async getDocumentLocalities(documentId: number): Promise<DocumentLocality[]> {
    return Array.from(this.documentLocalities.values())
      .filter(dl => dl.documentId === documentId);
  }

  async createDocumentLocality(documentLocality: InsertDocumentLocality): Promise<DocumentLocality> {
    const id = this.currentDocumentLocalityId++;
    const newDocumentLocality = { ...documentLocality, id } as DocumentLocality;
    this.documentLocalities.set(id, newDocumentLocality);
    return newDocumentLocality;
  }

  async deleteDocumentLocality(id: number): Promise<boolean> {
    return this.documentLocalities.delete(id);
  }

  // Document relationship operations
  async getDocumentRelationships(documentId: number): Promise<DocumentRelationship[]> {
    return Array.from(this.documentRelationships.values())
      .filter(dr => dr.sourceDocumentId === documentId || dr.targetDocumentId === documentId);
  }

  async createDocumentRelationship(relationship: InsertDocumentRelationship): Promise<DocumentRelationship> {
    const id = this.currentDocumentRelationshipId++;
    const newRelationship = { ...relationship, id } as DocumentRelationship;
    this.documentRelationships.set(id, newRelationship);
    return newRelationship;
  }

  async deleteDocumentRelationship(id: number): Promise<boolean> {
    return this.documentRelationships.delete(id);
  }

  // Search operations
  async saveSearchQuery(query: InsertSearchQuery): Promise<SearchQuery> {
    const id = this.currentSearchQueryId++;
    const timestamp = new Date();
    const newSearchQuery = { ...query, id, timestamp } as SearchQuery;
    this.searchQueries.set(id, newSearchQuery);
    return newSearchQuery;
  }

  async getRecentSearchQueries(limit: number = 10): Promise<SearchQuery[]> {
    return Array.from(this.searchQueries.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
