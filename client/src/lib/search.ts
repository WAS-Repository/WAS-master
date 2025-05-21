import { apiRequest } from "./queryClient";

// Interface for search query parameters
export interface SearchParams {
  query: string;
  filters?: {
    documentType?: string[];
    localities?: string[];
    dateRange?: {
      start?: Date;
      end?: Date;
    };
    authors?: string[];
    keywords?: string[];
  };
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Interface for search results
export interface SearchResult {
  id: number;
  title: string;
  type: string;
  authors: string[];
  publishedDate?: string;
  snippet?: string;
  relevanceScore?: number;
  localities: string[];
}

// Interface for search response
export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  page: number;
  pageSize: number;
  executionTime?: number;
}

// Parse a search query string to extract filters
export function parseSearchQuery(queryString: string): SearchParams {
  const params: SearchParams = {
    query: queryString,
    filters: {}
  };
  
  // Extract quoted phrases
  const quotedPhrases: string[] = [];
  const quotedRegex = /"([^"]*)"/g;
  let match;
  
  while ((match = quotedRegex.exec(queryString)) !== null) {
    quotedPhrases.push(match[1]);
    // Remove the matched phrase from the query string
    queryString = queryString.replace(match[0], '');
  }
  
  // Extract filters in the format "field:value"
  const filterRegex = /(\w+):([^\s]+)/g;
  
  while ((match = filterRegex.exec(queryString)) !== null) {
    const field = match[1].toLowerCase();
    const value = match[2];
    
    switch (field) {
      case 'type':
      case 'documenttype':
        params.filters!.documentType = params.filters!.documentType || [];
        params.filters!.documentType.push(value);
        // Remove the matched filter from the query string
        queryString = queryString.replace(match[0], '');
        break;
      
      case 'locality':
        params.filters!.localities = params.filters!.localities || [];
        params.filters!.localities.push(value);
        // Remove the matched filter from the query string
        queryString = queryString.replace(match[0], '');
        break;
      
      case 'author':
        params.filters!.authors = params.filters!.authors || [];
        params.filters!.authors.push(value);
        // Remove the matched filter from the query string
        queryString = queryString.replace(match[0], '');
        break;
      
      case 'keyword':
        params.filters!.keywords = params.filters!.keywords || [];
        params.filters!.keywords.push(value);
        // Remove the matched filter from the query string
        queryString = queryString.replace(match[0], '');
        break;
      
      // Add more filter types as needed
    }
  }
  
  // Clean up the query string (remove extra spaces)
  const cleanQuery = queryString.trim().replace(/\s+/g, ' ');
  
  // Add back quoted phrases
  const fullQuery = [...quotedPhrases, cleanQuery].filter(q => q).join(' ');
  
  params.query = fullQuery;
  
  return params;
}

// Execute a search query
export async function executeSearch(params: SearchParams): Promise<SearchResponse> {
  try {
    const response = await apiRequest('POST', '/api/search', params);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

// Format a search query string from params
export function formatSearchQuery(params: SearchParams): string {
  const parts: string[] = [];
  
  // Add base query
  if (params.query) {
    parts.push(params.query);
  }
  
  // Add filters
  if (params.filters) {
    if (params.filters.documentType?.length) {
      parts.push(...params.filters.documentType.map(type => `type:${type}`));
    }
    
    if (params.filters.localities?.length) {
      parts.push(...params.filters.localities.map(locality => `locality:${locality}`));
    }
    
    if (params.filters.authors?.length) {
      parts.push(...params.filters.authors.map(author => `author:${author}`));
    }
    
    if (params.filters.keywords?.length) {
      parts.push(...params.filters.keywords.map(keyword => `keyword:${keyword}`));
    }
    
    // Add date range if provided
    if (params.filters.dateRange) {
      if (params.filters.dateRange.start) {
        const startDate = params.filters.dateRange.start.toISOString().split('T')[0];
        parts.push(`after:${startDate}`);
      }
      
      if (params.filters.dateRange.end) {
        const endDate = params.filters.dateRange.end.toISOString().split('T')[0];
        parts.push(`before:${endDate}`);
      }
    }
  }
  
  return parts.join(' ');
}
