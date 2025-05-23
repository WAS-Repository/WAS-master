import { pipeline, env } from '@xenova/transformers';

// Configure Transformers.js to use local models
env.allowRemoteModels = true;
env.allowLocalModels = true;

interface DocumentContext {
  id: number;
  title: string;
  content: string;
  type: string;
  localities: string[];
  publishedDate?: string;
}

interface VisualizationRequest {
  type: 'visualization' | 'dashboard' | 'analysis';
  topic?: string;
  localities?: string[];
  timeRange?: { start?: string; end?: string };
}

interface AIResponse {
  type: 'visualization' | 'dashboard' | 'analysis';
  title: string;
  description: string;
  visualizationType: string;
  data: any;
  narrative: string;
  sources: DocumentContext[];
}

class AIAgent {
  private generator: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Use Phi-3 Mini for text generation
      this.generator = await pipeline(
        'text-generation',
        'microsoft/Phi-3-mini-4k-instruct',
        { 
          dtype: 'fp16',
          device: 'webgpu' // Use WebGPU for better performance if available
        }
      );
      this.isInitialized = true;
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      // Fallback to CPU if WebGPU is not available
      this.generator = await pipeline(
        'text-generation',
        'microsoft/Phi-3-mini-4k-instruct',
        { dtype: 'fp32' }
      );
      this.isInitialized = true;
    }
  }

  async searchDocuments(query: string, localities?: string[]): Promise<DocumentContext[]> {
    // Simulate document search from your database
    // In a real implementation, this would query your actual document database
    const mockDocuments: DocumentContext[] = [
      {
        id: 1,
        title: "Coastal Erosion Assessment in Hampton Roads",
        content: "Recent studies show accelerated erosion rates along the Virginia Beach coastline. The combination of sea level rise and increased storm intensity has resulted in significant beach loss, with some areas experiencing retreat rates of 3-5 feet per year.",
        type: "Research Report",
        localities: ["Virginia Beach", "Norfolk"],
        publishedDate: "2023-08-15"
      },
      {
        id: 2,
        title: "Storm Water Management in Urban Coastal Areas",
        content: "Infrastructure improvements in Norfolk have focused on green infrastructure solutions including permeable pavement, bioretention areas, and constructed wetlands. These measures have reduced flooding incidents by 40% in pilot areas.",
        type: "Technical Report",
        localities: ["Norfolk", "Portsmouth"],
        publishedDate: "2023-07-20"
      },
      {
        id: 3,
        title: "Economic Impact of Sea Level Rise",
        content: "Economic modeling predicts that property values in low-lying coastal areas could decline by 15-25% by 2050. The tourism industry, worth $2.8 billion annually, faces significant risks from beach erosion and flooding.",
        type: "Economic Analysis",
        localities: ["Virginia Beach", "Norfolk", "Chesapeake"],
        publishedDate: "2023-09-10"
      }
    ];

    // Filter by localities if specified
    let filteredDocs = mockDocuments;
    if (localities && localities.length > 0) {
      filteredDocs = mockDocuments.filter(doc => 
        localities.some(locality => doc.localities.includes(locality))
      );
    }

    // Simple keyword matching for demo purposes
    const keywords = query.toLowerCase().split(' ');
    return filteredDocs.filter(doc => 
      keywords.some(keyword => 
        doc.title.toLowerCase().includes(keyword) || 
        doc.content.toLowerCase().includes(keyword)
      )
    );
  }

  async generateVisualization(request: VisualizationRequest): Promise<AIResponse> {
    await this.initialize();

    // Search for relevant documents
    const searchQuery = request.topic || 'coastal research Hampton Roads';
    const relevantDocs = await this.searchDocuments(searchQuery, request.localities);

    // Create context from documents
    const context = relevantDocs.map(doc => 
      `Title: ${doc.title}\nType: ${doc.type}\nLocalities: ${doc.localities.join(', ')}\nContent: ${doc.content.substring(0, 300)}...`
    ).join('\n\n');

    const prompt = `Based on the following research documents about Hampton Roads coastal areas, create a data visualization recommendation:

${context}

Generate a visualization that:
1. Analyzes the key trends and patterns in the data
2. Provides actionable insights for coastal management
3. Highlights relationships between different localities
4. Includes a compelling narrative

Respond with a JSON-like structure describing:
- Visualization type (map, chart, graph, etc.)
- Key data points to display
- Title and description
- Main insights and narrative

Focus on: ${request.topic || 'coastal resilience and environmental trends'}`;

    try {
      const result = await this.generator(prompt, {
        max_new_tokens: 500,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false
      });

      const generatedText = result[0].generated_text;
      
      // Parse the AI response and create a structured visualization recommendation
      return this.parseAIResponse(generatedText, relevantDocs, request);
    } catch (error) {
      console.error('AI generation error:', error);
      return this.createFallbackResponse(relevantDocs, request);
    }
  }

  private parseAIResponse(aiText: string, sources: DocumentContext[], request: VisualizationRequest): AIResponse {
    // Parse AI response and extract visualization recommendations
    const lines = aiText.split('\n').filter(line => line.trim());
    
    // Extract key information with fallbacks
    let title = "Coastal Research Analysis";
    let visualizationType = "map";
    let description = "AI-generated visualization of coastal research data";
    
    // Simple parsing to extract structured information
    for (const line of lines) {
      if (line.toLowerCase().includes('title:') || line.toLowerCase().includes('visualization:')) {
        title = line.split(':')[1]?.trim() || title;
      }
      if (line.toLowerCase().includes('type:') || line.toLowerCase().includes('chart:') || line.toLowerCase().includes('map:')) {
        const type = line.toLowerCase();
        if (type.includes('map')) visualizationType = 'map';
        else if (type.includes('timeline')) visualizationType = 'timeline';
        else if (type.includes('graph')) visualizationType = 'knowledge-graph';
        else if (type.includes('chart')) visualizationType = 'heatmap';
      }
    }

    // Generate sample data based on the sources
    const data = this.generateSampleData(sources, visualizationType);
    
    // Create narrative from AI text
    const narrative = this.extractNarrative(aiText, sources);

    return {
      type: request.type || 'visualization',
      title,
      description,
      visualizationType,
      data,
      narrative,
      sources
    };
  }

  private createFallbackResponse(sources: DocumentContext[], request: VisualizationRequest): AIResponse {
    return {
      type: request.type || 'visualization',
      title: "Hampton Roads Coastal Research Dashboard",
      description: "Comprehensive analysis of coastal research data and trends",
      visualizationType: "map",
      data: this.generateSampleData(sources, "map"),
      narrative: this.createFallbackNarrative(sources),
      sources
    };
  }

  private generateSampleData(sources: DocumentContext[], vizType: string) {
    const localities = [...new Set(sources.flatMap(doc => doc.localities))];
    
    switch (vizType) {
      case 'map':
        return {
          type: 'map',
          markers: localities.map((locality, i) => ({
            name: locality,
            lat: 36.8 + (i * 0.1),
            lng: -76.2 - (i * 0.1),
            data: sources.filter(doc => doc.localities.includes(locality)).length
          }))
        };
        
      case 'timeline':
        return {
          type: 'timeline',
          events: sources.map(doc => ({
            date: doc.publishedDate,
            title: doc.title,
            type: doc.type,
            localities: doc.localities
          }))
        };
        
      case 'knowledge-graph':
        return {
          type: 'graph',
          nodes: sources.map(doc => ({
            id: doc.id,
            label: doc.title,
            type: doc.type
          })),
          edges: []
        };
        
      default:
        return { type: vizType, data: sources };
    }
  }

  private extractNarrative(aiText: string, sources: DocumentContext[]): string {
    // Extract narrative parts from AI response
    const sentences = aiText.split('.').filter(s => s.trim().length > 20);
    const narrative = sentences.slice(0, 3).join('. ') + '.';
    
    if (narrative.length < 50) {
      return this.createFallbackNarrative(sources);
    }
    
    return narrative;
  }

  private createFallbackNarrative(sources: DocumentContext[]): string {
    const localities = [...new Set(sources.flatMap(doc => doc.localities))];
    const types = [...new Set(sources.map(doc => doc.type))];
    
    return `Analysis of ${sources.length} research documents covering ${localities.join(', ')} reveals key trends in coastal management and environmental change. The research includes ${types.join(', ')} and provides insights into erosion patterns, infrastructure resilience, and economic impacts. This comprehensive view enables data-driven decision making for coastal adaptation strategies.`;
  }
}

export const aiAgent = new AIAgent();
export type { VisualizationRequest, AIResponse, DocumentContext };