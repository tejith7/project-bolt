import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Clock, MapPin, History, Star, ChevronRight, Activity } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useRide } from '../context/RideContext';
import Map from '../components/Map';

const RiderDashboard: React.FC = () => {
  const { user } = useUser();
  const { currentRide, rideHistory } = useRide();
  const navigate = useNavigate();

  // Recent rides to display
  const recentRides = rideHistory.slice(0, 3);

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
              <Link
                to="/profile"
                className="block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Car className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-gray-700">Total Rides</span>
                </div>
                <span className="font-semibold text-gray-900">{rideHistory.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-700">Avg Ride Duration</span>
                </div>
                <span className="font-semibold text-gray-900">24 mins</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Most Common Destination</span>
                </div>
                <span className="font-semibold text-gray-900 text-sm">Downtown</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded-full mr-3">
                    <Activity className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-gray-700">Last Active</span>
                </div>
                <span className="font-semibold text-gray-900">Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center and right columns */}
        <div className="col-span-1 md:col-span-2">
          {/* Current ride status */}
          {currentRide ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <div
                  className={`h-full ${
                    currentRide.status === 'searching'
                      ? 'w-1/4 bg-yellow-500'
                      : currentRide.status === 'matched'
                      ? 'w-2/4 bg-blue-500'
                      : currentRide.status === 'pickup'
                      ? 'w-3/4 bg-green-500'
                      : 'w-full bg-green-600'
                  }`}
                ></div>
              </div>

              <div className="flex justify-between items-start mt-2">
                <h3 className="text-xl font-semibold text-gray-900">Current Ride</h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    currentRide.status === 'searching'
                      ? 'bg-yellow-100 text-yellow-800'
                      : currentRide.status === 'matched'
                      ? 'bg-blue-100 text-blue-800'
                      : currentRide.status === 'pickup'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {currentRide.status.charAt(0).toUpperCase() +
                    currentRide.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mt-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">From</span>
                    <p className="text-gray-900 font-medium">{currentRide.pickupLocation.address}</p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">To</span>
                    <p className="text-gray-900 font-medium">{currentRide.destination.address}</p>
                  </div>

                  <div className="pt-2 grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Distance</span>
                      <p className="text-gray-900 font-medium">
                        {currentRide.estimatedDistance} mi
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration</span>
                      <p className="text-gray-900 font-medium">
                        {currentRide.estimatedTime} min
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Fare</span>
                      <p className="text-gray-900 font-medium">
                        ${currentRide.estimatedFare.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {currentRide.driver && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {currentRide.driver.profilePicture ? (
                          <img
                            src={currentRide.driver.profilePicture}
                            alt={currentRide.driver.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {currentRide.driver.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {currentRide.driver.name}
                          </p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-gray-600 text-sm ml-1">
                              {currentRide.driver.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-blue-100">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{currentRide.driver.vehicleDetails.color} {currentRide.driver.vehicleDetails.model}</span>
                          {" · "}
                          <span>{currentRide.driver.vehicleDetails.licensePlate}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-3">
                    <button
                      onClick={() => navigate(`/ride/${currentRide.id}`)}
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Track Ride
                    </button>
                  </div>
                </div>

                <div className="flex-1 h-48 md:h-auto">
                  <Map
                    pickupLocation={currentRide.pickupLocation}
                    destination={currentRide.destination}
                    currentLocation={currentRide.status === 'pickup' || currentRide.status === 'ongoing' ? {
                      address: 'Current Location',
                      lat: 37.7749,
                      lng: -122.4194
                    } : undefined}
                    className="w-full h-full rounded-lg overflow-hidden"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md mb-6 text-center">
              <Car className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to ride?</h3>
              <p className="text-gray-600 mb-6">
                Book a ride and get to your destination in minutes.
              </p>
              <Link
                to="/book"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Book a Ride
              </Link>
            </div>
          )}

          {/* Recent rides */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Rides</h3>
              <Link
                to="/history"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
              >
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {recentRides.length > 0 ? (
              <div className="space-y-4">
                {recentRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/ride/${ride.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {new Date(ride.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="mt-1">
                          <div className="flex items-start mt-2">
                            <div className="min-w-[24px] flex items-center justify-center mt-1">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <p className="text-sm text-gray-900">{ride.pickupLocation.address}</p>
                          </div>
                          <div className="flex items-start mt-2">
                            <div className="min-w-[24px] flex items-center justify-center mt-1">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            </div>
                            <p className="text-sm text-gray-900">{ride.destination.address}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            ride.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                        <p className="mt-2 text-lg font-semibold text-gray-900">
                          ${ride.estimatedFare.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recent rides</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;