// D3 Visualization System for Hampton Roads Research Platform

export interface VisualizationConfig {
  id: string;
  name: string;
  type: 'chart' | 'map' | 'graph' | 'diagram';
  description: string;
  category: 'coastal' | 'environmental' | 'infrastructure' | 'demographic' | 'economic';
  requiredData: string[];
  customizable: boolean;
  terminalCommand?: string;
}

export const availableVisualizations: VisualizationConfig[] = [
  // Coastal Visualizations
  {
    id: 'sea-level-trends',
    name: 'Sea Level Trends',
    type: 'chart',
    description: 'Interactive line chart showing historical and projected sea level changes',
    category: 'coastal',
    requiredData: ['sea_level_data', 'timestamps'],
    customizable: true,
    terminalCommand: 'viz create sea-level-trends --data=sea_level --timespan=50years'
  },
  {
    id: 'coastal-erosion-map',
    name: 'Coastal Erosion Mapping',
    type: 'map',
    description: 'Geographic visualization of erosion patterns and rates',
    category: 'coastal',
    requiredData: ['erosion_data', 'geographic_boundaries'],
    customizable: true,
    terminalCommand: 'viz create coastal-erosion --type=choropleth --resolution=high'
  },
  {
    id: 'storm-surge-simulation',
    name: 'Storm Surge Simulation',
    type: 'map',
    description: 'Dynamic visualization of storm surge impacts and flood zones',
    category: 'coastal',
    requiredData: ['elevation_data', 'storm_data', 'infrastructure_locations'],
    customizable: true,
    terminalCommand: 'viz create storm-surge --scenario=category3 --animation=true'
  },

  // Environmental Visualizations
  {
    id: 'water-quality-dashboard',
    name: 'Water Quality Dashboard',
    type: 'chart',
    description: 'Multi-metric dashboard showing water quality indicators',
    category: 'environmental',
    requiredData: ['water_quality_measurements', 'monitoring_stations'],
    customizable: true,
    terminalCommand: 'viz create water-quality --metrics=ph,dissolved_oxygen,turbidity'
  },
  {
    id: 'wetland-loss-timeline',
    name: 'Wetland Loss Timeline',
    type: 'chart',
    description: 'Temporal visualization of wetland area changes',
    category: 'environmental',
    requiredData: ['wetland_area_data', 'satellite_imagery_dates'],
    customizable: true,
    terminalCommand: 'viz create wetland-loss --timespan=30years --animation=true'
  },
  {
    id: 'habitat-network',
    name: 'Habitat Connectivity Network',
    type: 'graph',
    description: 'Network diagram showing ecosystem connectivity and corridors',
    category: 'environmental',
    requiredData: ['habitat_data', 'connectivity_analysis'],
    customizable: true,
    terminalCommand: 'viz create habitat-network --layout=force --species=migratory_birds'
  },

  // Infrastructure Visualizations
  {
    id: 'infrastructure-vulnerability',
    name: 'Infrastructure Vulnerability Assessment',
    type: 'map',
    description: 'Risk assessment visualization for critical infrastructure',
    category: 'infrastructure',
    requiredData: ['infrastructure_inventory', 'vulnerability_scores', 'flood_zones'],
    customizable: true,
    terminalCommand: 'viz create infra-vulnerability --risk-level=high --infrastructure=all'
  },
  {
    id: 'transportation-flow',
    name: 'Transportation Flow Analysis',
    type: 'diagram',
    description: 'Flow diagram showing transportation patterns and disruptions',
    category: 'infrastructure',
    requiredData: ['traffic_data', 'road_network', 'disruption_events'],
    customizable: true,
    terminalCommand: 'viz create transport-flow --mode=animated --time-window=24hours'
  },
  {
    id: 'utility-resilience',
    name: 'Utility System Resilience',
    type: 'graph',
    description: 'Network analysis of utility system redundancy and failure points',
    category: 'infrastructure',
    requiredData: ['utility_network', 'outage_history', 'redundancy_analysis'],
    customizable: true,
    terminalCommand: 'viz create utility-resilience --system=electrical --analysis=cascading'
  },

  // Demographic Visualizations
  {
    id: 'population-vulnerability',
    name: 'Population Vulnerability Index',
    type: 'map',
    description: 'Choropleth map showing social vulnerability to climate impacts',
    category: 'demographic',
    requiredData: ['census_data', 'vulnerability_indicators', 'geographic_boundaries'],
    customizable: true,
    terminalCommand: 'viz create pop-vulnerability --indicators=age,income,mobility --resolution=tract'
  },
  {
    id: 'evacuation-capacity',
    name: 'Evacuation Capacity Analysis',
    type: 'diagram',
    description: 'Flow analysis of evacuation routes and shelter capacity',
    category: 'demographic',
    requiredData: ['population_data', 'evacuation_routes', 'shelter_capacity'],
    customizable: true,
    terminalCommand: 'viz create evacuation --scenario=hurricane --time-analysis=true'
  },

  // Economic Visualizations
  {
    id: 'economic-impact-assessment',
    name: 'Economic Impact Assessment',
    type: 'chart',
    description: 'Cost-benefit analysis of climate adaptation strategies',
    category: 'economic',
    requiredData: ['economic_data', 'impact_projections', 'adaptation_costs'],
    customizable: true,
    terminalCommand: 'viz create economic-impact --timespan=30years --discount-rate=3.5'
  },
  {
    id: 'property-risk-valuation',
    name: 'Property Risk Valuation',
    type: 'map',
    description: 'Real estate risk assessment with climate projections',
    category: 'economic',
    requiredData: ['property_values', 'flood_risk', 'market_trends'],
    customizable: true,
    terminalCommand: 'viz create property-risk --risk-factors=flood,wind,storm_surge'
  }
];

