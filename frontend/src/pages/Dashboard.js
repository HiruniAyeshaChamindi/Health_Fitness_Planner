// import React from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { 
//   Target, 
//   TrendingUp, 
//   Calendar, 
//   Award,
//   Activity,
//   Heart,
//   Droplets,
//   Clock
// } from 'lucide-react';

// const Dashboard = () => {
//   const { user } = useAuth();

//   const stats = [
//     {
//       title: 'Daily Calorie Target',
//       value: user?.dailyCalorieTarget || 2000,
//       unit: 'kcal',
//       icon: <Target className="h-6 w-6" />,
//       color: 'text-primary-600',
//       bgColor: 'bg-primary-100'
//     },
//     {
//       title: 'Water Target',
//       value: user?.dailyWaterTarget || 2500,
//       unit: 'ml',
//       icon: <Droplets className="h-6 w-6" />,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-100'
//     },
//     {
//       title: 'BMR',
//       value: user?.bmr || 1600,
//       unit: 'kcal',
//       icon: <Activity className="h-6 w-6" />,
//       color: 'text-green-600',
//       bgColor: 'bg-green-100'
//     },
//     {
//       title: 'TDEE',
//       value: user?.tdee || 2200,
//       unit: 'kcal',
//       icon: <TrendingUp className="h-6 w-6" />,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-100'
//     }
//   ];

//   const quickActions = [
//     {
//       title: 'Generate New Plan',
//       description: 'Create a personalized workout and meal plan',
//       icon: <Target className="h-8 w-8" />,
//       href: '/generate-plan',
//       color: 'bg-primary-600 hover:bg-primary-700'
//     },
//     {
//       title: 'Log Progress',
//       description: 'Track your daily activities and measurements',
//       icon: <TrendingUp className="h-8 w-8" />,
//       href: '/progress',
//       color: 'bg-green-600 hover:bg-green-700'
//     },
//     {
//       title: 'View My Plans',
//       description: 'Access your previous plans and progress',
//       icon: <Calendar className="h-8 w-8" />,
//       href: '/my-plans',
//       color: 'bg-blue-600 hover:bg-blue-700'
//     },
//     {
//       title: 'AI Assistant',
//       description: 'Get instant help and motivation',
//       icon: <Heart className="h-8 w-8" />,
//       href: '/chatbot',
//       color: 'bg-purple-600 hover:bg-purple-700'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Welcome Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-900">
//             Welcome back, {user?.name}! 👋
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Ready to continue your fitness journey? Here's your personalized dashboard.
//           </p>
//         </motion.div>

//         {/* Stats Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//         >
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//               <div className="flex items-center">
//                 <div className={`p-3 rounded-lg ${stat.bgColor}`}>
//                   <div className={stat.color}>
//                     {stat.icon}
//                   </div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {stat.value}
//                     <span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </motion.div>

