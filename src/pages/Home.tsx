import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, DollarSign, MapPin, Star, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-violet-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 md:pr-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Get to your destination with just a tap
              </h1>
              <p className="text-xl text-blue-100">
                Reliable rides, friendly drivers, and affordable prices. Experience the best ride-sharing service in town.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link 
                    to={user?.type === 'rider' ? '/book' : '/driver/dashboard'} 
                    className="inline-flex items-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    {user?.type === 'rider' ? 'Book a Ride' : 'Go to Dashboard'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/signup" 
                      className="inline-flex items-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      Sign Up Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link 
                      to="/login" 
                      className="inline-flex items-center border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition-colors duration-200"
                    >
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block relative">
              <img 
                src="https://images.pexels.com/photos/1796735/pexels-photo-1796735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Person using ride sharing app" 
                className="rounded-lg shadow-2xl object-cover h-[500px] w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl max-w-xs">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Fast Pickup</h3>
                    <p className="text-gray-600 text-sm">Most rides arrive in less than 5 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="relative h-16 md:h-24">
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 74L48 68.7C96 63.3 192 52.7 288 51.5C384 50.3 480 58.7 576 62.8C672 67 768 67 864 62.5C960 58 1056 49 1152 44.3C1248 39.7 1344 39.3 1392 39.2L1440 39V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V74Z" fill="white"/>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose RideShare?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to making transportation better, safer, and more convenient for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-blue-100 inline-flex p-3 rounded-full mb-5">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Safe & Secure</h3>
              <p className="text-gray-600">
                All drivers undergo rigorous background checks. Track your ride in real-time and share your trip details with trusted contacts.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-green-100 inline-flex p-3 rounded-full mb-5">
                <Clock className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast & Reliable</h3>
              <p className="text-gray-600">
                Get a ride within minutes. Our extensive network of drivers ensures you'll never wait long for your pickup.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-violet-100 inline-flex p-3 rounded-full mb-5">
                <DollarSign className="h-7 w-7 text-violet-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Affordable Prices</h3>
              <p className="text-gray-600">
                Competitive rates with no hidden fees. Choose from economy, comfort, or premium ride options to fit your budget.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-amber-100 inline-flex p-3 rounded-full mb-5">
                <MapPin className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Go Anywhere</h3>
              <p className="text-gray-600">
                Whether it's across town or to the airport, our drivers will take you anywhere you need to go, 24/7.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-red-100 inline-flex p-3 rounded-full mb-5">
                <Star className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Quality Service</h3>
              <p className="text-gray-600">
                Our rating system ensures only the best drivers stay on our platform. Enjoy a comfortable and pleasant journey every time.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="bg-teal-100 inline-flex p-3 rounded-full mb-5">
                <Users className="h-7 w-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Community Driven</h3>
              <p className="text-gray-600">
                Support local drivers and be part of a community that's changing how people move around cities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Getting a ride is easier than ever. Just follow these simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md h-full">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Request a Ride</h3>
                <p className="text-gray-600">
                  Enter your destination and choose the type of ride that suits your needs and budget.
                </p>
              </div>
              
              {/* Connector line - only visible on desktop */}
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-blue-200 -translate-y-1/2 -ml-4" style={{ width: 'calc(100% - 32px)' }}></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-xl p-8 shadow-md h-full">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Get Matched</h3>
                <p className="text-gray-600">
                  We'll connect you with a nearby driver who'll arrive at your location in minutes.
                </p>
              </div>
              
              {/* Connector line - only visible on desktop */}
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-blue-200 -translate-y-1/2 -ml-4" style={{ width: 'calc(100% - 32px)' }}></div>
            </div>
            
            {/* Step 3 */}
            <div>
              <div className="bg-white rounded-xl p-8 shadow-md h-full">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg mb-6">3</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Enjoy the Ride</h3>
                <p className="text-gray-600">
                  Hop in and relax. You'll be at your destination before you know it. Payment is automatically handled.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to={isAuthenticated ? (user?.type === 'rider' ? '/book' : '/driver/dashboard') : '/signup'}
              className="inline-flex items-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              {isAuthenticated ? (user?.type === 'rider' ? 'Book Your Ride Now' : 'Go to Dashboard') : 'Get Started Now'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what people are saying about RideShare.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "I use RideShare for my daily commute to work. The drivers are always on time and professional. It's made my mornings so much less stressful!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Sarah J." 
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah J.</h4>
                  <p className="text-gray-600 text-sm">Daily Commuter</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "As a driver, RideShare has been a great way to earn extra income on my own schedule. The app is easy to use and the support team is always helpful."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Michael T." 
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Michael T.</h4>
                  <p className="text-gray-600 text-sm">Part-time Driver</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "I travel frequently for business, and RideShare has been a game-changer. No more waiting for taxis or dealing with rental cars. It's convenient and reliable."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Emily R." 
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Emily R.</h4>
                  <p className="text-gray-600 text-sm">Business Traveler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-violet-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">Ready to get started?</h2>
              <p className="mt-4 text-xl text-blue-100 md:pr-12">
                Join thousands of satisfied users who rely on RideShare every day for their transportation needs.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link 
                  to={user?.type === 'rider' ? '/book' : '/driver/dashboard'} 
                  className="inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  {user?.type === 'rider' ? 'Book a Ride' : 'Go to Dashboard'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    Sign Up Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition-colors duration-200"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;