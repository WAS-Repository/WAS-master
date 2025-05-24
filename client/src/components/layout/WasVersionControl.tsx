import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Clock, 
  User, 
  Mail, 
  Save, 
  History, 
  Plus,
  Check,
  AlertCircle,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { wasVC, WasCommit, WasRepository } from '@/lib/wasVersionControl';

interface WasVersionControlProps {
  currentDocument?: string;
  documentContent?: string;
  onDocumentLoad?: (content: string) => void;
}

export default function WasVersionControl({ currentDocument, documentContent, onDocumentLoad }: WasVersionControlProps) {
  const [session, setSession] = useState(wasVC.getCurrentSession());
  const [userEmail, setUserEmail] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [pendingCommit, setPendingCommit] = useState<{ commitId: string; verificationCode: string } | null>(null);
  const [verificationInput, setVerificationInput] = useState('');
  const [documentHistory, setDocumentHistory] = useState<WasCommit[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!session) {
      const newSession = wasVC.startSession('user-' + Date.now());
      setSession(newSession);
    }
  }, []);

  useEffect(() => {
    if (currentDocument && documentContent) {
      wasVC.trackDocument(currentDocument, documentContent);
      loadDocumentHistory();
    }
  }, [currentDocument, documentContent]);

  const loadDocumentHistory = () => {
    if (currentDocument) {
      const history = wasVC.getDocumentHistory(currentDocument);
      setDocumentHistory(history);
    }
  };

  const handleCommit = async () => {
    if (!currentDocument || !commitMessage.trim() || !userEmail.trim()) return;

    try {
      const result = await wasVC.initiateCommit(currentDocument, commitMessage, userEmail);
      setPendingCommit(result);
      setCommitMessage('');
    } catch (error) {
      console.error('Failed to initiate commit:', error);
    }
  };

  const handleVerifyCommit = () => {
    if (!pendingCommit || !verificationInput.trim()) return;

    try {
      const commit = wasVC.completeCommit(pendingCommit.commitId, verificationInput);
      if (commit) {
        setPendingCommit(null);
        setVerificationInput('');
        loadDocumentHistory();
        setSession(wasVC.getCurrentSession());
      }
    } catch (error) {
      console.error('Failed to verify commit:', error);
    }
  };

  const handleLoadVersion = (commitId: string) => {
    const content = wasVC.getDocumentAtCommit(commitId);
    if (content && onDocumentLoad) {
      onDocumentLoad(content);
    }
  };

  const handleExportSession = () => {
    wasVC.endSession();
    setSession(null);
  };

  const sessionStats = wasVC.getSessionStats();
  const pendingChanges = wasVC.getPendingChanges();

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col text-white">
      {/* Header */}
      <div className="h-9 bg-[#252526] flex items-center justify-between px-3 py-1 border-b border-[#3e3e3e]">
        <div className="flex items-center">
          <GitBranch size={14} className="mr-2" />
          <span className="text-xs font-semibold">WAS Version Control</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={12} />
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Session Info */}
        <div className="bg-[#252526] rounded p-3 border border-[#3e3e3e]">
          <div className="text-xs font-semibold mb-2">Current Session</div>
          <div className="space-y-1 text-xs text-gray-300">
            <div>📊 {sessionStats.totalCommits} commits</div>
            <div>📁 {sessionStats.totalRepositories} repositories</div>
            <div>⏳ {sessionStats.pendingChanges} pending changes</div>
          </div>
        </div>

        {/* Pending Changes */}
        {pendingChanges.size > 0 && (
          <div className="bg-[#252526] rounded p-3 border border-[#3e3e3e]">
            <div className="text-xs font-semibold mb-2 flex items-center">
              <AlertCircle size={12} className="mr-1 text-yellow-400" />
              Pending Changes
            </div>
            <div className="space-y-1">
              {Array.from(pendingChanges.entries()).map(([path, content]) => (
                <div key={path} className="text-xs text-gray-300 truncate">
                  📄 {path.split('/').pop()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commit Interface */}
        {currentDocument && !pendingCommit && (
          <div className="bg-[#252526] rounded p-3 border border-[#3e3e3e]">
            <div className="text-xs font-semibold mb-3">Commit Changes</div>
            
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-[#3c3c3c] text-white text-xs p-2 rounded border border-[#3e3e3e]"
              />
              
              <textarea
                placeholder="Commit message..."
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full bg-[#3c3c3c] text-white text-xs p-2 rounded border border-[#3e3e3e] h-16 resize-none"
              />
              
              <Button 
                size="sm" 
                className="w-full bg-[#007acc] hover:bg-[#005a9e]"
                onClick={handleCommit}
                disabled={!commitMessage.trim() || !userEmail.trim()}
              >
                <Save size={12} className="mr-1" />
                Commit Changes
              </Button>
            </div>
          </div>
        )}

        {/* Email Verification */}
        {pendingCommit && (
          <div className="bg-[#252526] rounded p-3 border border-yellow-500">
            <div className="text-xs font-semibold mb-2 flex items-center">
              <Mail size={12} className="mr-1 text-yellow-400" />
              Email Verification Required
            </div>
            
            <div className="text-xs text-gray-300 mb-3">
              Check your email for verification code: {pendingCommit.verificationCode}
            </div>
            
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                className="w-full bg-[#3c3c3c] text-white text-xs p-2 rounded border border-[#3e3e3e]"
              />
              
              <Button 
                size="sm" 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleVerifyCommit}
                disabled={!verificationInput.trim()}
              >
                <Check size={12} className="mr-1" />
                Verify & Complete
              </Button>
            </div>
          </div>
        )}

        {/* Document History */}
        {showHistory && currentDocument && (
          <div className="bg-[#252526] rounded p-3 border border-[#3e3e3e]">
            <div className="text-xs font-semibold mb-3">Document History</div>
            
            {documentHistory.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-auto">
                {documentHistory.map((commit) => (
                  <div 
                    key={commit.id}
                    className="p-2 bg-[#3c3c3c] rounded hover:bg-[#404040] cursor-pointer transition-colors"
                    onClick={() => handleLoadVersion(commit.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-xs font-medium text-white">{commit.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          <div className="flex items-center">
                            <User size={10} className="mr-1" />
                            {commit.author}
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock size={10} className="mr-1" />
                            {new Date(commit.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <GitCommit size={12} />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      <span className="text-green-400">+{commit.changes.added}</span>
                      {' '}
                      <span className="text-red-400">-{commit.changes.removed}</span>
                      {' '}
                      <span className="text-yellow-400">~{commit.changes.modified}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center py-4">
                No commits yet for this document
              </div>
            )}
          </div>
        )}

        {/* Session Actions */}
        <div className="bg-[#252526] rounded p-3 border border-[#3e3e3e]">
          <div className="text-xs font-semibold mb-2">Session Actions</div>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full"
            onClick={handleExportSession}
          >
            <Download size={12} className="mr-1" />
            Export & End Session
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#252526] border-t border-[#3e3e3e] flex items-center justify-between px-3 text-xs text-gray-400">
        <span>WAS Protocol v1.0</span>
        <span>{session ? 'Session Active' : 'No Session'}</span>
      </div>
    </div>
  );
}