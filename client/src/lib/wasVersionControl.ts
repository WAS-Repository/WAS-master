// WAS Version Control Protocol
// A custom version control system for document management

export interface WasCommit {
  id: string;
  timestamp: Date;
  author: string;
  email: string;
  message: string;
  documentPath: string;
  content: string;
  contentHash: string;
  parentCommitId?: string;
  changes: {
    added: number;
    removed: number;
    modified: number;
  };
}

export interface WasRepository {
  id: string;
  name: string;
  createdAt: Date;
  commits: WasCommit[];
  branches: WasBranch[];
  currentBranch: string;
}

export interface WasBranch {
  name: string;
  headCommitId: string;
  createdAt: Date;
}

export interface WasSession {
  id: string;
  userId: string;
  startTime: Date;
  repositories: WasRepository[];
  pendingChanges: Map<string, string>; // documentPath -> content
}

export class WasVersionControl {
  private session: WasSession | null = null;
  private storageKey = 'was-session-data';

  constructor() {
    this.loadSession();
  }

  // Session Management
  startSession(userId: string): WasSession {
    this.session = {
      id: this.generateId(),
      userId,
      startTime: new Date(),
      repositories: [],
      pendingChanges: new Map()
    };
    this.saveSession();
    return this.session;
  }

  getCurrentSession(): WasSession | null {
    return this.session;
  }

  endSession(): void {
    if (this.session) {
      // Save final state to local device
      this.exportSessionToDevice();
      this.session = null;
      localStorage.removeItem(this.storageKey);
    }
  }

  // Repository Management
  createRepository(name: string): WasRepository {
    if (!this.session) throw new Error('No active session');

    const repo: WasRepository = {
      id: this.generateId(),
      name,
      createdAt: new Date(),
      commits: [],
      branches: [{
        name: 'main',
        headCommitId: '',
        createdAt: new Date()
      }],
      currentBranch: 'main'
    };

    this.session.repositories.push(repo);
    this.saveSession();
    return repo;
  }

  getRepository(name: string): WasRepository | undefined {
    if (!this.session) return undefined;
    return this.session.repositories.find(repo => repo.name === name);
  }

  // Document Tracking
  trackDocument(documentPath: string, content: string): void {
    if (!this.session) throw new Error('No active session');
    this.session.pendingChanges.set(documentPath, content);
    this.saveSession();
  }

  getPendingChanges(): Map<string, string> {
    return this.session?.pendingChanges || new Map();
  }

  // Email-based Commit System
  async initiateCommit(documentPath: string, message: string, userEmail: string): Promise<{ commitId: string; verificationCode: string }> {
    if (!this.session) throw new Error('No active session');

    const content = this.session.pendingChanges.get(documentPath);
    if (!content) throw new Error('No changes to commit for this document');

    const commitId = this.generateId();
    const verificationCode = this.generateVerificationCode();

    // Store pending commit
    const pendingCommit = {
      commitId,
      documentPath,
      content,
      message,
      userEmail,
      verificationCode,
      timestamp: new Date()
    };

    localStorage.setItem(`was-pending-commit-${commitId}`, JSON.stringify(pendingCommit));

    // In a real implementation, this would send an email
    console.log(`WAS Commit Verification Email
To: ${userEmail}
Subject: Verify Your WAS Commit

Document: ${documentPath}
Message: ${message}
Verification Code: ${verificationCode}

Reply to this email with the verification code to complete your commit.`);

    return { commitId, verificationCode };
  }

  // Complete commit with email verification
  completeCommit(commitId: string, verificationCode: string): WasCommit | null {
    const pendingCommitData = localStorage.getItem(`was-pending-commit-${commitId}`);
    if (!pendingCommitData) return null;

    const pendingCommit = JSON.parse(pendingCommitData);
    if (pendingCommit.verificationCode !== verificationCode) {
      throw new Error('Invalid verification code');
    }

    if (!this.session) throw new Error('No active session');

    // Find or create repository
    let repo = this.getRepository('default') || this.createRepository('default');
    
    // Get parent commit
    const currentBranch = repo.branches.find(b => b.name === repo.currentBranch);
    const parentCommitId = currentBranch?.headCommitId || undefined;

    // Calculate changes
    const changes = this.calculateChanges(pendingCommit.documentPath, pendingCommit.content, repo);

    // Create commit
    const commit: WasCommit = {
      id: commitId,
      timestamp: new Date(),
      author: this.extractNameFromEmail(pendingCommit.userEmail),
      email: pendingCommit.userEmail,
      message: pendingCommit.message,
      documentPath: pendingCommit.documentPath,
      content: pendingCommit.content,
      contentHash: this.hashContent(pendingCommit.content),
      parentCommitId,
      changes
    };

    // Add commit to repository
    repo.commits.push(commit);
    
    // Update branch head
    if (currentBranch) {
      currentBranch.headCommitId = commitId;
    }

    // Clear pending changes
    this.session.pendingChanges.delete(pendingCommit.documentPath);

    // Clean up
    localStorage.removeItem(`was-pending-commit-${commitId}`);
    this.saveSession();

    return commit;
  }

