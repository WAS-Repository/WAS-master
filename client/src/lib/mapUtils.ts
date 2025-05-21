// Utility functions for map operations

export interface Locality {
  geoid: string;
  name: string;
  geometry: GeoJSON.Geometry;
  properties: Record<string, any>;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Get center point of a GeoJSON geometry
export function getCenterOfGeometry(geometry: GeoJSON.Geometry): GeoPoint | null {
  switch (geometry.type) {
    case 'Point':
      return {
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0]
      };
    
    case 'Polygon':
      return getCenterOfPolygon(geometry.coordinates);
    
    case 'MultiPolygon':
      // Find the largest polygon and use its center
      let maxArea = 0;
      let maxPolygon: number[][][] | null = null;
      
      for (const polygon of geometry.coordinates) {
        const area = calculatePolygonArea(polygon);
        if (area > maxArea) {
          maxArea = area;
          maxPolygon = polygon;
        }
      }
      
      return maxPolygon ? getCenterOfPolygon(maxPolygon) : null;
    
    default:
      return null;
  }
}

// Calculate center of polygon
function getCenterOfPolygon(polygonCoordinates: number[][][]): GeoPoint {
  // Use the first ring (outer ring) to calculate the center
  const ring = polygonCoordinates[0];
  
  // Calculate the centroid
  let sumX = 0;
  let sumY = 0;
  
  for (const point of ring) {
    sumX += point[0];
    sumY += point[1];
  }
  
  return {
    latitude: sumY / ring.length,
    longitude: sumX / ring.length
  };
}

// Calculate polygon area (simple approximation)
function calculatePolygonArea(polygonCoordinates: number[][][]): number {
  // Use the first ring (outer ring)
  const ring = polygonCoordinates[0];
  
  let area = 0;
  const n = ring.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += ring[i][0] * ring[j][1];
    area -= ring[j][0] * ring[i][1];
  }
  
  return Math.abs(area) / 2;
}

// Check if a point is within a polygon (ray casting algorithm)
export function isPointInPolygon(point: GeoPoint, polygon: number[][]): boolean {
  const x = point.longitude;
  const y = point.latitude;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

// Calculate the bounding box of a geometry
export function getBoundingBox(geometry: GeoJSON.Geometry): BoundingBox {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  
  function processPoint(point: number[]) {
    minLon = Math.min(minLon, point[0]);
    maxLon = Math.max(maxLon, point[0]);
    minLat = Math.min(minLat, point[1]);
    maxLat = Math.max(maxLat, point[1]);
  }
  
  function processPoints(points: number[][]) {
    for (const point of points) {
      processPoint(point);
    }
  }
  
  function processPolygon(polygon: number[][][]) {
    for (const ring of polygon) {
      processPoints(ring);
    }
  }
  
  switch (geometry.type) {
    case 'Point':
      processPoint(geometry.coordinates);
      break;
    
    case 'LineString':
      processPoints(geometry.coordinates);
      break;
    
    case 'Polygon':
      processPolygon(geometry.coordinates);
      break;
    
    case 'MultiPoint':
      processPoints(geometry.coordinates);
      break;
    
    case 'MultiLineString':
      for (const line of geometry.coordinates) {
        processPoints(line);
      }
      break;
    
    case 'MultiPolygon':
      for (const polygon of geometry.coordinates) {
        processPolygon(polygon);
      }
      break;
    
    default:
      break;
  }
  
  return {
    north: maxLat,
    south: minLat,
    east: maxLon,
    west: minLon
  };
}

// Calculate distance between two points (Haversine formula)
export function getDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371; // Earth's radius in km
  
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(point1.latitude)) * Math.cos(toRadians(point2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}
