// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   Brain, 
//   Target, 
//   TrendingUp, 
//   Users, 
//   Smartphone,
//   CheckCircle,
//   Star,
//   ArrowRight,
//   Zap
// } from 'lucide-react';

// const Home = () => {
//   // Array of your uploaded background images
//   const backgroundImages = [
//     '/images/image1.jpeg',
//     '/images/image2.jpeg',
//     '/images/image3.jpeg',
//     '/images/image4.jpeg'
//   ];

//   // State for current background image
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Auto-rotate images every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => 
//         (prevIndex + 1) % backgroundImages.length
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [backgroundImages.length]);
//   const features = [
//     {
//       icon: <Brain className="h-8 w-8" />,
//       title: "AI-Powered Personalization",
//       description: "Advanced AI creates customized workout and meal plans tailored to your unique profile and goals."
//     },
//     {
//       icon: <Target className="h-8 w-8" />,
//       title: "Goal-Oriented Planning",
//       description: "Whether you want to lose weight, gain muscle, or improve endurance, we've got you covered."
//     },
//     {
//       icon: <TrendingUp className="h-8 w-8" />,
//       title: "Progress Tracking",
//       description: "Monitor your journey with detailed analytics, charts, and progress photos."
//     },
//     {
//       icon: <Users className="h-8 w-8" />,
//       title: "24/7 AI Support",
//       description: "Get instant answers and motivation from our intelligent chatbot assistant."
//     },
//     {
//       icon: <Smartphone className="h-8 w-8" />,
//       title: "Mobile Responsive",
//       description: "Access your plans anywhere with our mobile-optimized web application."
//     },
//     {
//       icon: <CheckCircle className="h-8 w-8" />,
//       title: "Easy to Follow",
//       description: "Simple, step-by-step plans that fit into your busy lifestyle."
//     }
//   ];

//   const benefits = [
//     "Personalized workout routines for all fitness levels",
//     "Custom meal plans based on dietary preferences",
//     "Real-time progress tracking and analytics",
//     "AI chatbot for instant support and motivation",
//     "Downloadable PDF plans for offline access",
//     "Email delivery of your personalized plans"
//   ];

//   return (
//     <>
//       <style>
//         {`
//           .hero-section {
//             image-rendering: -webkit-optimize-contrast;
//             image-rendering: crisp-edges;
//             image-rendering: optimize-contrast;
//             -ms-interpolation-mode: nearest-neighbor;
//             backface-visibility: hidden;
//             transform: translateZ(0);
//             will-change: background-image;
//           }
          
//           .hero-section::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background-image: inherit;
//             background-size: cover;
//             background-position: center center;
//             background-repeat: no-repeat;
//             filter: contrast(1.1) saturate(1.1);
//             z-index: -1;
//           }
//         `}
//       </style>
//       <div className="min-h-screen">
//       {/* Hero Section */}
//       <section 
//         className="hero-section relative bg-cover bg-center bg-no-repeat text-white min-h-screen flex items-center transition-all duration-1000 ease-in-out" 
//         style={{
//           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${backgroundImages[currentImageIndex]}')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center center',
//           backgroundRepeat: 'no-repeat'
//         }}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="text-center">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//             >
//               <h1 className="text-4xl md:text-6xl font-bold mb-6">
//                 Your AI-Powered
//                 <span className="block text-yellow-300">Fitness Journey</span>
//                 Starts Here
//               </h1>
//               <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
//                 Get personalized workout and meal plans powered by advanced AI. 
//                 Transform your health with science-backed recommendations tailored just for you.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                 <Link
//                   to="/register"
//                   className="btn-lg bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105"
//                 >
//                   Get Started Free
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Link>
//                 <Link
//                   to="/chatbot"
//                   className="btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-all"
//                 >
//                   Try AI Assistant
//                 </Link>
//               </div>
//             </motion.div>
//           </div>
//         </div>
        
//         {/* Image Navigation Dots */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
//           {backgroundImages.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentImageIndex(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 index === currentImageIndex 
//                   ? 'bg-white scale-125' 
//                   : 'bg-white/50 hover:bg-white/75'
//               }`}
//               aria-label={`Switch to image ${index + 1}`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Why Choose FitGenie?
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Unlike generic fitness apps, FitGenie uses cutting-edge AI to create truly personalized experiences that adapt to your progress.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className="card hover:shadow-lg transition-shadow"
//               >
//                 <div className="text-primary-600 mb-4">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3 text-gray-900">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-600">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Benefits Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
//                 Everything You Need for Success
//               </h2>
//               <p className="text-lg text-gray-600 mb-8">
//                 FitGenie combines the power of AI with proven fitness and nutrition science to deliver results that stick.
//               </p>
              
