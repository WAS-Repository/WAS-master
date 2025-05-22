import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, MapPin, Search } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Handle the map center updates
function MapCenterHandler({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Define location markers with some sample documents
const locationMarkers = [
  {
    position: [36.8508, -76.2859] as [number, number],
    name: 'Norfolk',
    documents: 12,
    types: ['Research Papers', 'Engineering Drawings', 'Patents']
  },
  {
    position: [36.7282, -76.5835] as [number, number],
    name: 'Suffolk',
    documents: 5,
    types: ['Research Papers', 'Patents']
  },
  {
    position: [36.9312, -76.2397] as [number, number],
    name: 'Hampton',
    documents: 8,
    types: ['Research Papers', 'Engineering Drawings']
  },
  {
    position: [36.8354, -76.2983] as [number, number],
    name: 'Portsmouth',
    documents: 7,
    types: ['Engineering Drawings', 'Patents']
  },
  {
    position: [36.7335, -76.0435] as [number, number],
    name: 'Virginia Beach',
    documents: 15,
    types: ['Research Papers', 'Engineering Drawings', 'Patents']
  },
  {
    position: [37.0871, -76.4730] as [number, number],
    name: 'Newport News',
    documents: 9,
    types: ['Research Papers', 'Engineering Drawings']
  },
  {
    position: [37.1466, -76.4188] as [number, number],
    name: 'Williamsburg',
    documents: 6,
    types: ['Research Papers']
  }
];

// Style function for GeoJSON
const geoJSONStyle = {
  fillColor: '#3b82f6',
  weight: 1,
  opacity: 1,
  color: '#1e40af',
  fillOpacity: 0.25
};

export default function MapView() {
  const isMobile = useIsMobile();
  const [mapCenter, setMapCenter] = useState<[number, number]>([36.8508, -76.2859]);
  const [selectedLocality, setSelectedLocality] = useState<string | null>(null);
  const [showList, setShowList] = useState(!isMobile);
  const geoJSONRef = useRef<any>(null);

  // Fetch GeoJSON data with React Query
  const { data: geoJSONData, isLoading, error } = useQuery({
    queryKey: ['/api/geojson'],
    queryFn: async () => {
      const res = await apiRequest('/api/geojson');
      return res.json();
    }
  });

  // Handle display on mobile
  useEffect(() => {
    if (isMobile) {
      setShowList(false);
    } else {
      setShowList(true);
    }
  }, [isMobile]);

  // Handle locality selection
  const handleLocalitySelect = (name: string, position: [number, number]) => {
    setSelectedLocality(name);
    setMapCenter(position);
    if (isMobile) {
      setShowList(false);
    }
  };

  // Determine tile URL based on theme (dark/light)
  const tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full flex flex-col md:flex-row relative">
      {/* Mobile controls */}
      {isMobile && (
        <div className="absolute top-2 right-2 z-[1000]">
          <Button
            variant="default"
            size="sm"
            className="rounded-full shadow-lg bg-slate-800 border border-slate-700"
            onClick={() => setShowList(!showList)}
          >
            {showList ? <MapPin size={16} /> : <Search size={16} />}
          </Button>
        </div>
      )}

      {/* Locality List Panel */}
      <div 
        className={`${
          isMobile 
            ? `absolute z-[1000] top-12 right-2 w-72 max-h-[70vh] overflow-y-auto rounded-lg shadow-lg transition-all ${
                showList ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
              }`
            : 'w-1/4 border-r'
        } bg-slate-900 bg-opacity-90 backdrop-blur-sm`}
      >
        <div className="p-3 border-b border-slate-700">
          <h3 className="text-sm font-medium text-slate-200">Hampton Roads Localities</h3>
          <p className="text-xs text-slate-400 mt-1">Select a locality to view documents</p>
        </div>
        <div className="divide-y divide-slate-800">
          {locationMarkers.map((marker) => (
            <div 
              key={marker.name}
              className={`p-3 cursor-pointer transition-colors ${
                selectedLocality === marker.name 
                  ? 'bg-slate-800' 
                  : 'hover:bg-slate-800'
              }`}
              onClick={() => handleLocalitySelect(marker.name, marker.position)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-slate-200">{marker.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{marker.documents} documents</p>
                </div>
                <Badge variant="outline" className="text-xs bg-slate-800">
                  {marker.types.length} types
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {marker.types.map((type) => (
                  <Badge key={type} variant="secondary" className="text-[10px]">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className={`flex-grow ${isMobile && showList ? 'opacity-50' : 'opacity-100'}`}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-slate-900">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-400">Loading map data...</span>
          </div>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={9} 
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
            zoomControl={!isMobile}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={tileUrl}
            />
            
            {/* GeoJSON Layer */}
            {geoJSONData && (
              <GeoJSON 
                data={geoJSONData} 
                style={geoJSONStyle}
                ref={geoJSONRef}
              />
            )}
            
            {/* Location Markers */}
            {locationMarkers.map((marker) => (
              <Marker 
                key={marker.name}
                position={marker.position}
                eventHandlers={{
                  click: () => {
                    setSelectedLocality(marker.name);
                  }
                }}
              >
                <Popup>
                  <div className="text-slate-900">
                    <h3 className="font-medium">{marker.name}</h3>
                    <p className="text-xs mt-1">{marker.documents} documents available</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {marker.types.map(type => (
                        <span key={type} className="inline-block px-2 py-0.5 bg-slate-200 text-slate-800 rounded text-[10px]">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <MapCenterHandler center={mapCenter} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}