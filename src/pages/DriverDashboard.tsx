import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, User, Star, ToggleLeft, ToggleRight, Activity, Shield, Users, Loader, Car } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Map from '../components/Map';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface Ride {
  id: string;
  status: string;
  pickup_location: Location;
  destination: Location;
  ride_type: string;
  estimated_price: number;
  driver_id?: string;
  driver_name?: string;
  driver_profile_picture?: string;
}

const DriverDashboard: React.FC = () => {
  const { user } = useUser();
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation] = useState({
    address: '123 Market St, Downtown',
    lat: 37.7749,
    lng: -122.4194
  });

  // Pending rides state
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [loadingRides, setLoadingRides] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOnline) return;
    let interval: NodeJS.Timeout;
    const fetchPendingRides = async () => {
      setLoadingRides(true);
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('status', 'pending');
      if (data && !error) setPendingRides(data);
      setLoadingRides(false);
    };
    fetchPendingRides();
    interval = setInterval(fetchPendingRides, 3000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const acceptRide = async (ride: Ride) => {
    if (!user) return;
    setAcceptingId(ride.id);
    await supabase
      .from('ride_requests')
      .update({
        status: 'accepted',
        driver_id: user.id,
        driver_name: user.name,
        driver_profile_picture: user.profilePicture || null
      })
      .eq('id', ride.id);
    setAcceptingId(null);
  };

  // Mock earnings data
  const earnings = {
    today: 87.50,
    week: 632.25,
    month: 2450.80
  };

  // Mock recent trips
  const recentTrips = [
    {
      id: 'trip-001',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      pickup: '123 Main St, Anytown',
      destination: '456 Market St, Anytown',
      fare: 18.75,
      rider: {
        name: 'Alex Johnson',
        rating: 4.8,
        profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    },
    {
      id: 'trip-002',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      pickup: '789 Oak St, Anytown',
      destination: '101 Pine St, Anytown',
      fare: 24.50,
      rider: {
        name: 'Sarah Williams',
        rating: 4.9,
        profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    },
    {
      id: 'trip-003',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      pickup: '222 Cedar Ave, Anytown',
      destination: '333 Elm St, Anytown',
      fare: 12.25,
      rider: {
        name: 'Mike Brown',
        rating: 4.7,
        profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    }
  ];

  // Toggle online status
  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - User info and stats */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center space-x-4">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">
                    {user?.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-600 text-sm ml-1">{user?.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div 
                className={`w-full py-3 px-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer transition-colors ${
                  isOnline 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                onClick={toggleOnlineStatus}
              >
                <span className="font-medium text-sm">
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </span>
                {isOnline 
                  ? <ToggleRight className="h-5 w-5" /> 
                  : <ToggleLeft className="h-5 w-5" />
                }
              </div>
              
              <Link
                to="/profile"
                className="block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-medium">Tesla Model 3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Color</span>
                <span className="font-medium">White</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">License Plate</span>
                <span className="font-medium">EV123XY</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Year</span>
                <span className="font-medium">2022</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:bg-blue-50">
                Update Vehicle Info
              </button>
            </div>
          </div>
        </div>

        {/* Center and right columns */}
        <div className="col-span-1 md:col-span-2">
          {/* Map and status */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Current Location</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isOnline ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="h-64 rounded-lg overflow-hidden mb-4">
              <Map
                currentLocation={currentLocation}
                className="w-full h-full"
              />
            </div>
            
            <div className="flex items-center text-gray-700 mb-2">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span>{currentLocation.address}</span>
            </div>
            
            {isOnline && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">
                  You are currently available for ride requests. 
                  {Math.random() > 0.5 
                    ? ' Demand is high in your area!'
                    : ' Moderate demand in your area.'}
                </p>
              </div>
            )}
          </div>

          {/* Pending Rides Section */}
          {isOnline && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Ride Requests</h3>
              {loadingRides ? (
                <div className="flex items-center text-blue-600"><Loader className="animate-spin h-5 w-5 mr-2" />Loading...</div>
              ) : pendingRides.length === 0 ? (
                <div className="text-gray-500">No pending rides at the moment.</div>
              ) : (
                <div className="space-y-4">
                  {pendingRides.map((ride) => (
                    <div key={ride.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <div className="font-semibold">{ride.pickup_location.address} → {ride.destination.address}</div>
                        <div className="text-sm text-gray-500">Type: {ride.ride_type} | Price: ${ride.estimated_price}</div>
                      </div>
                      <button
                        className={`mt-2 md:mt-0 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center ${acceptingId === ride.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => acceptRide(ride)}
                        disabled={acceptingId === ride.id}
                      >
                        {acceptingId === ride.id ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Car className="h-4 w-4 mr-2" />}
                        Accept Ride
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Earnings summary */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-700 text-sm">Today</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${earnings.today.toFixed(2)}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <Activity className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-700 text-sm">This Week</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${earnings.week.toFixed(2)}</div>
              </div>
              
              <div className="bg-violet-50 p-4 rounded-lg">
                <div className="flex items-center mb-1">
                  <DollarSign className="h-5 w-5 text-violet-600 mr-2" />
                  <span className="text-gray-700 text-sm">This Month</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${earnings.month.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Link to="/earnings" className="text-blue-600 text-sm font-medium hover:text-blue-500">
                View detailed earnings →
              </Link>
            </div>
          </div>

          {/* Performance metrics */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-gray-700">Rating</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{user?.rating.toFixed(1)}/5.0</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-700">Rides</span>
                </div>
                <div className="text-xl font-bold text-gray-900">142</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Acceptance</span>
                </div>
                <div className="text-xl font-bold text-gray-900">96%</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-violet-500 mr-2" />
                  <span className="text-gray-700">On-time</span>
                </div>
                <div className="text-xl font-bold text-gray-900">98%</div>
              </div>
            </div>
          </div>

          {/* Recent rides */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trips</h3>
            
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div key={trip.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-3">
                      {trip.rider.profilePicture ? (
                        <img
                          src={trip.rider.profilePicture}
                          alt={trip.rider.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{trip.rider.name}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-gray-500 text-xs ml-1">{trip.rider.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${trip.fare.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {trip.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm text-gray-700">{trip.pickup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Destination</p>
                      <p className="text-sm text-gray-700">{trip.destination}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Link
                to="/history"
                className="block text-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View All Trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;