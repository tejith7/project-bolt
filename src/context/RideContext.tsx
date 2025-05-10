import React, { createContext, useContext, useState } from 'react';

interface Location {
  address: string;
  lat: number;
  lng: number;
}

type RideStatus = 'pending' | 'searching' | 'matched' | 'pickup' | 'ongoing' | 'completed' | 'cancelled';

export interface Ride {
  id: string;
  status: RideStatus;
  pickupLocation: Location;
  destination: Location;
  estimatedTime: number; // in minutes
  estimatedDistance: number; // in miles/km
  estimatedFare: number;
  driver?: {
    id: string;
    name: string;
    rating: number;
    vehicleDetails: {
      model: string;
      color: string;
      licensePlate: string;
    };
    profilePicture?: string;
  };
  createdAt: Date;
  completedAt?: Date;
}

interface RideContextType {
  currentRide: Ride | null;
  rideHistory: Ride[];
  requestRide: (pickup: Location, destination: Location) => Promise<Ride>;
  cancelRide: (rideId: string) => Promise<void>;
  getRide: (rideId: string) => Ride | null;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [rideHistory, setRideHistory] = useState<Ride[]>([
    {
      id: 'ride-001',
      status: 'completed',
      pickupLocation: {
        address: '123 Main St, Anytown',
        lat: 37.7749,
        lng: -122.4194
      },
      destination: {
        address: '456 Market St, Anytown',
        lat: 37.7899,
        lng: -122.4034
      },
      estimatedTime: 18,
      estimatedDistance: 4.2,
      estimatedFare: 12.50,
      driver: {
        id: 'driver-001',
        name: 'John Driver',
        rating: 4.9,
        vehicleDetails: {
          model: 'Toyota Camry',
          color: 'Blue',
          licensePlate: 'ABC123'
        },
        profilePicture: 'https://i.pravatar.cc/150?u=johndriver'
      },
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      completedAt: new Date(Date.now() - 86400000 + 1800000), // 30 min after creation
    },
    {
      id: 'ride-002',
      status: 'completed',
      pickupLocation: {
        address: '789 Oak St, Anytown',
        lat: 37.7649,
        lng: -122.4294
      },
      destination: {
        address: '101 Pine St, Anytown',
        lat: 37.7919,
        lng: -122.4014
      },
      estimatedTime: 24,
      estimatedDistance: 5.7,
      estimatedFare: 18.75,
      driver: {
        id: 'driver-002',
        name: 'Sarah Driver',
        rating: 4.8,
        vehicleDetails: {
          model: 'Honda Civic',
          color: 'Silver',
          licensePlate: 'XYZ789'
        },
        profilePicture: 'https://i.pravatar.cc/150?u=sarahdriver'
      },
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      completedAt: new Date(Date.now() - 172800000 + 2400000), // 40 min after creation
    }
  ]);

  // Function to request a new ride
  const requestRide = async (pickup: Location, destination: Location): Promise<Ride> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Calculate estimated distance, time and fare
    const distance = Math.round((Math.random() * 10 + 1) * 10) / 10; // 1.0 to 11.0 miles
    const time = Math.round(distance * 3 + Math.random() * 5); // Roughly 3 min per mile + random time
    const fare = Math.round((distance * 2.5 + 5) * 100) / 100; // $2.5 per mile + $5 base fare
    
    const newRide: Ride = {
      id: 'ride-' + Math.random().toString(36).substring(2, 9),
      status: 'searching',
      pickupLocation: pickup,
      destination: destination,
      estimatedTime: time,
      estimatedDistance: distance,
      estimatedFare: fare,
      createdAt: new Date(),
    };
    
    setCurrentRide(newRide);
    
    // Simulate finding a driver after 3 seconds
    setTimeout(() => {
      if (newRide.status !== 'cancelled') {
        const updatedRide = {
          ...newRide,
          status: 'matched' as const,
          driver: {
            id: 'driver-' + Math.random().toString(36).substring(2, 9),
            name: 'Alex Driver',
            rating: 4.7 + Math.random() * 0.3,
            vehicleDetails: {
              model: 'Tesla Model 3',
              color: 'White',
              licensePlate: 'EV' + Math.floor(Math.random() * 1000),
            },
            profilePicture: 'https://i.pravatar.cc/150?u=alexdriver'
          }
        };
        setCurrentRide(updatedRide);
        
        // Simulate driver arriving for pickup after 5 more seconds
        setTimeout(() => {
          if (updatedRide.status === 'matched') {
            setCurrentRide(prev => prev ? { ...prev, status: 'pickup' } : null);
            
            // Simulate ride starting after 4 more seconds
            setTimeout(() => {
              setCurrentRide(prev => prev ? { ...prev, status: 'ongoing' } : null);
              
              // Simulate ride completion after estimated time
              setTimeout(() => {
                setCurrentRide(prev => {
                  if (!prev) return null;
                  
                  const completedRide: Ride = {
                    ...prev,
                    status: 'completed' as RideStatus,
                    completedAt: new Date()
                  };
                  
                  // Add to history
                  setRideHistory(prevHistory => [completedRide, ...prevHistory]);
                  
                  // Return null as current ride is now completed
                  return null;
                });
              }, (newRide.estimatedTime / 3) * 1000); // Shorter time for demo
            }, 4000);
          }
        }, 5000);
      }
    }, 3000);
    
    return newRide;
  };

  // Function to cancel a ride
  const cancelRide = async (rideId: string) => {
    if (currentRide && currentRide.id === rideId) {
      const cancelledRide = { ...currentRide, status: 'cancelled' as const };
      setRideHistory(prevHistory => [cancelledRide, ...prevHistory]);
      setCurrentRide(null);
    }
  };

  // Function to get a specific ride by ID
  const getRide = (rideId: string): Ride | null => {
    if (currentRide && currentRide.id === rideId) {
      return currentRide;
    }
    
    const historyRide = rideHistory.find(ride => ride.id === rideId);
    return historyRide || null;
  };

  return (
    <RideContext.Provider value={{ 
      currentRide, 
      rideHistory, 
      requestRide, 
      cancelRide, 
      getRide 
    }}>
      {children}
    </RideContext.Provider>
  );
};