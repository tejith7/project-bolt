import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Loader, User, Car } from 'lucide-react';

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

const RideStatus: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchRide = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('id', rideId)
        .single();
      if (data && !error) setRide(data);
      setLoading(false);
    };
    fetchRide();
    interval = setInterval(fetchRide, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, [rideId]);

  if (loading || !ride) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader className="animate-spin h-10 w-10 text-blue-500 mb-4" />
        <p>Loading ride status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Ride Status</h2>
      <div className="mb-4">
        <div className="text-gray-700 font-medium">Pickup:</div>
        <div>{ride.pickup_location.address}</div>
        <div className="text-gray-700 font-medium mt-2">Destination:</div>
        <div>{ride.destination.address}</div>
        <div className="text-gray-700 font-medium mt-2">Type:</div>
        <div>{ride.ride_type}</div>
        <div className="text-gray-700 font-medium mt-2">Estimated Price:</div>
        <div>${ride.estimated_price}</div>
      </div>
      {ride.status === 'pending' && (
        <div className="flex items-center text-yellow-600">
          <Loader className="animate-spin h-5 w-5 mr-2" />
          Searching for a driver...
        </div>
      )}
      {ride.status === 'accepted' && ride.driver_id && (
        <div className="flex items-center text-green-600">
          <Car className="h-5 w-5 mr-2" />
          Driver is on the way!
        </div>
      )}
      {ride.status === 'accepted' && ride.driver_id && (
        <div className="mt-4 flex items-center">
          {ride.driver_profile_picture ? (
            <img src={ride.driver_profile_picture} alt="Driver" className="h-12 w-12 rounded-full mr-3" />
          ) : (
            <User className="h-12 w-12 text-gray-400 mr-3" />
          )}
          <div>
            <div className="font-semibold">{ride.driver_name || 'Your driver'}</div>
            <div className="text-sm text-gray-500">Arriving soon</div>
          </div>
        </div>
      )}
      {ride.status === 'completed' && (
        <div className="text-green-700 font-bold mt-4">Ride completed!</div>
      )}
      {ride.status === 'cancelled' && (
        <div className="text-red-700 font-bold mt-4">Ride cancelled</div>
      )}
      <button
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default RideStatus; 