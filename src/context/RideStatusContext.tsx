import { createClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Ride {
  id: string;
  status: string;
  pickup_location: any;
  destination: any;
  ride_type: string;
  estimated_price: number;
  driver_id?: string;
  driver_name?: string;
  driver_profile_picture?: string;
}

interface RideStatusContextType {
  ride: Ride | null;
  setRideId: (id: string) => void;
  refresh: () => void;
}

const RideStatusContext = createContext<RideStatusContextType | undefined>(undefined);

export const RideStatusProvider = ({ children }: { children: ReactNode }) => {
  const [rideId, setRideId] = useState<string | null>(null);
  const [ride, setRide] = useState<Ride | null>(null);

  // Polling for ride status
  useEffect(() => {
    if (!rideId) return;
    let interval: NodeJS.Timeout;
    const fetchRide = async () => {
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('id', rideId)
        .single();
      if (data && !error) setRide(data);
    };
    fetchRide();
    interval = setInterval(fetchRide, 3000);
    return () => clearInterval(interval);
  }, [rideId]);

  // Manual refresh
  const refresh = async () => {
    if (!rideId) return;
    const { data, error } = await supabase
      .from('ride_requests')
      .select('*')
      .eq('id', rideId)
      .single();
    if (data && !error) setRide(data);
  };

  return (
    <RideStatusContext.Provider value={{ ride, setRideId, refresh }}>
      {children}
    </RideStatusContext.Provider>
  );
};

export const useRideStatus = () => {
  const context = useContext(RideStatusContext);
  if (!context) throw new Error('useRideStatus must be used within a RideStatusProvider');
  return context;
}; 