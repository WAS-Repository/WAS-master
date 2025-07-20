import { 
  Document, InsertDocument, 
  DocumentLocality, InsertDocumentLocality,
  DocumentRelationship, InsertDocumentRelationship,
  SearchQuery, InsertSearchQuery,
  UserSession, InsertUserSession,
  SessionDocument, InsertSessionDocument,
  WasCommitHistory, InsertWasCommitHistory
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
  private userSessions: Map<string, UserSession>;
  private sessionDocuments: Map<string, SessionDocument>;
  private wasCommits: Map<string, WasCommitHistory>;
  private currentDocumentId: number;
  private currentDocumentLocalityId: number;
  private currentDocumentRelationshipId: number;
  private currentSearchQueryId: number;
  private currentSessionId: number;
  private currentSessionDocumentId: number;
  private currentWasCommitId: number;

  constructor() {
    this.documents = new Map();
    this.documentLocalities = new Map();
    this.documentRelationships = new Map();
    this.searchQueries = new Map();
    this.userSessions = new Map();
    this.sessionDocuments = new Map();
    this.wasCommits = new Map();
    this.currentDocumentId = 1;
    this.currentDocumentLocalityId = 1;
    this.currentDocumentRelationshipId = 1;
    this.currentSearchQueryId = 1;
    this.currentSessionId = 1;
    this.currentSessionDocumentId = 1;
    this.currentWasCommitId = 1;
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

  // Session persistence operations
  async createOrUpdateSession(session: InsertUserSession): Promise<UserSession> {
    const existingSession = Array.from(this.userSessions.values())
      .find(s => s.userId === session.userId);
    
    if (existingSession) {
      const updatedSession = { ...existingSession, ...session, lastAccessed: new Date() };
      this.userSessions.set(existingSession.sessionId, updatedSession);
      return updatedSession;
    } else {
      const sessionId = `session-${this.currentSessionId++}`;
      const newSession = { 
        ...session, 
        id: this.currentSessionId - 1,
        sessionId,
        lastAccessed: new Date(),
        createdAt: new Date()
      } as UserSession;
      this.userSessions.set(sessionId, newSession);
      return newSession;
    }
  }

  async getLatestSession(userId: string): Promise<UserSession | undefined> {
    return Array.from(this.userSessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())[0];
  }

  async saveSessionDocument(doc: InsertSessionDocument): Promise<SessionDocument> {
    const id = this.currentSessionDocumentId++;
    const key = `${doc.sessionId}-${doc.documentPath}-${doc.workspaceMode}`;
    const newDocument = { 
      ...doc, 
      id, 
      lastModified: new Date() 
    } as SessionDocument;
    this.sessionDocuments.set(key, newDocument);
    return newDocument;
  }

  async getSessionDocument(sessionId: string, documentPath: string, workspaceMode: string): Promise<SessionDocument | undefined> {
    const key = `${sessionId}-${documentPath}-${workspaceMode}`;
    return this.sessionDocuments.get(key);
  }

  async saveWasCommit(commit: InsertWasCommitHistory): Promise<WasCommitHistory> {
    const id = this.currentWasCommitId++;
    const newCommit = { 
      ...commit, 
      id, 
      timestamp: new Date() 
    } as WasCommitHistory;
    this.wasCommits.set(commit.commitId, newCommit);
    return newCommit;
  }

  async getWasCommits(sessionId: string): Promise<WasCommitHistory[]> {
    return Array.from(this.wasCommits.values())
      .filter(c => c.sessionId === sessionId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
