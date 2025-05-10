import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, MapPin } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-5 text-center">
      <div className="bg-blue-50 rounded-full p-6 mb-6">
        <MapPin className="h-16 w-16 text-blue-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Lost Your Way?</h1>
      <p className="text-xl text-gray-600 max-w-md mb-8">
        We can't seem to find the page you're looking for. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;