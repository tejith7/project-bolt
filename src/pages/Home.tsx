import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Wallet } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-900">
      {/* Hero Section */}
      <section className="relative bg-hero-pattern text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-secondary-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Your Ride, Your Way
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience seamless rides with our modern ride-sharing platform. Safe, reliable, and convenient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center bg-primary-500 text-secondary-900 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-primary-400 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center bg-secondary-800 text-white font-semibold px-6 py-3 rounded-lg border border-primary-500/30 hover:bg-secondary-700 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-secondary-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-secondary-700">
              <div className="bg-primary-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Quick & Reliable</h3>
              <p className="text-gray-400">Get a ride in minutes, anywhere in the city. Our drivers are always nearby.</p>
            </div>

            <div className="bg-secondary-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-secondary-700">
              <div className="bg-primary-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Safe & Secure</h3>
              <p className="text-gray-400">Your safety is our priority. All rides are tracked and monitored in real-time.</p>
            </div>

            <div className="bg-secondary-900 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-secondary-700">
              <div className="bg-primary-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Wallet className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Affordable Rates</h3>
              <p className="text-gray-400">Competitive pricing with transparent fare calculation. No hidden charges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="relative text-center">
              <div className="bg-primary-500 text-secondary-900 w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl mb-6 mx-auto shadow-lg">
                1
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-500/20 -translate-y-1/2 -ml-4"></div>
              <h3 className="text-xl font-semibold mb-4 text-white">Book a Ride</h3>
              <p className="text-gray-400">Enter your destination and choose your preferred ride type.</p>
            </div>

            <div className="relative text-center">
              <div className="bg-primary-500 text-secondary-900 w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl mb-6 mx-auto shadow-lg">
                2
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-500/20 -translate-y-1/2 -ml-4"></div>
              <h3 className="text-xl font-semibold mb-4 text-white">Track Your Driver</h3>
              <p className="text-gray-400">Real-time tracking of your driver's location and ETA.</p>
            </div>

            <div className="relative text-center">
              <div className="bg-primary-500 text-secondary-900 w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Enjoy Your Ride</h3>
              <p className="text-gray-400">Sit back and relax while we take you to your destination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-800 to-secondary-900 text-white border-t border-secondary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Riding?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied riders who trust us for their daily commute.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center bg-primary-500 text-secondary-900 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-primary-400 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;