//               <div className="space-y-4">
//                 {benefits.map((benefit, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     className="flex items-center space-x-3"
//                   >
//                     <CheckCircle className="h-6 w-6 text-secondary-500 flex-shrink-0" />
//                     <span className="text-gray-700">{benefit}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="relative">
//               <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-8 text-white">
//                 <div className="flex items-center mb-4">
//                   <div className="flex text-yellow-400">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="h-5 w-5 fill-current" />
//                     ))}
//                   </div>
//                   <span className="ml-2 font-semibold">5.0 Rating</span>
//                 </div>
//                 <blockquote className="text-lg mb-4">
//                   "FitGenie transformed my approach to fitness. The AI recommendations are spot-on, and I've never been more motivated!"
//                 </blockquote>
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-secondary-600 font-bold">
//                     S
//                   </div>
//                   <div className="ml-3">
//                     <div className="font-semibold">Sarah Johnson</div>
//                     <div className="text-secondary-200">Fitness Enthusiast</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white py-20">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl md:text-4xl font-bold mb-6">
//             Ready to Transform Your Health?
//           </h2>
//           <p className="text-xl mb-8 opacity-90">
//             Join thousands of users who have already achieved their fitness goals with FitGenie's AI-powered approach.
//           </p>
//           <Link
//             to="/register"
//             className="btn-lg bg-white text-secondary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 inline-flex items-center"
//           >
//             Start Your Journey Today
//             <ArrowRight className="ml-2 h-5 w-5" />
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-3 gap-8">
//             <div>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div className="relative">
//                   <Zap className="h-8 w-8 text-yellow-400" />
//                   <Brain className="h-4 w-4 text-primary-500 absolute -top-1 -right-1" />
//                 </div>
//                 <span className="text-xl font-bold">FitGenie</span>
//               </div>
//               <p className="text-gray-400">
//                 AI-powered personalized health and fitness planning for everyone.
//               </p>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//               <div className="space-y-2">
//                 <Link to="/chatbot" className="block text-gray-400 hover:text-white">AI Assistant</Link>
//                 <Link to="/register" className="block text-gray-400 hover:text-white">Get Started</Link>
//                 <Link to="/login" className="block text-gray-400 hover:text-white">Login</Link>
//               </div>
//             </div>
            
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Contact</h3>
//               <p className="text-gray-400">
//                 Built by Team Bits for IDEALIZE 2025<br />
//                 University of Moratuwa
//               </p>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//             <p>&copy; 2025 FitGenie. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//     </>
//   );
// };

// export default Home;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Smartphone,
  CheckCircle,
  Star,
  ArrowRight,
  Zap
} from 'lucide-react';

const Home = () => {
  // Array of dynamic background images from Unsplash - optimized for full screen
  const dynamicImages = [
    {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&auto=format&q=80",
      alt: "Fitness workout",
      theme: "fitness"
    },
    {
      url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&h=1080&fit=crop&auto=format&q=80",
      alt: "Healthy food",
      theme: "nutrition"
    },
    {
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop&auto=format&q=80",
      alt: "Meditation and wellness",
      theme: "wellness"
    },
    {
      url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop&auto=format&q=80",
      alt: "Gym equipment",
      theme: "exercise"
    },
    {
      url: "https://images.unsplash.com/photo-1506629905270-11674752894b?w=1920&h=1080&fit=crop&auto=format&q=80",
      alt: "Yoga and stretching",
      theme: "yoga"
    },
    {
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&h=1080&fit=crop&auto=format&q=80",
      alt: "Fresh vegetables",
      theme: "healthy-eating"
    }
  ];

  // State for current background image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % dynamicImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [dynamicImages.length]);
  
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
    <>
      <style>
        {`
          .hero-section {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: optimize-contrast;
            -ms-interpolation-mode: nearest-neighbor;
            backface-visibility: hidden;
            transform: translateZ(0);
            will-change: background-image;
            background-attachment: fixed;
          }
          
          .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: inherit;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            background-attachment: inherit;
            filter: contrast(1.2) saturate(1.2) brightness(1.3);
            z-index: -1;
          }
          
          @media (max-width: 768px) {
            .hero-section {
              background-attachment: scroll;
            }
            .hero-section::before {
              background-attachment: scroll;
            }
          }
        `}
      </style>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="hero-section relative bg-cover bg-center bg-no-repeat text-white min-h-screen flex items-center transition-all duration-1000 ease-in-out" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('${dynamicImages[currentImageIndex].url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%'
        }}>
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
        
        {/* Image Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {dynamicImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Switch to ${image.alt} image`}
            />
          ))}
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
                <div className="relative">
                  <Zap className="h-8 w-8 text-yellow-400" />
                  <Brain className="h-4 w-4 text-primary-500 absolute -top-1 -right-1" />
                </div>
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
    </>
  );
};

export default Home;