  // Document History
  getDocumentHistory(documentPath: string): WasCommit[] {
    if (!this.session) return [];
    
    const repo = this.getRepository('default');
    if (!repo) return [];

    return repo.commits
      .filter(commit => commit.documentPath === documentPath)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getDocumentAtCommit(commitId: string): string | null {
    if (!this.session) return null;
    
    const repo = this.getRepository('default');
    if (!repo) return null;

    const commit = repo.commits.find(c => c.id === commitId);
    return commit?.content || null;
  }

  // Branching
  createBranch(name: string, fromCommitId?: string): WasBranch {
    if (!this.session) throw new Error('No active session');
    
    const repo = this.getRepository('default') || this.createRepository('default');
    const headCommitId = fromCommitId || repo.branches.find(b => b.name === repo.currentBranch)?.headCommitId || '';

    const branch: WasBranch = {
      name,
      headCommitId,
      createdAt: new Date()
    };

    repo.branches.push(branch);
    this.saveSession();
    return branch;
  }

  switchBranch(branchName: string): boolean {
    if (!this.session) return false;
    
    const repo = this.getRepository('default');
    if (!repo) return false;

    const branch = repo.branches.find(b => b.name === branchName);
    if (!branch) return false;

    repo.currentBranch = branchName;
    this.saveSession();
    return true;
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateVerificationCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private hashContent(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private extractNameFromEmail(email: string): string {
    return email.split('@')[0].replace(/[._]/g, ' ');
  }

  private calculateChanges(documentPath: string, newContent: string, repo: WasRepository): { added: number; removed: number; modified: number } {
    const latestCommit = repo.commits
      .filter(c => c.documentPath === documentPath)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    if (!latestCommit) {
      return {
        added: newContent.split('\n').length,
        removed: 0,
        modified: 0
      };
    }

    const oldLines = latestCommit.content.split('\n');
    const newLines = newContent.split('\n');

    // Simple diff calculation
    const maxLines = Math.max(oldLines.length, newLines.length);
    let added = 0, removed = 0, modified = 0;

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';

      if (oldLine && !newLine) removed++;
      else if (!oldLine && newLine) added++;
      else if (oldLine !== newLine) modified++;
    }

    return { added, removed, modified };
  }

  // Session Persistence
  private saveSession(): void {
    if (this.session) {
      // Convert Map to object for JSON serialization
      const sessionData = {
        ...this.session,
        pendingChanges: Object.fromEntries(this.session.pendingChanges)
      };
      localStorage.setItem(this.storageKey, JSON.stringify(sessionData));
    }
  }

  private loadSession(): void {
    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      const sessionData = JSON.parse(savedData);
      this.session = {
        ...sessionData,
        pendingChanges: new Map(Object.entries(sessionData.pendingChanges || {}))
      };
    }
  }

  // Export to Device
  private exportSessionToDevice(): void {
    if (!this.session) return;

    const exportData = {
      session: this.session,
      exportedAt: new Date(),
      wasVersion: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `was-session-${this.session.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Statistics
  getSessionStats(): { totalCommits: number; totalRepositories: number; pendingChanges: number } {
    if (!this.session) return { totalCommits: 0, totalRepositories: 0, pendingChanges: 0 };

    const totalCommits = this.session.repositories.reduce((sum, repo) => sum + repo.commits.length, 0);
    
    return {
      totalCommits,
      totalRepositories: this.session.repositories.length,
      pendingChanges: this.session.pendingChanges.size
    };
  }
}

// Global instance
export const wasVC = new WasVersionControl();