export interface VisualizationInstance {
  id: string;
  configId: string;
  title: string;
  parameters: Record<string, any>;
  data: any;
  createdAt: Date;
  lastModified: Date;
}

export class VisualizationManager {
  private instances: Map<string, VisualizationInstance> = new Map();
  
  getAvailableVisualizations(): VisualizationConfig[] {
    return availableVisualizations;
  }

  getVisualizationsByCategory(category: string): VisualizationConfig[] {
    return availableVisualizations.filter(viz => viz.category === category);
  }

  getVisualizationsByType(type: string): VisualizationConfig[] {
    return availableVisualizations.filter(viz => viz.type === type);
  }

  createVisualization(configId: string, title: string, parameters: Record<string, any>, data?: any): VisualizationInstance {
    const config = availableVisualizations.find(viz => viz.id === configId);
    if (!config) throw new Error(`Visualization config not found: ${configId}`);

    const instance: VisualizationInstance = {
      id: this.generateId(),
      configId,
      title,
      parameters,
      data: data || this.generateSampleData(config),
      createdAt: new Date(),
      lastModified: new Date()
    };

    this.instances.set(instance.id, instance);
    return instance;
  }

  updateVisualization(id: string, updates: Partial<VisualizationInstance>): VisualizationInstance | null {
    const instance = this.instances.get(id);
    if (!instance) return null;

    const updated = {
      ...instance,
      ...updates,
      lastModified: new Date()
    };

    this.instances.set(id, updated);
    return updated;
  }

  deleteVisualization(id: string): boolean {
    return this.instances.delete(id);
  }

  getVisualization(id: string): VisualizationInstance | undefined {
    return this.instances.get(id);
  }

  getAllInstances(): VisualizationInstance[] {
    return Array.from(this.instances.values());
  }

  executeTerminalCommand(command: string): { success: boolean; message: string; instanceId?: string } {
    const parts = command.trim().split(' ');
    if (parts[0] !== 'viz') {
      return { success: false, message: 'Unknown command. Use "viz help" for available commands.' };
    }

    const action = parts[1];
    
    switch (action) {
      case 'help':
        return {
          success: true,
          message: this.getHelpMessage()
        };
      
      case 'list':
        return {
          success: true,
          message: this.getVisualizationsList()
        };
      
      case 'create':
        return this.handleCreateCommand(parts.slice(2));
      
      case 'update':
        return this.handleUpdateCommand(parts.slice(2));
      
      case 'delete':
        return this.handleDeleteCommand(parts.slice(2));
      
      default:
        return { success: false, message: `Unknown action: ${action}. Use "viz help" for available commands.` };
    }
  }

