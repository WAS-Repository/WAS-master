import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, GitMerge, Clock, FileText, Plus, Minus, Edit, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useVersionControl, type Version, type Change } from '@/lib/versionControl';
import { format } from 'date-fns';

interface VersionControlPanelProps {
  workspaceMode: 'research' | 'story' | 'developer' | 'geographic';
  onVersionSelect?: (version: Version) => void;
}

export function VersionControlPanel({ workspaceMode, onVersionSelect }: VersionControlPanelProps) {
  const {
    versions,
    branches,
    currentBranch,
    stagedChanges,
    workingChanges,
    stageChange,
    unstageChange,
    commit,
    createBranch,
    switchBranch,
    getVersionHistory
  } = useVersionControl();
  
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  
  const versionHistory = getVersionHistory(20);
  
  const handleCommit = () => {
    if (!commitMessage.trim() || stagedChanges.length === 0) return;
    
    try {
      const hash = commit(commitMessage, 'User'); // In real app, get actual user
      setCommitMessage('');
      console.log('Committed with hash:', hash);
    } catch (error) {
      console.error('Commit failed:', error);
    }
  };
  
  const handleCreateBranch = () => {
    if (!newBranchName.trim()) return;
    
    try {
      createBranch(newBranchName);
      setNewBranchName('');
    } catch (error) {
      console.error('Failed to create branch:', error);
    }
  };
  
  const toggleVersionExpanded = (versionId: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(versionId)) {
      newExpanded.delete(versionId);
    } else {
      newExpanded.add(versionId);
    }
    setExpandedVersions(newExpanded);
  };
  
  const getChangeIcon = (type: Change['type']) => {
    switch (type) {
      case 'add': return <Plus size={14} className="text-green-500" />;
      case 'modify': return <Edit size={14} className="text-blue-500" />;
      case 'delete': return <Minus size={14} className="text-red-500" />;
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-gray-200">
      {/* Header */}
      <div className="border-b border-[#3e3e3e] p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <GitBranch size={16} />
            Version Control
          </h3>
          <Badge variant="outline" className="text-xs">
            {workspaceMode} mode
          </Badge>
        </div>
        
        {/* Branch selector */}
        <div className="flex items-center gap-2">
          <select
            value={currentBranch}
            onChange={(e) => switchBranch(e.target.value)}
            className="flex-1 bg-[#2d2d2d] border border-[#3e3e3e] text-sm px-2 py-1"
          >
            {branches.map(branch => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => {/* Show branch creation dialog */}}
          >
            New Branch
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="changes" className="flex-1 flex flex-col">
        <TabsList className="border-b border-[#3e3e3e] bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="changes" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#007acc] rounded-none px-4 py-2 text-xs"
          >
            Changes ({workingChanges.length + stagedChanges.length})
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#007acc] rounded-none px-4 py-2 text-xs"
          >
            History
          </TabsTrigger>
          <TabsTrigger 
            value="branches" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#007acc] rounded-none px-4 py-2 text-xs"
          >
            Branches ({branches.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="changes" className="flex-1 flex flex-col p-0">
          {/* Commit message input */}
          <div className="p-3 border-b border-[#3e3e3e]">
            <Textarea
              placeholder="Commit message..."
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="min-h-[60px] bg-[#2d2d2d] border-[#3e3e3e] text-sm resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {stagedChanges.length} staged, {workingChanges.length} unstaged
              </span>
              <Button
                size="sm"
                onClick={handleCommit}
                disabled={stagedChanges.length === 0 || !commitMessage.trim()}
                className="text-xs"
              >
                <GitCommit size={14} className="mr-1" />
                Commit
              </Button>
            </div>
          </div>
          
          {/* Changes list */}
          <ScrollArea className="flex-1">
            {/* Staged changes */}
            {stagedChanges.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-semibold mb-2 text-gray-400">STAGED CHANGES</h4>
                {stagedChanges.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1 hover:bg-[#2d2d2d] px-2 -mx-2 cursor-pointer"
                    onClick={() => unstageChange(change.path)}
                  >
                    <div className="flex items-center gap-2">
                      {getChangeIcon(change.type)}
                      <span className="text-xs">{change.path}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Working changes */}
            {workingChanges.length > 0 && (
              <div className="p-3">
                <h4 className="text-xs font-semibold mb-2 text-gray-400">CHANGES</h4>
                {workingChanges.map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1 hover:bg-[#2d2d2d] px-2 -mx-2 cursor-pointer"
                    onClick={() => stageChange(change)}
                  >
                    <div className="flex items-center gap-2">
                      {getChangeIcon(change.type)}
                      <span className="text-xs">{change.path}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {workingChanges.length === 0 && stagedChanges.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <FileText size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No changes detected</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="history" className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="p-3">
              {versionHistory.length > 0 ? (
                versionHistory.map((version) => (
                  <div key={version.id} className="mb-3 border-b border-[#3e3e3e] last:border-0 pb-3 last:pb-0">
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleVersionExpanded(version.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {expandedVersions.has(version.id) ? (
                            <ChevronDown size={14} className="text-gray-400" />
                          ) : (
                            <ChevronRight size={14} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <GitCommit size={14} className="text-[#007acc]" />
                            <span className="text-xs font-mono text-gray-400">
                              {version.hash.substring(0, 7)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(version.timestamp, 'MMM d, HH:mm')}
                            </span>
                          </div>
                          <p className="text-sm mb-1">{version.message}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{version.author}</span>
                            {version.metadata && (
                              <>
                                <span>+{version.metadata.additions}</span>
                                <span>-{version.metadata.deletions}</span>
                                <span>{version.metadata.fileCount} files</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expandedVersions.has(version.id) && (
                      <div className="ml-6 mt-2">
                        {version.changes.map((change, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-0.5 text-xs">
                            {getChangeIcon(change.type)}
                            <span className="text-gray-300">{change.path}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Clock size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No version history yet</p>
                  <p className="text-xs mt-1">Make your first commit to start tracking changes</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="branches" className="flex-1 p-0">
          <div className="p-3">
            {/* New branch creation */}
            <div className="mb-4 pb-4 border-b border-[#3e3e3e]">
              <div className="flex gap-2">
                <Input
                  placeholder="New branch name..."
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="flex-1 bg-[#2d2d2d] border-[#3e3e3e] text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleCreateBranch}
                  disabled={!newBranchName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
            
            {/* Branch list */}
            <div className="space-y-2">
              {branches.map(branch => (
                <div
                  key={branch.name}
                  className={`p-2 border ${
                    branch.name === currentBranch
                      ? 'border-[#007acc] bg-[#007acc]/10'
                      : 'border-[#3e3e3e] hover:bg-[#2d2d2d]'
                  } cursor-pointer`}
                  onClick={() => branch.name !== currentBranch && switchBranch(branch.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} />
                      <span className="text-sm font-medium">{branch.name}</span>
                      {branch.name === currentBranch && (
                        <Badge variant="outline" className="text-xs">current</Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {format(branch.createdAt, 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}