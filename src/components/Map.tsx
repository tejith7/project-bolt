import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface MapProps {
  pickupLocation?: Location;
  destination?: Location;
  currentLocation?: Location;
  showRoute?: boolean;
  interactive?: boolean;
  onLocationSelect?: (location: Location) => void;
  className?: string;
}

// Component to handle map updates
const MapUpdater: React.FC<{
  pickupLocation?: Location;
  destination?: Location;
  showRoute?: boolean;
}> = ({ pickupLocation, destination, showRoute }) => {
  const map = useMap();

  useEffect(() => {
    if (!pickupLocation && !destination) return;

    const bounds = L.latLngBounds([]);
    
    if (pickupLocation) {
      bounds.extend([pickupLocation.lat, pickupLocation.lng]);
    }
    
    if (destination) {
      bounds.extend([destination.lat, destination.lng]);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickupLocation, destination, map]);

  return null;
};

const Map: React.FC<MapProps> = ({
  pickupLocation,
  destination,
  currentLocation,
  showRoute = false,
  interactive = false,
  onLocationSelect,
  className = ''
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!interactive || !onLocationSelect) return;

    const { lat, lng } = e.latlng;
    
    // Use OpenStreetMap Nominatim for reverse geocoding (free)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        onLocationSelect({
          address: data.display_name,
          lat,
          lng
        });
      })
      .catch(error => {
        console.error('Error reverse geocoding:', error);
        // Fallback to coordinates if geocoding fails
        onLocationSelect({
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          lat,
          lng
        });
      });
  };

  return (
    <div className={`relative ${className}`}>
      {loaded ? (
        <MapContainer
          center={[0, 0]}
          zoom={2}
          className="w-full h-full rounded-lg"
          onClick={handleMapClick}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater
            pickupLocation={pickupLocation}
            destination={destination}
            showRoute={showRoute}
          />

          {pickupLocation && (
            <Marker position={[pickupLocation.lat, pickupLocation.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>Pickup Location</strong>
                  <p>{pickupLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>Destination</strong>
                  <p>{destination.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {currentLocation && (
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>Current Location</strong>
                  <p>{currentLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default Map;