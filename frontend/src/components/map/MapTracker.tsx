/// <reference types="google.maps" preserve="true" />
import { Component, type ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useApiIsLoaded,
} from '@vis.gl/react-google-maps';

interface MapTrackerBaseProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
  technicianLocation?: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number } | null;
  technicianLocations?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    status?: string;
  }>;
  height?: string;
  zoom?: number;
}

export interface MapLocation {
  lat: number;
  lng: number;
  label: string;
  severity: string;
  description?: string;
}

interface MapTrackerProps extends MapTrackerBaseProps {
  locations?: MapLocation[];
}

const MapFallback = ({ height, message = "Map unavailable" }: { height?: string; message?: string }) => (
  <div style={{ height }} className="flex items-center justify-center rounded-lg bg-slate-100">
    <div className="text-center">
      <MapPin className="mx-auto mb-2 text-slate-400" size={32} />
      <p className="text-xs font-semibold text-slate-600">{message}</p>
      <p className="text-xs text-slate-500">The dashboard is still available.</p>
    </div>
  </div>
);

class MapErrorBoundary extends Component<
  { children: ReactNode; height?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[MapTracker Error]", error);
  }

  render() {
    if (this.state.hasError) {
      return <MapFallback height={this.props.height} />;
    }

    return this.props.children;
  }
}

const MapWithMarkers = ({
  onLocationSelect,
  initialLocation = { lat: 28.6139, lng: 77.2090 },
  technicianLocation,
  userLocation,
  technicianLocations,
  locations,
  zoom = 12,
}: MapTrackerProps) => {
  const safeTechnicianLocations = Array.isArray(technicianLocations) ? technicianLocations : [];
  const safeLocations = Array.isArray(locations) ? locations : [];
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);
  const [infoAnchor, setInfoAnchor] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [center, setCenter] = useState(initialLocation);
  const techMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const markersRef = useRef<Record<number, google.maps.marker.AdvancedMarkerElement>>({});
  const technicianMarkersRef = useRef<Record<string, google.maps.marker.AdvancedMarkerElement>>({});
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);

  const priorityClass = (severity: string) => {
    if (severity === 'Emergency') return 'bg-red-600 ring-red-200';
    if (severity === 'High') return 'bg-yellow-400 ring-yellow-200';
    return 'bg-emerald-600 ring-emerald-200';
  };

  const handleMapClick = useCallback(
    (event: { detail: { latLng: { lat: number; lng: number } | null } }) => {
      if (event.detail.latLng) {
        setSelectedLocation(event.detail.latLng);
        onLocationSelect?.(event.detail.latLng);
      }
    },
    [onLocationSelect]
  );

  const handleTechClick = () => {
    setInfoAnchor(techMarkerRef.current);
  };

  useEffect(() => {
    setCenter(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    if (navigator.geolocation && !initialLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('Geolocation permission denied, using default location');
        }
      );
    }
  }, [initialLocation]);

  return (
    <Map
      center={center}
      zoom={zoom}
      onClick={handleMapClick}
      style={{ width: '100%', height: '100%', borderRadius: '8px' }}
    >
      {technicianLocation && (
        <>
          <AdvancedMarker
            ref={techMarkerRef}
            position={technicianLocation}
            onClick={handleTechClick}
          >
            <img
              src="https://maps.google.com/mapfiles/kml/shapes/cabs.png"
              alt="tech"
              style={{ width: 40, height: 40 }}
            />
          </AdvancedMarker>
          {infoAnchor && selectedMarkerIndex === null && (
            <InfoWindow
              anchor={infoAnchor}
              onClose={() => setInfoAnchor(null)}
            >
              <div>
                <h3 className="font-semibold">Service Technician</h3>
                <p>Nearest technician location</p>
              </div>
            </InfoWindow>
          )}
        </>
      )}

      {selectedLocation && onLocationSelect && (
        <AdvancedMarker position={selectedLocation} />
      )}

      {userLocation && (
        <AdvancedMarker position={userLocation}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white ring-4 ring-sky-200">
            You
          </div>
        </AdvancedMarker>
      )}

      {safeTechnicianLocations.map((technician) => (
        <AdvancedMarker
          key={technician.id}
          ref={(ref) => {
            if (ref) {
              technicianMarkersRef.current[technician.id] = ref;
            } else {
              delete technicianMarkersRef.current[technician.id];
            }
          }}
          position={{ lat: technician.lat, lng: technician.lng }}
          onClick={() => {
            setSelectedMarkerIndex(null);
            setSelectedTechnicianId(technician.id);
            setInfoAnchor(technicianMarkersRef.current[technician.id] ?? null);
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white ring-4 ring-slate-200">
            T
          </div>
        </AdvancedMarker>
      ))}

      {safeLocations.map((location, index) => (
        <AdvancedMarker
          key={index}
          ref={(ref) => {
            if (ref) {
              markersRef.current[index] = ref;
            } else {
              delete markersRef.current[index];
            }
          }}
          position={{ lat: location.lat, lng: location.lng }}
          onClick={() => {
            setSelectedTechnicianId(null);
            setSelectedMarkerIndex(index);
            setInfoAnchor(markersRef.current[index] ?? null);
          }}
        >
          <div
            className={`h-5 w-5 rounded-full border-2 border-white shadow ring-4 ${priorityClass(location.severity)}`}
            title={location.label}
          />
        </AdvancedMarker>
      ))}

      {selectedTechnicianId && infoAnchor && (
        <InfoWindow
          anchor={infoAnchor}
          onClose={() => {
            setInfoAnchor(null);
            setSelectedTechnicianId(null);
          }}
        >
          <div>
            <h3 className="font-semibold">
              {safeTechnicianLocations.find((technician) => technician.id === selectedTechnicianId)?.name}
            </h3>
            <p className="text-sm text-slate-500">
              {safeTechnicianLocations.find((technician) => technician.id === selectedTechnicianId)?.status ?? "Live location"}
            </p>
          </div>
        </InfoWindow>
      )}

      {selectedMarkerIndex !== null && infoAnchor && (
        <InfoWindow
          anchor={infoAnchor}
          onClose={() => {
            setInfoAnchor(null);
            setSelectedMarkerIndex(null);
          }}
        >
          <div>
            <h3 className="font-semibold">{safeLocations[selectedMarkerIndex]?.label}</h3>
            {safeLocations[selectedMarkerIndex]?.severity && (
              <p className="text-sm text-slate-500">{safeLocations[selectedMarkerIndex]?.severity}</p>
            )}
            {safeLocations[selectedMarkerIndex]?.description && (
              <p className="text-sm text-slate-500">{safeLocations[selectedMarkerIndex]?.description}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};

const MapTracker = (props: MapTrackerProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <MapFallback height={props.height} message="Google Maps API key not configured" />;
  }

  return (
    <MapErrorBoundary height={props.height}>
      <div style={{ height: props.height }}>
        <APIProvider
          apiKey={apiKey}
          libraries={['places', 'marker']}
          version="weekly"
          language="en"
          region="US"
        >
          <MapWithMarkersWrapper {...props} />
        </APIProvider>
      </div>
    </MapErrorBoundary>
  );
};

const MapWithMarkersWrapper = (props: MapTrackerProps) => {
  const isLoaded = useApiIsLoaded();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setTimedOut(true);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (!isLoaded && !timedOut) {
    return (
      <div className="flex items-center justify-center" style={{ height: props.height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoaded && timedOut) {
    return <MapFallback height={props.height} message="Check your Google Maps API key" />;
  }

  return <MapWithMarkers {...props} />;
};

export default MapTracker;
