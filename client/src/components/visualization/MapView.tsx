import { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Fix marker icon issues in Leaflet with React
// @ts-ignore  
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom icons for different document types
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 1px solid white;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

const researchPaperIcon = createIcon('#4285F4');
const patentIcon = createIcon('#FBBC05');
const engineeringDrawingIcon = createIcon('#EA4335');

// Sample document markers
const sampleDocuments = [
  {
    id: 1,
    title: 'Coastal Erosion Study',
    type: 'research_paper',
    location: 'Norfolk Naval Shipyard',
    coordinates: [36.8354, -76.2982],
    date: '2021-03-15',
  },
  {
    id: 2,
    title: 'Sea Level Rise Projections',
    type: 'research_paper',
    location: 'Virginia Beach Oceanfront',
    coordinates: [36.8529, -75.9780],
    date: '2022-01-10',
  },
  {
    id: 3,
    title: 'Flood Barrier Patent',
    type: 'patent',
    location: 'Hampton University Research Center',
    coordinates: [37.0209, -76.3367],
    date: '2019-06-10',
  },
  {
    id: 4,
    title: 'Port Loading Mechanism',
    type: 'patent',
    location: 'Portsmouth Marine Terminal',
    coordinates: [36.8356, -76.3229],
    date: '2018-11-15',
  },
  {
    id: 5,
    title: 'Bridge Structure Hampton',
    type: 'engineering_drawing',
    location: 'Hampton Roads Bridge-Tunnel',
    coordinates: [36.9787, -76.3089],
    date: '2017-07-30',
  },
  {
    id: 6,
    title: 'Port Facility Norfolk',
    type: 'engineering_drawing',
    location: 'Norfolk International Terminals',
    coordinates: [36.8794, -76.3297],
    date: '2018-03-22',
  },
];

// Component to center the map on Hampton Roads
function SetMapView() {
  const map = useMap();
  
  useEffect(() => {
    map.setView([36.9787, -76.3089], 10);
  }, [map]);
  
  return null;
}

export default function MapView() {
  const [hamptonRoadsGeoJSON, setHamptonRoadsGeoJSON] = useState<any>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [filters, setFilters] = useState({
    researchPapers: true,
    patents: true,
    engineeringDrawings: true,
    showLocalityBoundaries: true,
    colorByDocumentDensity: false,
  });
  const geojsonRef = useRef<any>(null);
  const { toast } = useToast();
  
  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch('/api/geojson');
        if (!response.ok) {
          // If API fails, use the mock data for the MVP
          // In a production app, we would handle this error differently
          // and show a proper error message to the user
          const mockResponse = await import('@assets/hampton_roads_localities.geojson');
          setHamptonRoadsGeoJSON(mockResponse);
        } else {
          const data = await response.json();
          setHamptonRoadsGeoJSON(data);
        }
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
        toast({
          title: 'Error',
          description: 'Failed to load map data. Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    loadGeoJSON();
  }, [toast]);
  
  // Style function for GeoJSON features
  const geoJSONStyle = () => {
    return {
      color: filters.colorByDocumentDensity ? '#34A853' : '#4285F4',
      weight: 2,
      opacity: 0.7,
      fillOpacity: 0.1,
      dashArray: '5, 5'
    };
  };
  
  // Filter documents based on user preferences
  const filteredDocuments = sampleDocuments.filter(doc => {
    if (doc.type === 'research_paper') return filters.researchPapers;
    if (doc.type === 'patent') return filters.patents;
    if (doc.type === 'engineering_drawing') return filters.engineeringDrawings;
    return true;
  });
  
  // Get the right icon for document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'research_paper':
        return researchPaperIcon;
      case 'patent':
        return patentIcon;
      case 'engineering_drawing':
        return engineeringDrawingIcon;
      default:
        return researchPaperIcon;
    }
  };
  
  // Format document type for display
  const formatDocumentType = (type: string) => {
    switch (type) {
      case 'research_paper':
        return 'Research Paper';
      case 'patent':
        return 'Patent';
      case 'engineering_drawing':
        return 'Engineering Drawing';
      default:
        return type;
    }
  };
  
  return (
    <div className="relative h-full bg-bg-dark">
      {/* Map Container */}
      <MapContainer className="h-full w-full z-0" center={[36.9787, -76.3089]} zoom={10} scrollWheelZoom={true} style={{ backgroundColor: '#121212' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-dark"
        />
        
        <SetMapView />
        
        {/* Render GeoJSON boundaries if available and enabled */}
        {hamptonRoadsGeoJSON && filters.showLocalityBoundaries && (
          <GeoJSON
            ref={geojsonRef}
            data={hamptonRoadsGeoJSON}
            style={geoJSONStyle}
          />
        )}
        
        {/* Render document markers */}
        {filteredDocuments.map((doc) => (
          <Marker
            key={doc.id}
            position={doc.coordinates as [number, number]}
            icon={getDocumentIcon(doc.type)}
            eventHandlers={{
              click: () => {
                setSelectedDocument(doc);
              },
            }}
          >
            <Popup>
              <div className="text-sm font-medium">{doc.title}</div>
              <div className="text-xs">{formatDocumentType(doc.type)}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 bg-bg-panel bg-opacity-80 p-3 rounded-md shadow-lg z-10">
        <h3 className="text-sm font-medium mb-2">Document Locations</h3>
        <div className="space-y-1 mb-3">
          <div className="flex items-center">
            <Checkbox 
              id="map-research-papers" 
              checked={filters.researchPapers} 
              onCheckedChange={(checked) => 
                setFilters(prev => ({...prev, researchPapers: !!checked}))
              }
              className="mr-2"
            />
            <Label htmlFor="map-research-papers" className="text-xs">
              Research Papers ({sampleDocuments.filter(d => d.type === 'research_paper').length})
            </Label>
          </div>
          
          <div className="flex items-center">
            <Checkbox 
              id="map-patents" 
              checked={filters.patents} 
              onCheckedChange={(checked) => 
                setFilters(prev => ({...prev, patents: !!checked}))
              }
              className="mr-2"
            />
            <Label htmlFor="map-patents" className="text-xs">
              Patents ({sampleDocuments.filter(d => d.type === 'patent').length})
            </Label>
          </div>
          
          <div className="flex items-center">
            <Checkbox 
              id="map-engineering" 
              checked={filters.engineeringDrawings} 
              onCheckedChange={(checked) => 
                setFilters(prev => ({...prev, engineeringDrawings: !!checked}))
              }
              className="mr-2"
            />
            <Label htmlFor="map-engineering" className="text-xs">
              Engineering Drawings ({sampleDocuments.filter(d => d.type === 'engineering_drawing').length})
            </Label>
          </div>
        </div>
        
        <h3 className="text-sm font-medium mb-2">Locality Boundaries</h3>
        <div className="space-y-1 mb-3">
          <div className="flex items-center">
            <Checkbox 
              id="map-boundaries" 
              checked={filters.showLocalityBoundaries} 
              onCheckedChange={(checked) => 
                setFilters(prev => ({...prev, showLocalityBoundaries: !!checked}))
              }
              className="mr-2"
            />
            <Label htmlFor="map-boundaries" className="text-xs">
              Show Locality Boundaries
            </Label>
          </div>
          
          <div className="flex items-center">
            <Checkbox 
              id="map-density" 
              checked={filters.colorByDocumentDensity} 
              onCheckedChange={(checked) => 
                setFilters(prev => ({...prev, colorByDocumentDensity: !!checked}))
              }
              className="mr-2"
            />
            <Label htmlFor="map-density" className="text-xs">
              Color by Document Density
            </Label>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <Button variant="secondary" size="sm" className="flex-1 text-xs">
            Zoom In
          </Button>
          <Button variant="secondary" size="sm" className="flex-1 text-xs">
            Zoom Out
          </Button>
        </div>
      </div>
      
      {/* Selected document info */}
      {selectedDocument && (
        <Card className="absolute bottom-4 left-4 bg-bg-panel p-0 rounded-md shadow-lg max-w-sm z-10">
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-primary font-medium">Selected Document</h3>
                <p className="text-sm text-text-secondary">{selectedDocument.title}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(null)}>
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            
            <div className="text-xs text-text-secondary mb-2">
              <p><span className="text-accent font-medium">Location:</span> {selectedDocument.location}</p>
              <p><span className="text-accent font-medium">Coordinates:</span> {selectedDocument.coordinates[0]}° N, {Math.abs(selectedDocument.coordinates[1])}° W</p>
              <p><span className="text-accent font-medium">Created:</span> {selectedDocument.date}</p>
            </div>
            
            <div className="mt-3 flex space-x-2">
              <Button size="sm" className="bg-primary text-white">
                View Document
              </Button>
              <Button variant="outline" size="sm">
                Export Location
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
