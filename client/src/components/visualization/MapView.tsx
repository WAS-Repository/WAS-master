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

// Style function for GeoJSON with improved contrast for accessibility
const geoJSONStyle = {
  fillColor: '#60a5fa', // Brighter blue fill
  weight: 2,            // Thicker border
  opacity: 1,
  color: '#1d4ed8',     // More vibrant border color
  fillOpacity: 0.2,     // Slightly more transparent fill
  dashArray: '3',       // Add dash pattern to borders for better visibility
};

// MapBounds component to restrict panning and zooming
function MapBoundsHandler() {
  const map = useMap();
  
  useEffect(() => {
    // Define the bounds for Hampton Roads area
    // These values create a rectangular boundary around all our markers
    const southWest = L.latLng(36.5, -76.8);
    const northEast = L.latLng(37.4, -75.8);
    const bounds = L.latLngBounds(southWest, northEast);
    
    // Set maximum boundaries for the map
    map.setMaxBounds(bounds);
    
    // Set min/max zoom levels
    map.setMinZoom(8);
    map.setMaxZoom(14);
    
    // Ensure initial view is within bounds
    map.fitBounds(bounds);
    
    // Add event handler to keep map within bounds
    map.on('drag', function() {
      map.panInsideBounds(bounds, { animate: false });
    });
    
    return () => {
      map.off('drag');
    };
  }, [map]);
  
  return null;
}

export default function MapView() {
  const isMobile = useIsMobile();
  const [mapCenter, setMapCenter] = useState<[number, number]>([36.8508, -76.2859]); // Norfolk as default center
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

  // Determine tile URL based on theme (dark/light) with better contrast and road data
  // Using OpenStreetMap with higher contrast for better accessibility
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="h-full flex flex-col md:flex-row relative">
      {/* Map Container */}
      <div className="flex-grow">
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
            <MapBoundsHandler />
          </MapContainer>
        )}
      </div>
    </div>
  );
}