  private handleCreateCommand(args: string[]): { success: boolean; message: string; instanceId?: string } {
    if (args.length === 0) {
      return { success: false, message: 'Missing visualization type. Example: viz create sea-level-trends' };
    }

    const configId = args[0];
    const config = availableVisualizations.find(viz => viz.id === configId);
    
    if (!config) {
      return { success: false, message: `Visualization not found: ${configId}. Use "viz list" to see available options.` };
    }

    // Parse parameters from command line
    const parameters: Record<string, any> = {};
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        parameters[key] = value || true;
      }
    }

    const instance = this.createVisualization(configId, config.name, parameters);
    
    return {
      success: true,
      message: `Created visualization: ${config.name} (ID: ${instance.id})`,
      instanceId: instance.id
    };
  }

  private handleUpdateCommand(args: string[]): { success: boolean; message: string } {
    if (args.length < 2) {
      return { success: false, message: 'Usage: viz update <id> --parameter=value' };
    }

    const instanceId = args[0];
    const instance = this.instances.get(instanceId);
    
    if (!instance) {
      return { success: false, message: `Visualization not found: ${instanceId}` };
    }

    // Parse parameters
    const parameters = { ...instance.parameters };
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        parameters[key] = value || true;
      }
    }

    this.updateVisualization(instanceId, { parameters });
    
    return {
      success: true,
      message: `Updated visualization: ${instance.title}`
    };
  }

  private handleDeleteCommand(args: string[]): { success: boolean; message: string } {
    if (args.length === 0) {
      return { success: false, message: 'Usage: viz delete <id>' };
    }

    const instanceId = args[0];
    const instance = this.instances.get(instanceId);
    
    if (!instance) {
      return { success: false, message: `Visualization not found: ${instanceId}` };
    }

    this.deleteVisualization(instanceId);
    
    return {
      success: true,
      message: `Deleted visualization: ${instance.title}`
    };
  }

  private getHelpMessage(): string {
    return `
Hampton Roads Visualization Commands:

viz list                           - List all available visualizations
viz create <type> [--param=value] - Create a new visualization
viz update <id> --param=value     - Update visualization parameters
viz delete <id>                    - Delete a visualization

Examples:
viz create sea-level-trends --timespan=50years --animation=true
viz create coastal-erosion --type=choropleth --resolution=high
viz update viz123 --animation=false --color-scheme=blues

Available visualization types:
${availableVisualizations.map(viz => `  ${viz.id} - ${viz.name}`).join('\n')}
    `;
  }

  private getVisualizationsList(): string {
    const categories = [...new Set(availableVisualizations.map(viz => viz.category))];
    
    let output = 'Available Visualizations:\n\n';
    
    categories.forEach(category => {
      output += `${category.toUpperCase()}:\n`;
      const vizInCategory = availableVisualizations.filter(viz => viz.category === category);
      vizInCategory.forEach(viz => {
        output += `  ${viz.id} - ${viz.name}\n`;
        output += `    ${viz.description}\n`;
        if (viz.terminalCommand) {
          output += `    Command: ${viz.terminalCommand}\n`;
        }
        output += '\n';
      });
    });
    
    return output;
  }

  private generateSampleData(config: VisualizationConfig): any {
    // Generate appropriate sample data based on visualization type
    switch (config.type) {
      case 'chart':
        return this.generateChartData();
      case 'map':
        return this.generateMapData();
      case 'graph':
        return this.generateGraphData();
      case 'diagram':
        return this.generateDiagramData();
      default:
        return {};
    }
  }

  private generateChartData(): any {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        date: new Date(2000 + i, 0, 1),
        value: Math.random() * 100 + 50,
        trend: Math.sin(i * 0.1) * 20 + 75
      });
    }
    return { data, type: 'line' };
  }

  private generateMapData(): any {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-76.3, 36.8]
          },
          properties: {
            name: 'Norfolk',
            value: Math.random() * 100
          }
        }
      ]
    };
  }

  private generateGraphData(): any {
    return {
      nodes: [
        { id: 'node1', label: 'Hampton', type: 'city' },
        { id: 'node2', label: 'Norfolk', type: 'city' },
        { id: 'node3', label: 'Virginia Beach', type: 'city' }
      ],
      links: [
        { source: 'node1', target: 'node2', value: 10 },
        { source: 'node2', target: 'node3', value: 15 }
      ]
    };
  }

  private generateDiagramData(): any {
    return {
      flows: [
        { from: 'source', to: 'destination', value: 100, type: 'primary' },
        { from: 'source', to: 'alternative', value: 50, type: 'secondary' }
      ]
    };
  }

  private generateId(): string {
    return 'viz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

export const visualizationManager = new VisualizationManager();