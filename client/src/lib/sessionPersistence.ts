// Session Persistence Service
// Ensures users can continue their work across Research, Story, and Developer modes

interface WorkspaceData {
  research: {
    notepadContent: string;
    openFiles: Array<{ name: string; path: string }>;
    activeFile: string;
  };
  story: {
    whiteboardElements: any[];
    tldrawSnapshot: any;
  };
  developer: {
    openFiles: Array<{ name: string; path: string }>;
    activeFile: string;
    terminalHistory: any[];
    ideState: any;
  };
}

interface SessionState {
  sessionId: string;
  userId: string;
  currentWorkspaceMode: 'research' | 'story' | 'developer';
  workspaceData: WorkspaceData;
  wasRepositories: any[];
  lastSaved: Date;
}

class SessionPersistenceService {
  private currentSession: SessionState | null = null;
  private autoSaveInterval: number | null = null;
  private readonly STORAGE_KEY = 'hampton-roads-session';
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  constructor() {
    this.loadSession();
    this.startAutoSave();
  }

  // Initialize or restore session
  async initializeSession(userId: string): Promise<SessionState> {
    // Try to restore from API first
    try {
      const response = await fetch(`/api/sessions/latest/${userId}`);
      if (response.ok) {
        const sessionData = await response.json();
        this.currentSession = {
          ...sessionData,
          lastSaved: new Date(sessionData.lastSaved)
        };
        this.saveToLocalStorage();
        return this.currentSession;
      }
    } catch (error) {
      console.log('No existing session found, creating new one');
    }

    // Create new session
    this.currentSession = {
      sessionId: this.generateSessionId(),
      userId,
      currentWorkspaceMode: 'research',
      workspaceData: {
        research: {
          notepadContent: '# Research Notes\n\n## Key Findings\n- \n\n## Questions\n- \n\n## Next Steps\n- ',
          openFiles: [],
          activeFile: ''
        },
        story: {
          whiteboardElements: [],
          tldrawSnapshot: null
        },
        developer: {
          openFiles: [],
          activeFile: '',
          terminalHistory: [],
          ideState: null
        }
      },
      wasRepositories: [],
      lastSaved: new Date()
    };

    await this.saveSession();
    return this.currentSession;
  }

  // Get current session
  getCurrentSession(): SessionState | null {
    return this.currentSession;
  }

  // Update workspace mode
  async setWorkspaceMode(mode: 'research' | 'story' | 'developer'): Promise<void> {
    if (this.currentSession) {
      this.currentSession.currentWorkspaceMode = mode;
      await this.saveSession();
    }
  }

  // Update research mode data
  async updateResearchData(data: Partial<WorkspaceData['research']>): Promise<void> {
    if (this.currentSession) {
      this.currentSession.workspaceData.research = {
        ...this.currentSession.workspaceData.research,
        ...data
      };
      this.currentSession.lastSaved = new Date();
    }
  }

  // Update story mode data
  async updateStoryData(data: Partial<WorkspaceData['story']>): Promise<void> {
    if (this.currentSession) {
      this.currentSession.workspaceData.story = {
        ...this.currentSession.workspaceData.story,
        ...data
      };
      this.currentSession.lastSaved = new Date();
    }
  }

  // Update developer mode data
  async updateDeveloperData(data: Partial<WorkspaceData['developer']>): Promise<void> {
    if (this.currentSession) {
      this.currentSession.workspaceData.developer = {
        ...this.currentSession.workspaceData.developer,
        ...data
      };
      this.currentSession.lastSaved = new Date();
    }
  }

  // Update WAS repositories
  async updateWasRepositories(repositories: any[]): Promise<void> {
    if (this.currentSession) {
      this.currentSession.wasRepositories = repositories;
      this.currentSession.lastSaved = new Date();
    }
  }

  // Save session to both local storage and API
  async saveSession(): Promise<void> {
    if (!this.currentSession) return;

    // Save to local storage immediately
    this.saveToLocalStorage();

    // Save to API
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.currentSession)
      });
    } catch (error) {
      console.warn('Failed to save session to server:', error);
    }
  }

  // Save specific document content
  async saveDocument(documentPath: string, content: string, workspaceMode: string): Promise<void> {
    if (!this.currentSession) return;

    try {
      await fetch('/api/sessions/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
          documentPath,
          content,
          workspaceMode
        })
      });
    } catch (error) {
      console.warn('Failed to save document to server:', error);
    }
  }

  // Load document content
  async loadDocument(documentPath: string, workspaceMode: string): Promise<string | null> {
    if (!this.currentSession) return null;

    try {
      const response = await fetch(`/api/sessions/documents/${this.currentSession.sessionId}/${encodeURIComponent(documentPath)}/${workspaceMode}`);
      if (response.ok) {
        const data = await response.json();
        return data.content;
      }
    } catch (error) {
      console.warn('Failed to load document from server:', error);
    }
    return null;
  }

  // Export session data
  exportSession(): void {
    if (!this.currentSession) return;

    const exportData = {
      session: this.currentSession,
      exportedAt: new Date(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `hampton-roads-session-${this.currentSession.sessionId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import session data
  async importSession(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.session && data.session.sessionId) {
        this.currentSession = {
          ...data.session,
          lastSaved: new Date(data.session.lastSaved)
        };
        await this.saveSession();
        return true;
      }
    } catch (error) {
      console.error('Failed to import session:', error);
    }
    return false;
  }

  // Private methods
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToLocalStorage(): void {
    if (this.currentSession) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentSession));
    }
  }

  private loadSession(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.currentSession = JSON.parse(saved);
        if (this.currentSession) {
          this.currentSession.lastSaved = new Date(this.currentSession.lastSaved);
        }
      } catch (error) {
        console.warn('Failed to load session from local storage:', error);
      }
    }
  }

  private startAutoSave(): void {
    this.autoSaveInterval = window.setInterval(() => {
      if (this.currentSession) {
        this.saveSession();
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  // Cleanup
  destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
}

// Global instance
export const sessionPersistence = new SessionPersistenceService();
export type { SessionState, WorkspaceData };