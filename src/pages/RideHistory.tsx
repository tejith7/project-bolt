import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Car, DollarSign, Filter, Search, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useRide, Ride } from '../context/RideContext';

const RideHistory: React.FC = () => {
  const { rideHistory } = useRide();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filter and sort rides
  const filteredRides = rideHistory
    .filter(ride => {
      // Status filter
      if (statusFilter !== 'all' && ride.status !== statusFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter !== 'all') {
        const rideDate = new Date(ride.createdAt);
        const today = new Date();
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        if (dateFilter === 'today' && rideDate.toDateString() !== today.toDateString()) {
          return false;
        }
        
        if (dateFilter === 'week' && rideDate < thisWeekStart) {
          return false;
        }
        
        if (dateFilter === 'month' && rideDate < thisMonthStart) {
          return false;
        }
      }
      
      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          ride.pickupLocation.address.toLowerCase().includes(searchLower) ||
          ride.destination.address.toLowerCase().includes(searchLower) ||
          (ride.driver?.name.toLowerCase().includes(searchLower) || false)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'price') {
        return sortOrder === 'desc'
          ? b.estimatedFare - a.estimatedFare
          : a.estimatedFare - b.estimatedFare;
      } else if (sortBy === 'distance') {
        return sortOrder === 'desc'
          ? b.estimatedDistance - a.estimatedDistance
          : a.estimatedDistance - b.estimatedDistance;
      }
      return 0;
    });
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };
  
  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const rideDate = new Date(date);
    
    // If ride was today
    if (rideDate.toDateString() === now.toDateString()) {
      return rideDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    // If ride was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (rideDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${rideDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If ride was this week
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    if (rideDate >= thisWeekStart) {
      return rideDate.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    }
    
    // If ride was this year
    if (rideDate.getFullYear() === now.getFullYear()) {
      return rideDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    // Otherwise, show full date
    return rideDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Ride History</h2>
        
        {/* Search and filter */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search rides by address or driver"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="ml-4 flex items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span>Filter</span>
            </button>
          </div>
          
          {filterOpen && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <div className="flex">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="date">Date</option>
                      <option value="price">Price</option>
                      <option value="distance">Distance</option>
                    </select>
                    <button
                      onClick={toggleSortOrder}
                      className="px-3 border border-l-0 border-gray-300 rounded-r-md bg-white flex items-center justify-center"
                    >
                      {sortOrder === 'desc' ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setDateFilter('all');
                    setSortBy('date');
                    setSortOrder('desc');
                    setSearchTerm('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 mr-4"
                >
                  Reset Filters
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Rides list */}
        {filteredRides.length > 0 ? (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <div
                key={ride.id}
                className="border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/ride/${ride.id}`)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <Car className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900">
                            {formatDate(ride.createdAt)}
                          </span>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              ride.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </span>
                        </div>
                        
                        {ride.driver && (
                          <p className="text-sm text-gray-500 mt-1">
                            Driver: {ride.driver.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${ride.estimatedFare.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-end text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{ride.estimatedTime} min</span>
                        <span className="mx-1">·</span>
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{ride.estimatedDistance} mi</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-start">
                      <div className="min-w-[24px] flex items-center justify-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                      <p className="text-sm text-gray-600">{ride.pickupLocation.address}</p>
                    </div>
                    <div className="flex items-start mt-2">
                      <div className="min-w-[24px] flex items-center justify-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      </div>
                      <p className="text-sm text-gray-600">{ride.destination.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-gray-50 border-t rounded-b-lg flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {ride.completedAt ? (
                      <span>
                        Completed at {new Date(ride.completedAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    ) : (
                      <span>Trip details</span>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No rides found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? "No rides match your current filters. Try adjusting your search or filters."
                : "You haven't taken any rides yet. Book a ride to get started!"}
            </p>
            {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('all');
                  setSortBy('date');
                  setSortOrder('desc');
                  setSearchTerm('');
                }}
                className="mt-4 text-blue-600 font-medium hover:text-blue-500"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistory;