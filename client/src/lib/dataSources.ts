// Data Source Integration Service
// Handles connections to various backend data sources including files, APIs, and databases

export interface DataSource {
  id: string;
  name: string;
  type: 'local' | 'api' | 'database' | 'external';
  url?: string;
  credentials?: {
    apiKey?: string;
    username?: string;
    password?: string;
  };
  metadata?: Record<string, any>;
  lastSync?: Date;
  status: 'connected' | 'disconnected' | 'error';
}

export interface DataSourceConfig {
  sources: DataSource[];
  defaultSource?: string;
  autoSync: boolean;
  syncInterval: number; // in minutes
}

export class DataSourceService {
  private config: DataSourceConfig;
  private syncInterval?: NodeJS.Timeout;

  constructor() {
    this.config = {
      sources: [
        {
          id: 'local-files',
          name: 'Local Files',
          type: 'local',
          status: 'connected',
          metadata: {
            basePath: '/uploads',
            allowedTypes: ['pdf', 'docx', 'txt', 'md', 'json', 'csv']
          }
        },
        {
          id: 'world-archive-api',
          name: 'World Archive API',
          type: 'api',
          url: '/api',
          status: 'connected',
          metadata: {
            endpoints: ['documents', 'files', 'sessions']
          }
        },
        {
          id: 'geographic-data',
          name: 'Geographic Data',
          type: 'api',
          url: '/api/geojson',
          status: 'connected',
          metadata: {
            dataType: 'geojson',
            regions: ['hampton-roads', 'world-archive']
          }
        }
      ],
      defaultSource: 'local-files',
      autoSync: true,
      syncInterval: 5
    };

    if (this.config.autoSync) {
      this.startAutoSync();
    }
  }

  // Get all configured data sources
  getSources(): DataSource[] {
    return this.config.sources;
  }

  // Get a specific data source
  getSource(id: string): DataSource | undefined {
    return this.config.sources.find(source => source.id === id);
  }

  // Add a new data source
  addSource(source: DataSource): void {
    this.config.sources.push(source);
    this.saveConfig();
  }

  // Remove a data source
  removeSource(id: string): void {
    this.config.sources = this.config.sources.filter(source => source.id !== id);
    this.saveConfig();
  }

  // Update data source status
  updateSourceStatus(id: string, status: DataSource['status']): void {
    const source = this.getSource(id);
    if (source) {
      source.status = status;
      source.lastSync = new Date();
      this.saveConfig();
    }
  }

  // Sync data from a specific source
  async syncSource(id: string): Promise<boolean> {
    const source = this.getSource(id);
    if (!source) return false;

    try {
      switch (source.type) {
        case 'local':
          return await this.syncLocalFiles(source);
        case 'api':
          return await this.syncAPI(source);
        case 'database':
          return await this.syncDatabase(source);
        case 'external':
          return await this.syncExternal(source);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error syncing source ${id}:`, error);
      this.updateSourceStatus(id, 'error');
      return false;
    }
  }

  // Sync all sources
  async syncAll(): Promise<void> {
    const promises = this.config.sources.map(source => this.syncSource(source.id));
    await Promise.allSettled(promises);
  }

  // Local files sync
  private async syncLocalFiles(source: DataSource): Promise<boolean> {
    try {
      const response = await fetch('/api/files');
      if (response.ok) {
        this.updateSourceStatus(source.id, 'connected');
        return true;
      } else {
        this.updateSourceStatus(source.id, 'error');
        return false;
      }
    } catch (error) {
      this.updateSourceStatus(source.id, 'error');
      return false;
    }
  }

  // API sync
  private async syncAPI(source: DataSource): Promise<boolean> {
    if (!source.url) return false;

    try {
      const response = await fetch(source.url);
      if (response.ok) {
        this.updateSourceStatus(source.id, 'connected');
        return true;
      } else {
        this.updateSourceStatus(source.id, 'error');
        return false;
      }
    } catch (error) {
      this.updateSourceStatus(source.id, 'error');
      return false;
    }
  }

  // Database sync (placeholder for future implementation)
  private async syncDatabase(source: DataSource): Promise<boolean> {
    // This would connect to external databases
    console.log('Database sync not implemented yet');
    return false;
  }

  // External service sync (placeholder for future implementation)
  private async syncExternal(source: DataSource): Promise<boolean> {
    // This would connect to external APIs
    console.log('External sync not implemented yet');
    return false;
  }

  // Start automatic sync
  startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, this.config.syncInterval * 60 * 1000);
  }

  // Stop automatic sync
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  // Save configuration to localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem('dataSourceConfig', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save data source config:', error);
    }
  }

  // Load configuration from localStorage
  loadConfig(): void {
    try {
      const saved = localStorage.getItem('dataSourceConfig');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load data source config:', error);
    }
  }

  // Get source health status
  getSourceHealth(): Record<string, { status: string; lastSync?: Date; error?: string }> {
    const health: Record<string, { status: string; lastSync?: Date; error?: string }> = {};
    
    this.config.sources.forEach(source => {
      health[source.id] = {
        status: source.status,
        lastSync: source.lastSync
      };
    });

    return health;
  }

  // Test connection to a source
  async testConnection(id: string): Promise<{ success: boolean; error?: string }> {
    const source = this.getSource(id);
    if (!source) {
      return { success: false, error: 'Source not found' };
    }

    try {
      const success = await this.syncSource(id);
      return { success };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance
export const dataSourceService = new DataSourceService(); 