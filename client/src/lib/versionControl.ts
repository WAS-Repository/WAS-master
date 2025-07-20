// Version control system for tracking changes across all workspace modes
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Version {
  id: string;
  timestamp: Date;
  author: string;
  message: string;
  hash: string;
  parentHash?: string;
  changes: Change[];
  metadata?: {
    workspace: 'research' | 'story' | 'developer' | 'geographic';
    fileCount: number;
    additions: number;
    deletions: number;
  };
}

export interface Change {
  type: 'add' | 'modify' | 'delete';
  path: string;
  content?: string;
  previousContent?: string;
  diff?: string;
}

export interface Branch {
  name: string;
  head: string; // version hash
  isActive: boolean;
  createdAt: Date;
}

interface VersionControlState {
  versions: Version[];
  branches: Branch[];
  currentBranch: string;
  stagedChanges: Change[];
  workingChanges: Change[];
  
  // Actions
  stageChange: (change: Change) => void;
  unstageChange: (path: string) => void;
  commit: (message: string, author: string) => string;
  createBranch: (name: string) => void;
  switchBranch: (name: string) => void;
  mergeBranch: (sourceBranch: string) => void;
  getVersionHistory: (limit?: number) => Version[];
  getVersion: (hash: string) => Version | undefined;
  getDiff: (fromHash: string, toHash: string) => Change[];
  reset: (hash: string, mode: 'soft' | 'hard') => void;
}

