import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Globe, 
  FileText, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Trash2,
  TestTube
} from 'lucide-react';
import { dataSourceService, type DataSource } from '@/lib/dataSources';

interface DataSourceManagerProps {
  onSourceSelect?: (source: DataSource) => void;
}

export default function DataSourceManager({ onSourceSelect }: DataSourceManagerProps) {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [healthStatus, setHealthStatus] = useState<Record<string, { status: string; lastSync?: Date; error?: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadSources();
    loadHealthStatus();
  }, []);

  const loadSources = () => {
    const sources = dataSourceService.getSources();
    setSources(sources);
  };

  const loadHealthStatus = () => {
    const health = dataSourceService.getSourceHealth();
    setHealthStatus(health);
  };

  const handleSyncSource = async (sourceId: string) => {
    setIsLoading(true);
    try {
      const success = await dataSourceService.syncSource(sourceId);
      if (success) {
        loadHealthStatus();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (sourceId: string) => {
    setIsLoading(true);
    try {
      const result = await dataSourceService.testConnection(sourceId);
      if (result.success) {
        loadHealthStatus();
      }
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSource = (sourceId: string) => {
    dataSourceService.removeSource(sourceId);
    loadSources();
    loadHealthStatus();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      case 'disconnected':
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'local':
        return <FileText size={16} className="text-blue-500" />;
      case 'api':
        return <Globe size={16} className="text-green-500" />;
      case 'database':
        return <Database size={16} className="text-purple-500" />;
      case 'external':
        return <Settings size={16} className="text-orange-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Data Sources</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              dataSourceService.syncAll();
              loadHealthStatus();
            }}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={14} className="mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <Card key={source.id} className="bg-[#2d2d2d] border-[#3e3e3e]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getSourceIcon(source.type)}
                  <CardTitle className="text-sm text-white">{source.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(healthStatus[source.id]?.status || 'disconnected')}
                  <Badge variant="outline" className="text-xs">
                    {source.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {source.url && (
                  <div className="text-xs text-gray-400 truncate">
                    {source.url}
                  </div>
                )}
                
                {source.lastSync && (
                  <div className="text-xs text-gray-500">
                    Last sync: {new Date(source.lastSync).toLocaleString()}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSyncSource(source.id)}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    <RefreshCw size={12} className="mr-1" />
                    Sync
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestConnection(source.id)}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    <TestTube size={12} className="mr-1" />
                    Test
                  </Button>

                  {onSourceSelect && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSourceSelect(source)}
                      className="text-xs"
                    >
                      Select
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSource(source.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>

                {healthStatus[source.id]?.error && (
                  <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
                    Error: {healthStatus[source.id].error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Database size={48} className="mx-auto mb-4 text-gray-600" />
          <p>No data sources configured</p>
          <p className="text-sm">Add a data source to get started</p>
        </div>
      )}

      {/* Add Source Form - Placeholder for future implementation */}
      {showAddForm && (
        <Card className="bg-[#2d2d2d] border-[#3e3e3e]">
          <CardHeader>
            <CardTitle className="text-white">Add Data Source</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">
              Data source configuration form will be implemented here.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button size="sm" disabled>
                Add Source
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 