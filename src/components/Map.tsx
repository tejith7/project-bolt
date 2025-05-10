import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface MapProps {
  pickupLocation?: Location;
  destination?: Location;
  currentLocation?: Location;
  className?: string;
}

// Component to handle map updates
const MapUpdater: React.FC<{
  pickupLocation?: Location;
  destination?: Location;
}> = ({ pickupLocation, destination }) => {
  // Remove: const map = useMap();

  useEffect(() => {
    if (!pickupLocation && !destination) return;

    // Remove: const bounds = L.latLngBounds([]);
    
    if (pickupLocation) {
      // Remove: bounds.extend([pickupLocation.lat, pickupLocation.lng]);
    }
    
    if (destination) {
      // Remove: bounds.extend([destination.lat, destination.lng]);
    }

    // Remove: if (bounds.isValid()) { ... }
  }, [pickupLocation, destination]);

  return null;
};

const Map: React.FC<MapProps> = ({
  pickupLocation,
  destination,
  currentLocation,
  className = ''
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {loaded ? (
        <MapContainer
          center={[0, 0]}
          zoom={2}
          className="w-full h-full rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater
            pickupLocation={pickupLocation}
            destination={destination}
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