import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, Clock, Star, DollarSign, AlertTriangle, CheckCircle, ArrowLeft, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { useRide, Ride } from '../context/RideContext';
import Map from '../components/Map';

const RideTracking: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const { getRide, cancelRide } = useRide();
  const navigate = useNavigate();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  
  // Get the ride data
  useEffect(() => {
    if (rideId) {
      const rideData = getRide(rideId);
      if (rideData) {
        setRide(rideData);
      } else {
        // Ride not found, redirect to dashboard
        navigate('/rider/dashboard');
      }
    }
  }, [rideId, getRide, navigate]);
  
  // Poll for updates
  useEffect(() => {
    if (!rideId) return;
    
    const intervalId = setInterval(() => {
      const updatedRide = getRide(rideId);
      setRide(updatedRide);
      
      // Show rating modal when ride is completed
      if (updatedRide?.status === 'completed' && !showRatingModal) {
        setShowRatingModal(true);
      }
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [rideId, getRide, showRatingModal]);

  // Handle ride cancellation
  const handleCancelRide = async () => {
    if (rideId) {
      await cancelRide(rideId);
      setShowCancelConfirm(false);
      navigate('/rider/dashboard');
    }
  };
  
  // Handle rating submission
  const handleSubmitRating = () => {
    // In a real app, this would submit the rating to an API
    console.log('Rating submitted:', { rating, feedback });
    setShowRatingModal(false);
    navigate('/rider/dashboard');
  };
  
  if (!ride) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Determine the status message and color
  const getStatusInfo = () => {
    switch (ride.status) {
      case 'searching':
        return { message: 'Finding your driver...', color: 'yellow' };
      case 'matched':
        return { message: 'Driver is on the way', color: 'blue' };
      case 'pickup':
        return { message: 'Driver has arrived', color: 'indigo' };
      case 'ongoing':
        return { message: 'En route to destination', color: 'green' };
      case 'completed':
        return { message: 'Ride completed', color: 'green' };
      case 'cancelled':
        return { message: 'Ride cancelled', color: 'red' };
      default:
        return { message: 'Processing your ride', color: 'gray' };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Map view */}
      <div className="h-[35vh] md:h-[45vh] relative">
        <Map
          pickupLocation={ride.pickupLocation}
          destination={ride.destination}
          showRoute={true}
          currentLocation={
            ride.status === 'pickup' || ride.status === 'ongoing'
              ? { 
                  address: 'Current Location', 
                  lat: ride.pickupLocation.lat + (ride.destination.lat - ride.pickupLocation.lat) * 0.4, 
                  lng: ride.pickupLocation.lng + (ride.destination.lng - ride.pickupLocation.lng) * 0.4
                }
              : undefined
          }
          className="w-full h-full"
        />
        
        {/* Back button */}
        <button
          onClick={() => navigate('/rider/dashboard')}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md z-10"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        
        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-xl shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Ride</h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
            >
              {statusInfo.message}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div
              className={`h-full rounded-full bg-${statusInfo.color}-500`}
              style={{
                width:
                  ride.status === 'searching'
                    ? '25%'
                    : ride.status === 'matched'
                    ? '50%'
                    : ride.status === 'pickup'
                    ? '75%'
                    : ride.status === 'ongoing'
                    ? '90%'
                    : ride.status === 'completed'
                    ? '100%'
                    : '0%',
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Ride details */}
      <div className="flex-grow flex flex-col">
        <div className="bg-white p-6 shadow-md">
          <div className="flex justify-between items-start">
            {/* Route details */}
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                <p className="text-gray-900">{ride.pickupLocation.address}</p>
              </div>
              <div className="ml-1 border-l-2 border-dashed border-gray-300 h-4"></div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-red-500 mr-3"></div>
                <p className="text-gray-900">{ride.destination.address}</p>
              </div>
            </div>
            
            {/* Ride info */}
            <div className="text-right">
              <div className="flex items-center justify-end">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-700">{ride.estimatedTime} min</span>
              </div>
              <div className="flex items-center justify-end mt-1">
                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-700">{ride.estimatedDistance} mi</span>
              </div>
              <div className="flex items-center justify-end mt-1">
                <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-700">${ride.estimatedFare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Driver info */}
        {ride.driver && (
          <div className="bg-white p-6 shadow-md mt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Driver</h3>
            <div className="flex items-center">
              {ride.driver.profilePicture ? (
                <img
                  src={ride.driver.profilePicture}
                  alt={ride.driver.name}
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-xl font-bold">
                    {ride.driver.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{ride.driver.name}</h4>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-gray-600 text-sm ml-1">{ride.driver.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-600 mt-1">
                  {ride.driver.vehicleDetails.color} {ride.driver.vehicleDetails.model} · {ride.driver.vehicleDetails.licensePlate}
                </p>
              </div>
              
              {/* Contact buttons */}
              <div className="flex space-x-2">
                <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <Phone className="h-5 w-5 text-gray-700" />
                </button>
                <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <MessageSquare className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="bg-white p-6 shadow-md mt-4">
          <div className="space-y-4">
            {(ride.status === 'searching' || ride.status === 'matched') && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="w-full py-3 px-4 border border-red-600 rounded-md shadow-sm text-red-600 font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Ride
              </button>
            )}
            
            {ride.status === 'completed' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                  <p className="text-green-800">
                    Your ride has been completed. Thank you for riding with us!
                  </p>
                </div>
                
                <button
                  onClick={() => setShowRatingModal(true)}
                  className="w-full py-3 px-4 border border-blue-600 rounded-md shadow-sm text-blue-600 font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Rate Your Driver
                </button>
              </div>
            )}
            
            {ride.status === 'cancelled' && (
              <div className="bg-red-50 p-4 rounded-lg flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <p className="text-red-800">
                  This ride has been cancelled. You have not been charged.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cancel Ride?</h3>
              <button onClick={() => setShowCancelConfirm(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this ride? Cancellation fees may apply if your driver is already on the way.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium hover:bg-gray-50"
              >
                Keep Ride
              </button>
              <button
                onClick={handleCancelRide}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-red-600 hover:bg-red-700"
              >
                Cancel Ride
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rating modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rate Your Ride</h3>
              <button onClick={() => setShowRatingModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                How was your ride with {ride.driver?.name}?
              </p>
              
              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-full ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
              
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us more about your experience (optional)"
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={3}
              />
              
              <div className="mt-4 flex space-x-3">
                <button
                  className="flex-1 py-2 px-4 border rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50"
                  onClick={() => {
                    setFeedback(prev => prev + "Driver was great!");
                  }}
                >
                  <ThumbsUp className="h-5 w-5 text-gray-600" />
                  <span>Great Service</span>
                </button>
                
                <button
                  className="flex-1 py-2 px-4 border rounded-md flex items-center justify-center space-x-2 hover:bg-gray-50"
                  onClick={() => {
                    setFeedback(prev => prev + "Car was very clean!");
                  }}
                >
                  <ThumbsUp className="h-5 w-5 text-gray-600" />
                  <span>Clean Car</span>
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSubmitRating}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-blue-600 hover:bg-blue-700"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideTracking;