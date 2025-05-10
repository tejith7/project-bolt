import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Car, ChevronRight, X, User } from 'lucide-react';
import { useRide } from '../context/RideContext';
import Map from '../components/Map';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Location {
  address: string;
  lat: number;
  lng: number;
}

// Ride types with more details
const rideTypes = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Affordable rides for everyday',
    price: 1,
    icon: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eta: '3-5 min',
    capacity: '4 passengers',
    features: ['Air conditioning', 'Phone charger']
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Newer cars with extra legroom',
    price: 1.5,
    icon: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eta: '4-6 min',
    capacity: '4 passengers',
    features: ['Extra legroom', 'Premium interior', 'Phone charger']
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury vehicles with top drivers',
    price: 2,
    icon: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    eta: '5-8 min',
    capacity: '4 passengers',
    features: ['Luxury vehicle', 'Professional driver', 'Premium amenities']
  }
];

const BookRide: React.FC = () => {
  const { requestRide } = useRide();
  const navigate = useNavigate();
  
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [pickupSearchText, setPickupSearchText] = useState('');
  const [destinationSearchText, setDestinationSearchText] = useState('');
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [selectedRideType, setSelectedRideType] = useState(rideTypes[0]);
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [savedLocations] = useState<Location[]>([]);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  // Fetch saved locations from Supabase
  useEffect(() => {
    const fetchSavedLocations = async () => {
      const { error } = await supabase
        .from('saved_locations')
        .select('*');
      
      if (error) {
        console.error('Error fetching saved locations:', error);
      }
    };

    fetchSavedLocations();
  }, []);

  // Search for locations using OpenStreetMap Nominatim API
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      
      const results = data.map((feature: any) => ({
        address: feature.display_name,
        lat: parseFloat(feature.lat),
        lng: parseFloat(feature.lon)
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    }
  };

  // Handle location selection
  const handleSelectPickup = (location: Location) => {
    setPickupLocation(location);
    setPickupSearchText(location.address);
    setShowPickupSuggestions(false);
    if (destination) {
      calculateEstimates(location, destination);
    }
  };

  const handleSelectDestination = (location: Location) => {
    setDestination(location);
    setDestinationSearchText(location.address);
    setShowDestinationSuggestions(false);
    if (pickupLocation) {
      calculateEstimates(pickupLocation, location);
    }
  };

  // Calculate estimates using real-world formulas
  const calculateEstimates = (pickup: Location, dest: Location) => {
    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (dest.lat - pickup.lat) * Math.PI / 180;
    const dLon = (dest.lng - pickup.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickup.lat * Math.PI / 180) * Math.cos(dest.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Convert to miles and round to 1 decimal
    const distanceMiles = Math.round(distance * 0.621371 * 10) / 10;
    setEstimatedDistance(distanceMiles);
    
    // Estimate time (assume average speed of 30 mph)
    const timeHours = distanceMiles / 30;
    const timeMinutes = Math.round(timeHours * 60);
    setEstimatedTime(timeMinutes);
    
    // Calculate price
    const baseFare = 5;
    const perMileRate = 2.5;
    const price = Math.round((baseFare + distanceMiles * perMileRate) * selectedRideType.price * 100) / 100;
    setEstimatedPrice(price);
  };

  // Handle ride request
  const handleRequestRide = async () => {
    if (!pickupLocation || !destination) return;
    
    setLoading(true);
    
    try {
      // Save ride request to Supabase
      const { error } = await supabase
        .from('ride_requests')
        .insert([
          {
            pickup_location: pickupLocation,
            destination: destination,
            ride_type: selectedRideType.id,
            estimated_price: estimatedPrice,
            estimated_distance: estimatedDistance,
            estimated_time: estimatedTime,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Request ride through context
      const ride = await requestRide(pickupLocation, destination);
      navigate(`/ride/${ride.id}`);
    } catch (error) {
      console.error('Error requesting ride:', error);
      // Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Location inputs and ride options */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Ride</h2>
            
            {/* Location inputs */}
            <div className="space-y-4">
              {/* Pickup location */}
              <div className="relative">
                <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="pickup"
                    type="text"
                    value={pickupSearchText}
                    onChange={(e) => {
                      setPickupSearchText(e.target.value);
                      searchLocations(e.target.value);
                      setShowPickupSuggestions(true);
                    }}
                    onFocus={() => setShowPickupSuggestions(true)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter pickup location"
                  />
                  {pickupSearchText && (
                    <button 
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => {
                        setPickupLocation(null);
                        setPickupSearchText('');
                        setEstimatedPrice(0);
                        setEstimatedDistance(0);
                        setEstimatedTime(0);
                      }}
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    </button>
                  )}
                </div>
                
                {showPickupSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto">
                    {searchResults.map((location, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectPickup(location)}
                      >
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span>{location.address}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Destination */}
              <div className="relative">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="destination"
                    type="text"
                    value={destinationSearchText}
                    onChange={(e) => {
                      setDestinationSearchText(e.target.value);
                      searchLocations(e.target.value);
                      setShowDestinationSuggestions(true);
                    }}
                    onFocus={() => setShowDestinationSuggestions(true)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter destination"
                  />
                  {destinationSearchText && (
                    <button 
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => {
                        setDestination(null);
                        setDestinationSearchText('');
                        setEstimatedPrice(0);
                        setEstimatedDistance(0);
                        setEstimatedTime(0);
                      }}
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    </button>
                  )}
                </div>
                
                {showDestinationSuggestions && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm overflow-auto">
                    {searchResults.map((location, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleSelectDestination(location)}
                      >
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span>{location.address}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Ride estimate info */}
            {pickupLocation && destination && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Ride Estimate</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Distance</span>
                    </div>
                    <p className="font-semibold">{estimatedDistance} mi</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Time</span>
                    </div>
                    <p className="font-semibold">{estimatedTime} min</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Price</span>
                    </div>
                    <p className="font-semibold">${estimatedPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Ride options */}
            {pickupLocation && destination && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Ride Type</h3>
                <div className="space-y-3">
                  {rideTypes.map((rideType) => (
                    <div
                      key={rideType.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRideType.id === rideType.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedRideType(rideType);
                        if (pickupLocation && destination) {
                          calculateEstimates(pickupLocation, destination);
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <img
                          src={rideType.icon}
                          alt={rideType.name}
                          className="h-16 w-24 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{rideType.name}</h4>
                            <span className="font-semibold">
                              ${(estimatedPrice * rideType.price).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{rideType.description}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>ETA: {rideType.eta}</span>
                            <span className="mx-2">•</span>
                            <User className="h-4 w-4 mr-1" />
                            <span>{rideType.capacity}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {rideType.features.map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Booking button */}
            <div className="mt-6">
              <button
                onClick={handleRequestRide}
                disabled={!pickupLocation || !destination || loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Finding your ride...
                  </>
                ) : (
                  <>
                    Request {selectedRideType.name} Ride <Car className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Saved places */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Saved Places</h3>
              <Link
                to="/saved-places"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                Manage <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {savedLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectPickup(location)}
                >
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{location.address.split(',')[0]}</h4>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Map */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ride Preview</h3>
            <div className="h-[600px] rounded-lg overflow-hidden">
              <Map
                pickupLocation={pickupLocation || undefined}
                destination={destination || undefined}
                className="w-full h-full"
              />
            </div>
            
            <div className="mt-4 text-sm text-gray-500 text-center">
              {!pickupLocation && !destination ? (
                <p>Select pickup and destination locations to preview your ride</p>
              ) : !pickupLocation ? (
                <p>Select a pickup location</p>
              ) : !destination ? (
                <p>Select a destination</p>
              ) : (
                <p>
                  Your {selectedRideType.name} ride from{' '}
                  <span className="font-medium text-gray-700">{pickupLocation.address.split(',')[0]}</span>{' '}
                  to{' '}
                  <span className="font-medium text-gray-700">{destination.address.split(',')[0]}</span>{' '}
                  will take approximately{' '}
                  <span className="font-medium text-gray-700">{estimatedTime} minutes</span> and cost{' '}
                  <span className="font-medium text-gray-700">${estimatedPrice.toFixed(2)}</span>.
                </p>
              )}
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRide;