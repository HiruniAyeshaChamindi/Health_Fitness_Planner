import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Dumbbell, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Smartphone,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Personalization",
      description: "Advanced AI creates customized workout and meal plans tailored to your unique profile and goals."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal-Oriented Planning",
      description: "Whether you want to lose weight, gain muscle, or improve endurance, we've got you covered."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progress Tracking",
      description: "Monitor your journey with detailed analytics, charts, and progress photos."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "24/7 AI Support",
      description: "Get instant answers and motivation from our intelligent chatbot assistant."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Responsive",
      description: "Access your plans anywhere with our mobile-optimized web application."
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Easy to Follow",
      description: "Simple, step-by-step plans that fit into your busy lifestyle."
    }
  ];

  const benefits = [
    "Personalized workout routines for all fitness levels",
    "Custom meal plans based on dietary preferences",
    "Real-time progress tracking and analytics",
    "AI chatbot for instant support and motivation",
    "Downloadable PDF plans for offline access",
    "Email delivery of your personalized plans"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your AI-Powered
                <span className="block text-yellow-300">Fitness Journey</span>
                Starts Here
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Get personalized workout and meal plans powered by advanced AI. 
                Transform your health with science-backed recommendations tailored just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="btn-lg bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/chatbot"
                  className="btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-all"
                >
                  Try AI Assistant
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FitGenie?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlike generic fitness apps, FitGenie uses cutting-edge AI to create truly personalized experiences that adapt to your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need for Success
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                FitGenie combines the power of AI with proven fitness and nutrition science to deliver results that stick.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-6 w-6 text-secondary-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-8 text-white">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">5.0 Rating</span>
                </div>
                <blockquote className="text-lg mb-4">
                  "FitGenie transformed my approach to fitness. The AI recommendations are spot-on, and I've never been more motivated!"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary-600 font-bold">
                    S
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-secondary-200">Fitness Enthusiast</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have already achieved their fitness goals with FitGenie's AI-powered approach.
          </p>
          <Link
            to="/register"
            className="btn-lg bg-white text-secondary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 inline-flex items-center"
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="h-8 w-8 text-primary-500" />
                <span className="text-xl font-bold">FitGenie</span>
              </div>
              <p className="text-gray-400">
                AI-powered personalized health and fitness planning for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/chatbot" className="block text-gray-400 hover:text-white">AI Assistant</Link>
                <Link to="/register" className="block text-gray-400 hover:text-white">Get Started</Link>
                <Link to="/login" className="block text-gray-400 hover:text-white">Login</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Built by Team Bits for IDEALIZE 2025<br />
                University of Moratuwa
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FitGenie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