// Simple hash function for demonstration
function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export const useVersionControl = create<VersionControlState>()(
  persist(
    (set, get) => ({
      versions: [],
      branches: [
        {
          name: 'main',
          head: '',
          isActive: true,
          createdAt: new Date()
        }
      ],
      currentBranch: 'main',
      stagedChanges: [],
      workingChanges: [],
      
      stageChange: (change) => {
        set((state) => {
          // Remove from working changes if exists
          const workingChanges = state.workingChanges.filter(c => c.path !== change.path);
          // Add to staged changes (replace if exists)
          const stagedChanges = state.stagedChanges.filter(c => c.path !== change.path);
          stagedChanges.push(change);
          
          return { workingChanges, stagedChanges };
        });
      },
      
      unstageChange: (path) => {
        set((state) => {
          const change = state.stagedChanges.find(c => c.path === path);
          if (!change) return state;
          
          const stagedChanges = state.stagedChanges.filter(c => c.path !== path);
          const workingChanges = [...state.workingChanges, change];
          
          return { stagedChanges, workingChanges };
        });
      },
      
      commit: (message, author) => {
        const state = get();
        if (state.stagedChanges.length === 0) {
          throw new Error('No changes staged for commit');
        }
        
        const currentBranch = state.branches.find(b => b.name === state.currentBranch);
        if (!currentBranch) {
          throw new Error('Current branch not found');
        }
        
        // Create commit content for hash
        const commitContent = JSON.stringify({
          message,
          author,
          changes: state.stagedChanges,
          parentHash: currentBranch.head,
          timestamp: new Date().toISOString()
        });
        
        const hash = generateHash(commitContent);
        
        const newVersion: Version = {
          id: `commit-${Date.now()}`,
          timestamp: new Date(),
          author,
          message,
          hash,
          parentHash: currentBranch.head || undefined,
          changes: [...state.stagedChanges],
          metadata: {
            workspace: 'developer', // This should be dynamic based on current mode
            fileCount: new Set(state.stagedChanges.map(c => c.path)).size,
            additions: state.stagedChanges.filter(c => c.type === 'add').length,
            deletions: state.stagedChanges.filter(c => c.type === 'delete').length
          }
        };
        
        set((state) => {
          const branches = state.branches.map(b => 
            b.name === state.currentBranch 
              ? { ...b, head: hash }
              : b
          );
          
          return {
            versions: [...state.versions, newVersion],
            branches,
            stagedChanges: [],
            workingChanges: state.workingChanges
          };
        });
        
        return hash;
      },
      
      createBranch: (name) => {
        const state = get();
        const currentBranch = state.branches.find(b => b.name === state.currentBranch);
        
        if (state.branches.some(b => b.name === name)) {
          throw new Error(`Branch ${name} already exists`);
        }
        
        const newBranch: Branch = {
          name,
          head: currentBranch?.head || '',
          isActive: false,
          createdAt: new Date()
        };
        
        set((state) => ({
          branches: [...state.branches, newBranch]
        }));
      },
      
      switchBranch: (name) => {
        const state = get();
        
        if (!state.branches.some(b => b.name === name)) {
          throw new Error(`Branch ${name} does not exist`);
        }
        
        if (state.stagedChanges.length > 0 || state.workingChanges.length > 0) {
          throw new Error('Cannot switch branches with uncommitted changes');
        }
        
        set((state) => ({
          currentBranch: name,
          branches: state.branches.map(b => ({
            ...b,
            isActive: b.name === name
          }))
        }));
      },
      
      mergeBranch: (sourceBranch) => {
        // Simplified merge - in reality this would handle conflicts
        const state = get();
        const source = state.branches.find(b => b.name === sourceBranch);
        const target = state.branches.find(b => b.name === state.currentBranch);
        
        if (!source || !target) {
          throw new Error('Invalid branch for merge');
        }
        
        // Find all commits from source that aren't in target
        const sourceCommits = state.versions.filter(v => {
          let current = v.hash;
          while (current === source.head) {
            if (current === target.head) return false;
            const version = state.versions.find(v => v.hash === current);
            current = version?.parentHash || '';
          }
          return true;
        });
        
        // Apply changes from source commits
        const mergeChanges: Change[] = [];
        sourceCommits.forEach(commit => {
          mergeChanges.push(...commit.changes);
        });
        
        // Create merge commit
        const mergeCommit: Version = {
          id: `merge-${Date.now()}`,
          timestamp: new Date(),
          author: 'System',
          message: `Merge branch '${sourceBranch}' into ${state.currentBranch}`,
          hash: generateHash(`merge-${sourceBranch}-${state.currentBranch}-${Date.now()}`),
          parentHash: target.head,
          changes: mergeChanges,
          metadata: {
            workspace: 'developer',
            fileCount: new Set(mergeChanges.map(c => c.path)).size,
            additions: mergeChanges.filter(c => c.type === 'add').length,
            deletions: mergeChanges.filter(c => c.type === 'delete').length
          }
        };
        
        set((state) => ({
          versions: [...state.versions, mergeCommit],
          branches: state.branches.map(b => 
            b.name === state.currentBranch 
              ? { ...b, head: mergeCommit.hash }
              : b
          )
        }));
      },
      
      getVersionHistory: (limit) => {
        const state = get();
        const currentBranch = state.branches.find(b => b.name === state.currentBranch);
        if (!currentBranch) return [];
        
        const history: Version[] = [];
        let currentHash = currentBranch.head;
        
        while (currentHash && (limit === undefined || history.length < limit)) {
          const version = state.versions.find(v => v.hash === currentHash);
          if (!version) break;
          
          history.push(version);
          currentHash = version.parentHash || '';
        }
        
        return history;
      },
      
      getVersion: (hash) => {
        return get().versions.find(v => v.hash === hash);
      },
      
      getDiff: (fromHash, toHash) => {
        const state = get();
        const fromVersion = state.versions.find(v => v.hash === fromHash);
        const toVersion = state.versions.find(v => v.hash === toHash);
        
        if (!fromVersion || !toVersion) return [];
        
        // Simplified diff - in reality this would compute actual differences
        const changes: Change[] = [];
        
        // Find all changes between versions
        let current = toHash;
        while (current !== fromHash) {
          const version = state.versions.find(v => v.hash === current);
          if (!version) break;
          
          changes.unshift(...version.changes);
          current = version.parentHash || '';
        }
        
        return changes;
      },
      
      reset: (hash, mode) => {
        const state = get();
        const version = state.versions.find(v => v.hash === hash);
        
        if (!version) {
          throw new Error('Version not found');
        }
        
        set((state) => {
          const branches = state.branches.map(b => 
            b.name === state.currentBranch 
              ? { ...b, head: hash }
              : b
          );
          
          if (mode === 'hard') {
            // Clear all working and staged changes
            return {
              branches,
              stagedChanges: [],
              workingChanges: []
            };
          } else {
            // Keep working changes
            return { branches };
          }
        });
      }
    }),
    {
      name: 'version-control-storage',
      partialize: (state) => ({
        versions: state.versions,
        branches: state.branches,
        currentBranch: state.currentBranch
      })
    }
  )
);

// Helper functions for workspace integration
export function trackFileChange(
  path: string,
  content: string,
  previousContent?: string,
  type: 'add' | 'modify' | 'delete' = 'modify'
): Change {
  return {
    type,
    path,
    content: type !== 'delete' ? content : undefined,
    previousContent,
    diff: previousContent && content 
      ? generateSimpleDiff(previousContent, content)
      : undefined
  };
}

function generateSimpleDiff(oldContent: string, newContent: string): string {
  // Very simple diff for demonstration
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const diff: string[] = [];
  
  const maxLines = Math.max(oldLines.length, newLines.length);
  
  for (let i = 0; i < maxLines; i++) {
    if (i >= oldLines.length) {
      diff.push(`+ ${newLines[i]}`);
    } else if (i >= newLines.length) {
      diff.push(`- ${oldLines[i]}`);
    } else if (oldLines[i] !== newLines[i]) {
      diff.push(`- ${oldLines[i]}`);
      diff.push(`+ ${newLines[i]}`);
    }
  }
  
  return diff.join('\n');
}