//         {/* Quick Actions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mb-8"
//         >
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {quickActions.map((action, index) => (
//               <Link
//                 key={index}
//                 to={action.href}
//                 className="group block"
//               >
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
//                   <div className={`inline-flex p-3 rounded-lg text-white ${action.color} mb-4`}>
//                     {action.icon}
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {action.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm">
//                     {action.description}
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </motion.div>

//         {/* Today's Overview */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="grid grid-cols-1 lg:grid-cols-2 gap-8"
//         >
//           {/* Current Goals */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Goals</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Fitness Goal</span>
//                 <span className="font-medium text-gray-900 capitalize">
//                   {user?.fitnessGoal?.replace('_', ' ') || 'Not set'}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Fitness Level</span>
//                 <span className="font-medium text-gray-900 capitalize">
//                   {user?.fitnessLevel || 'Not set'}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Activity Level</span>
//                 <span className="font-medium text-gray-900 capitalize">
//                   {user?.activityLevel?.replace('_', ' ') || 'Not set'}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Dietary Preference</span>
//                 <span className="font-medium text-gray-900 capitalize">
//                   {user?.dietaryPreference?.replace('_', ' ') || 'Not set'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Motivational Card */}
//           <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-sm p-6 text-white">
//             <div className="flex items-center mb-4">
//               <Award className="h-8 w-8 mr-3" />
//               <h3 className="text-lg font-semibold">Stay Motivated!</h3>
//             </div>
//             <p className="text-primary-100 mb-4">
//               You're doing great! Every step counts towards your {user?.fitnessGoal?.replace('_', ' ')} goal. 
//               Consistency is key to achieving lasting results.
//             </p>
//             <div className="flex items-center text-primary-200">
//               <Clock className="h-4 w-4 mr-2" />
//               <span className="text-sm">
//                 {user?.workoutDaysPerWeek || 3} workouts per week • {user?.workoutDuration || 45} minutes each
//               </span>
//             </div>
//           </div>
//         </motion.div>

//         {/* Recent Activity Placeholder */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="mt-8"
//         >
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
//             <div className="text-center py-8">
//               <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to begin?</h4>
//               <p className="text-gray-600 mb-4">
//                 Generate your first personalized plan to start tracking your progress.
//               </p>
//               <Link
//                 to="/generate-plan"
//                 className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//               >
//                 Generate Your First Plan
//               </Link>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;








import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  Activity,
  Heart,
  Droplets,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Dynamic fitness images from web
  const motivationalImages = {
    workout: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmGhZM5VCbXVIBn-NdNnjiA4oAHECYAKJRW0VVBpm6uNFrSo4E35TUlb3UbQzKJ7AMayU&usqp=CAU",
    nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    progress: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    motivation: "https://img.freepik.com/premium-photo/futuristic-personal-trainer-robot-assists-man-woman-with-their-fitness-goals_856795-95098.jpg?w=360",
    yoga: "https://images.unsplash.com/photo-1506629905607-e9349777f581?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    running: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    coaches:"https://res.cloudinary.com/dvjfemxbz/image/upload/Klantbetrokkenheid_via_personalisatie_q0fl3c.png"
  };

  const stats = [
    {
      title: 'Daily Calorie Target',
      value: user?.dailyCalorieTarget || 2000,
      unit: 'kcal',
      icon: <Target className="h-6 w-6" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      image: motivationalImages.nutrition
    },
    {
      title: 'Water Target',
      value: user?.dailyWaterTarget || 2500,
      unit: 'ml',
      icon: <Droplets className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKoPYOspCq2vhrhH3vCGhxhGlYn1xf5UTrpQ&s"
    },
    {
      title: 'BMR',
      value: user?.bmr || 1600,
      unit: 'kcal',
      icon: <Activity className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      image: motivationalImages.progress
    },
    {
      title: 'TDEE',
      value: user?.tdee || 2200,
      unit: 'kcal',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      image: motivationalImages.workout
    }
  ];

  const quickActions = [
    {
      title: 'Generate New Plan',
      description: 'Create a personalized workout and meal plan',
      icon: <Target className="h-8 w-8" />,
      href: '/generate-plan',
      color: 'bg-primary-600 hover:bg-primary-700',
      image: motivationalImages.workout
    },
    {
      title: 'Log Progress',
      description: 'Track your daily activities and measurements',
      icon: <TrendingUp className="h-8 w-8" />,
      href: '/progress',
      color: 'bg-green-600 hover:bg-green-700',
      image: motivationalImages.progress
    },
    {
      title: 'Find Coaches',
      description: 'Find your perfect fitness coach',
      icon: <Calendar className="h-8 w-8" />,
      href: '/coaches',
      color: 'bg-blue-600 hover:bg-blue-700',
      image: motivationalImages.coaches
    },
    {
      title: 'AI Assistant',
      description: 'Get instant help and motivation',
      icon: <Heart className="h-8 w-8" />,
      href: '/chatbot',
      color: 'bg-purple-600 hover:bg-purple-700',
      image: motivationalImages.motivation
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Background Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <img 
              src={motivationalImages.progress}
              alt="Fitness motivation"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
          <div className="relative z-10 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-lg text-gray-200">
              Ready to continue your fitness journey? Here's your personalized dashboard.
            </p>
            <div className="mt-6">
              <Link
                to="/generate-plan"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                <Target className="h-5 w-5 mr-2" />
                Start Your Journey
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid with Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative h-32">
                <img 
                  src={stat.image}
                  alt={stat.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className={`absolute top-3 left-3 p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions with Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <div className="relative h-40">
                    <img 
                      src={action.image}
                      alt={action.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                    <div className={`absolute top-3 right-3 p-2 rounded-lg text-white ${action.color.split(' ')[0]} bg-opacity-90`}>
                      {action.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Today's Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Current Goals with Image */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="relative h-32">
              <img 
                src={motivationalImages.yoga}
                alt="Your fitness goals"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h3 className="absolute bottom-3 left-6 text-lg font-semibold text-white">Your Current Goals</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fitness Goal</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {user?.fitnessGoal?.replace('_', ' ') || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Fitness Level</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {user?.fitnessLevel || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Activity Level</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {user?.activityLevel?.replace('_', ' ') || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Dietary Preference</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {user?.dietaryPreference?.replace('_', ' ') || 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Card with Dynamic Image */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="relative h-32">
              <img 
                src={motivationalImages.running}
                alt="Stay motivated"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-600/90 to-primary-400/70"></div>
              <div className="absolute bottom-3 left-6 flex items-center text-white">
                <Award className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-semibold">Stay Motivated!</h3>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100">
              <p className="text-primary-800 mb-4">
                You're doing great! Every step counts towards your {user?.fitnessGoal?.replace('_', ' ')} goal. 
                Consistency is key to achieving lasting results.
              </p>
              <div className="flex items-center text-primary-700">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">
                  {user?.workoutDaysPerWeek || 3} workouts per week • {user?.workoutDuration || 45} minutes each
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity with Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="relative h-48">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Getting started"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Target className="h-16 w-16 mx-auto mb-4 text-white/90" />
                  <h3 className="text-2xl font-semibold mb-2">Getting Started</h3>
                  <h4 className="text-xl font-medium mb-2">Ready to begin?</h4>
                  <p className="text-gray-200 mb-6 max-w-md">
                    Generate your first personalized plan to start tracking your progress.
                  </p>
                  <Link
                    to="/generate-plan"
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    <Target className="h-5 w-5 mr-2" />
                    Generate Your First Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
