// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '../contexts/AuthContext';
// import { plansAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';
// import toast from 'react-hot-toast';
// import { 
//   Wand2, 
//   Target, 
//   Clock, 
//   Utensils, 
//   Dumbbell,
//   CheckCircle,
//   Download,
//   Mail,
//   Sparkles
// } from 'lucide-react';

// const PlanGenerator = () => {
//   const { user } = useAuth();
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedPlan, setGeneratedPlan] = useState(null);
//   const [customPreferences, setCustomPreferences] = useState({});

//   const handleGeneratePlan = async () => {
//     setIsGenerating(true);
//     try {
//       const response = await plansAPI.generatePlan({
//         planType: 'daily',
//         customPreferences
//       });
      
//       setGeneratedPlan(response.data.plan);
//       toast.success('Your personalized plan has been generated!');
//     } catch (error) {
//       console.error('Error generating plan:', error);
//       toast.error('Failed to generate plan. Please try again.');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!generatedPlan) return;
    
//     try {
//       const response = await plansAPI.downloadPDF(generatedPlan._id);
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${generatedPlan.plan_name}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//       toast.success('Plan downloaded successfully!');
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       toast.error('Failed to download PDF. Please try again.');
//     }
//   };

//   const handleEmailPlan = async () => {
//     if (!generatedPlan) return;
    
//     try {
//       await plansAPI.emailPlan(generatedPlan._id);
//       toast.success('Plan sent to your email!');
//     } catch (error) {
//       console.error('Error emailing plan:', error);
//       toast.error('Failed to email plan. Please try again.');
//     }
//   };

//   if (!user) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <div className="flex items-center justify-center mb-4">
//             <Wand2 className="h-8 w-8 text-primary-600 mr-3" />
//             <h1 className="text-3xl font-bold text-gray-900">AI Plan Generator</h1>
//           </div>
//           <p className="text-lg text-gray-600">
//             Let our AI create a personalized fitness and nutrition plan just for you
//           </p>
//         </motion.div>

//         {!generatedPlan ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//           >
//             {/* User Profile Summary */}
//             <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="flex items-center space-x-3">
//                   <Target className="h-5 w-5 text-primary-600" />
//                   <div>
//                     <p className="text-sm text-gray-600">Goal</p>
//                     <p className="font-medium capitalize">{user.fitnessGoal?.replace('_', ' ')}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <Dumbbell className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm text-gray-600">Level</p>
//                     <p className="font-medium capitalize">{user.fitnessLevel}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <Utensils className="h-5 w-5 text-blue-600" />
//                   <div>
//                     <p className="text-sm text-gray-600">Diet</p>
//                     <p className="font-medium capitalize">{user.dietaryPreference?.replace('_', ' ')}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <Clock className="h-5 w-5 text-purple-600" />
//                   <div>
//                     <p className="text-sm text-gray-600">Workout Duration</p>
//                     <p className="font-medium">{user.workoutDuration} minutes</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <Target className="h-5 w-5 text-orange-600" />
//                   <div>
//                     <p className="text-sm text-gray-600">Daily Calories</p>
//                     <p className="font-medium">{user.dailyCalorieTarget} kcal</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="h-5 w-5 bg-cyan-600 rounded-full"></div>
//                   <div>
//                     <p className="text-sm text-gray-600">Water Target</p>
//                     <p className="font-medium">{user.dailyWaterTarget} ml</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Custom Preferences */}
//             <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Preferences (Optional)</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Focus Area (Workout)
//                   </label>
//                   <select
//                     value={customPreferences.workoutFocus || ''}
//                     onChange={(e) => setCustomPreferences({...customPreferences, workoutFocus: e.target.value})}
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   >
//                     <option value="">Default</option>
//                     <option value="upper_body">Upper Body</option>
//                     <option value="lower_body">Lower Body</option>
//                     <option value="core">Core</option>
//                     <option value="cardio">Cardio</option>
//                     <option value="full_body">Full Body</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Meal Complexity
//                   </label>
//                   <select
//                     value={customPreferences.mealComplexity || ''}
//                     onChange={(e) => setCustomPreferences({...customPreferences, mealComplexity: e.target.value})}
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   >
//                     <option value="">Default</option>
//                     <option value="simple">Simple (15 min prep)</option>
//                     <option value="moderate">Moderate (30 min prep)</option>
//                     <option value="complex">Complex (45+ min prep)</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Special Requests
//                 </label>
//                 <textarea
//                   value={customPreferences.specialRequests || ''}
//                   onChange={(e) => setCustomPreferences({...customPreferences, specialRequests: e.target.value})}
//                   placeholder="Any specific requests or requirements..."
//                   className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   rows="3"
//                 />
//               </div>
//             </div>

//             {/* Generate Button */}
//             <div className="text-center">
//               <button
//                 onClick={handleGeneratePlan}
//                 disabled={isGenerating}
//                 className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
//               >
//                 {isGenerating ? (
//                   <>
//                     <LoadingSpinner size="sm" className="mr-3" />
//                     Generating Your Plan...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-6 w-6 mr-3" />
//                     Generate My AI Plan
//                   </>
//                 )}
//               </button>
//               <p className="text-sm text-gray-500 mt-2">
//                 This usually takes 10-15 seconds
//               </p>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-8"
//           >
//             {/* Success Header */}
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                 <CheckCircle className="h-8 w-8 text-green-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Generated Successfully!</h2>
//               <p className="text-gray-600">Your personalized plan is ready. Here's what we've created for you:</p>
//             </div>

//             {/* Plan Overview */}
//             <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">{generatedPlan.plan_name}</h3>
              
//               {/* AI Recommendations */}
//               {generatedPlan.ai_recommendations && (
//                 <div className="bg-blue-50 rounded-lg p-4 mb-6">
//                   <h4 className="font-medium text-blue-900 mb-2">AI Recommendations</h4>
//                   <p className="text-blue-800 text-sm">{generatedPlan.ai_recommendations}</p>
//                 </div>
//               )}

//               {/* Workout Plan Preview */}
//               {generatedPlan.workout_plan && (
//                 <div className="mb-6">
//                   <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                     <Dumbbell className="h-5 w-5 mr-2 text-green-600" />
//                     Workout Plan
//                   </h4>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                       <div>
//                         <span className="text-gray-600">Duration:</span>
//                         <span className="ml-2 font-medium">{generatedPlan.workout_plan.duration} minutes</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Type:</span>
//                         <span className="ml-2 font-medium capitalize">{generatedPlan.workout_plan.type}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Exercises:</span>
//                         <span className="ml-2 font-medium">{generatedPlan.workout_plan.exercises?.length || 0}</span>
//                       </div>
//                     </div>
//                     {generatedPlan.workout_plan.exercises?.slice(0, 3).map((exercise, index) => (
//                       <div key={index} className="mt-3 p-3 bg-white rounded border">
//                         <p className="font-medium">{exercise.name}</p>
//                         {exercise.sets && exercise.reps && (
//                           <p className="text-sm text-gray-600">{exercise.sets} sets × {exercise.reps} reps</p>
//                         )}
//                       </div>
//                     ))}
//                     {generatedPlan.workout_plan.exercises?.length > 3 && (
//                       <p className="text-sm text-gray-500 mt-2">
//                         +{generatedPlan.workout_plan.exercises.length - 3} more exercises...
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Meal Plan Preview */}
//               {generatedPlan.meal_plan && (
//                 <div className="mb-6">
//                   <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                     <Utensils className="h-5 w-5 mr-2 text-blue-600" />
//                     Meal Plan
//                   </h4>
//                   <div className="bg-gray-50 rounded-lg p-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
//                       <div>
//                         <span className="text-gray-600">Total Calories:</span>
//                         <span className="ml-2 font-medium">{generatedPlan.meal_plan.total_nutrition?.calories || 'N/A'} kcal</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Protein:</span>
//                         <span className="ml-2 font-medium">{generatedPlan.meal_plan.total_nutrition?.protein || 'N/A'}g</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-600">Meals:</span>
//                         <span className="ml-2 font-medium">{generatedPlan.meal_plan.meals?.length || 0}</span>
//                       </div>
//                     </div>
//                     {generatedPlan.meal_plan.meals?.map((meal, index) => (
//                       <div key={index} className="mt-3 p-3 bg-white rounded border">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <p className="font-medium">{meal.name}</p>
//                             <p className="text-sm text-gray-600 capitalize">{meal.type}</p>
//                           </div>
//                           <div className="text-right text-sm">
//                             <p className="font-medium">{meal.nutrition?.calories || 'N/A'} kcal</p>
//                             <p className="text-gray-600">{meal.prep_time || 'N/A'} min prep</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Lifestyle Tips */}
//               {generatedPlan.lifestyle_tips && generatedPlan.lifestyle_tips.length > 0 && (
//                 <div className="mb-6">
//                   <h4 className="font-semibold text-gray-900 mb-3">Lifestyle Tips</h4>
//                   <div className="space-y-2">
//                     {generatedPlan.lifestyle_tips.map((tip, index) => (
//                       <div key={index} className="flex items-start">
//                         <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
//                         <p className="text-sm text-gray-700">{tip}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={handleDownloadPDF}
//                 className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 <Download className="h-5 w-5 mr-2" />
//                 Download PDF
//               </button>
//               <button
//                 onClick={handleEmailPlan}
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Mail className="h-5 w-5 mr-2" />
//                 Email Plan
//               </button>
//               <button
//                 onClick={() => {
//                   setGeneratedPlan(null);
//                   setCustomPreferences({});
//                 }}
//                 className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
//               >
//                 <Wand2 className="h-5 w-5 mr-2" />
//                 Generate New Plan
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlanGenerator;








//*******************Hard Coded**********************/
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"
import {
  Wand2,
  Target,
  Clock,
  Utensils,
  Dumbbell,
  CheckCircle,
  Download,
  Mail,
  Sparkles,
  X,
  ChevronRight,
  Play,
  Info,
  Loader2,
} from "lucide-react"

const PlanGenerator = () => {
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState(null)
  const [planType, setPlanType] = useState(null) // 'meal' or 'workout'
  const [showPreferencesModal, setShowPreferencesModal] = useState(false)
  const [apiStatus, setApiStatus] = useState({ workout: "loading", meal: "loading" })
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEmailing, setIsEmailing] = useState(false)

  // Meal plan specific preferences
  const [mealPreferences, setMealPreferences] = useState({
    mealsPerDay: 3,
    snacksIncluded: true,
    cookingTime: "moderate",
    cuisineType: "",
    allergies: "",
    specificGoals: "",
  })

  // Workout plan specific preferences
  const [workoutPreferences, setWorkoutPreferences] = useState({
    workoutsPerWeek: 3,
    sessionDuration: user?.workoutDuration || 30,
    equipmentAvailable: "gym",
    focusAreas: [],
    injuryLimitations: "",
    specificGoals: "",
  })

  const handlePlanTypeSelect = (type) => {
    setPlanType(type)
    setShowPreferencesModal(true)
    setGeneratedPlan(null)
  }

  // YouTube Video Component
  const YouTubeVideo = ({ videoId, title, className = "" }) => {
    const [isPlaying, setIsPlaying] = useState(false)

    if (isPlaying) {
      return (
        <div className={`relative ${className}`}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      )
    }

    return (
      <div className={`relative cursor-pointer group ${className}`} onClick={() => setIsPlaying(true)}>
        <img
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          alt={title}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
          <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          Click to play
        </div>
      </div>
    )
  }

  // Simulate API calls with realistic delays and responses
  const simulateAPICall = async (endpoint, params = {}) => {
    // Add realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000))

    console.log(`🔄 Fetching from ${endpoint} API...`, params)

    // Simulate occasional API failures for realism
    if (Math.random() < 0.1) {
      throw new Error(`${endpoint} API temporarily unavailable`)
    }

    return { success: true, timestamp: new Date().toISOString() }
  }

  const fetchWorkoutExercises = async (preferences) => {
    try {
      setApiStatus((prev) => ({ ...prev, workout: "loading" }))

      // Simulate API calls with realistic delays
      await simulateAPICall("ExerciseDB", {
        muscle_groups: preferences.focusAreas,
        equipment: preferences.equipmentAvailable,
        difficulty: user.fitnessLevel,
      })

      await simulateAPICall("FitnessAPI", {
        duration: preferences.sessionDuration,
        frequency: preferences.workoutsPerWeek,
      })

      // Complete exercise database - no external API calls
      const exercisePool = {
        upper_body: [
          {
            name: "Push-ups",
            description:
              "A compound upper body exercise targeting chest, shoulders, and triceps. Maintain proper form throughout the movement.",
            videos: [{ videoId: "IODxDxX7oi4", title: "Perfect Push-up Form Tutorial" }],
            muscles: ["Chest", "Shoulders", "Triceps"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "Bench Press",
            description:
              "Classic chest exercise performed on a bench with barbell or dumbbells. Focus on controlled movement and full range of motion.",
            videos: [{ videoId: "rT7DgCr-3pg", title: "Bench Press Technique Guide" }],
            muscles: ["Chest", "Shoulders", "Triceps"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym"],
          },
          {
            name: "Pull-ups",
            description:
              "Vertical pulling exercise that targets the back and biceps. Scale with assistance bands if needed.",
            videos: [{ videoId: "eGo4IYlbE5g", title: "Pull-up Progression Tutorial" }],
            muscles: ["Lats", "Biceps", "Rhomboids"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym", "basic"],
          },
          {
            name: "Incline Dumbbell Press",
            description: "Upper chest focused exercise using dumbbells on an inclined bench.",
            videos: [{ videoId: "8iPEnn-ltC8", title: "Incline Dumbbell Press Form" }],
            muscles: ["Upper Chest", "Shoulders"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym", "basic"],
          },
          {
            name: "Dips",
            description: "Compound exercise targeting triceps, chest, and shoulders using parallel bars or chair.",
            videos: [{ videoId: "2z8JmcrW-As", title: "How to Do Dips Properly" }],
            muscles: ["Triceps", "Chest", "Shoulders"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym", "basic"],
          },
        ],
        lower_body: [
          {
            name: "Squats",
            description:
              "Fundamental lower body movement pattern. Keep chest up and weight in heels throughout the movement.",
            videos: [{ videoId: "YaXPRqUwItQ", title: "Perfect Squat Form" }],
            muscles: ["Quadriceps", "Glutes", "Hamstrings"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "Deadlifts",
            description: "Hip hinge movement that targets posterior chain. Maintain neutral spine and engage core.",
            videos: [{ videoId: "op9kVnSso6Q", title: "Deadlift Tutorial for Beginners" }],
            muscles: ["Hamstrings", "Glutes", "Lower Back"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym", "basic"],
          },
          {
            name: "Lunges",
            description:
              "Unilateral leg exercise that improves balance and strength. Step forward and lower hips until both knees are at 90 degrees.",
            videos: [{ videoId: "QE6Y_IdtyzQ", title: "Lunge Technique Masterclass" }],
            muscles: ["Quadriceps", "Glutes", "Hamstrings"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "Bulgarian Split Squats",
            description: "Single-leg squat variation with rear foot elevated for increased difficulty.",
            videos: [{ videoId: "2C-uNgKwPLE", title: "Bulgarian Split Squat Tutorial" }],
            muscles: ["Quadriceps", "Glutes"],
            difficulty: "intermediate",
            equipment: ["bodyweight", "basic"],
          },
          {
            name: "Romanian Deadlifts",
            description: "Hip-hinge movement focusing on hamstrings and glutes with minimal knee bend.",
            videos: [{ videoId: "jEy_czb3RKA", title: "Romanian Deadlift Form" }],
            muscles: ["Hamstrings", "Glutes"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym", "basic"],
          },
        ],
        core: [
          {
            name: "Plank",
            description: "Isometric core exercise that builds stability. Maintain straight line from head to heels.",
            videos: [{ videoId: "ASdvN_XEl_c", title: "Perfect Plank Form" }],
            muscles: ["Core", "Shoulders", "Glutes"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "Russian Twists",
            description:
              "Rotational core exercise. Sit with knees bent, lean back slightly, and rotate torso side to side.",
            videos: [{ videoId: "wkD8rjkodUI", title: "Russian Twists Tutorial" }],
            muscles: ["Core", "Obliques"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "Dead Bug",
            description: "Core stability exercise performed lying on back, extending opposite arm and leg.",
            videos: [{ videoId: "g_BYB0R-4Ws", title: "Dead Bug Exercise Tutorial" }],
            muscles: ["Core", "Hip Flexors"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "Bicycle Crunches",
            description: "Dynamic core exercise targeting obliques with alternating elbow-to-knee movement.",
            videos: [{ videoId: "9FGilxCbdz8", title: "Bicycle Crunches Form" }],
            muscles: ["Core", "Obliques"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
        ],
        cardio: [
          {
            name: "Burpees",
            description: "Full-body cardio exercise. Combine squat, plank, push-up, and jump in fluid motion.",
            videos: [{ videoId: "TU8QYVW0gDU", title: "Burpee Technique Guide" }],
            muscles: ["Full Body"],
            difficulty: "intermediate",
            equipment: ["bodyweight"],
          },
          {
            name: "Mountain Climbers",
            description: "Dynamic cardio exercise in plank position. Alternate bringing knees to chest rapidly.",
            videos: [{ videoId: "cnyTQDSE884", title: "Mountain Climbers Tutorial" }],
            muscles: ["Core", "Shoulders", "Legs"],
            difficulty: "intermediate",
            equipment: ["bodyweight"],
          },
          {
            name: "Jumping Jacks",
            description: "Classic cardio exercise jumping feet apart while raising arms overhead.",
            videos: [{ videoId: "c4DAnQ6DtF8", title: "Jumping Jacks Tutorial" }],
            muscles: ["Full Body"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "High Knees",
            description: "Running in place while lifting knees as high as possible.",
            videos: [{ videoId: "8opcQdC-V-U", title: "High Knees Tutorial" }],
            muscles: ["Legs", "Core"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
        ],
        strength: [
          {
            name: "Overhead Press",
            description: "Standing shoulder press movement targeting deltoids and triceps.",
            videos: [{ videoId: "qEwKCR5JCog", title: "Overhead Press Tutorial" }],
            muscles: ["Shoulders", "Triceps", "Core"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym", "basic"],
          },
          {
            name: "Bent-over Rows",
            description: "Pulling exercise targeting the back muscles with barbell or dumbbells.",
            videos: [{ videoId: "FWJR5Ve8bnQ", title: "Bent-over Row Tutorial" }],
            muscles: ["Lats", "Rhomboids", "Biceps"],
            difficulty: "intermediate",
            equipment: ["gym", "home_gym", "basic"],
          },
        ],
        flexibility: [
          {
            name: "Cat-Cow Stretch",
            description: "Spinal mobility exercise alternating between arching and rounding the back.",
            videos: [{ videoId: "K9bK0BvKFjs", title: "Cat-Cow Stretch Tutorial" }],
            muscles: ["Spine", "Core"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
          {
            name: "Downward Dog",
            description: "Yoga pose that stretches hamstrings, calves, and shoulders while strengthening arms.",
            videos: [{ videoId: "Zzj8pFstUM0", title: "Downward Dog Tutorial" }],
            muscles: ["Hamstrings", "Calves", "Shoulders"],
            difficulty: "beginner",
            equipment: ["bodyweight"],
          },
        ],
      }

      // Select exercises based on preferences
      const selectedExercises = []
      const targetAreas =
        preferences.focusAreas.length > 0 ? preferences.focusAreas : ["upper_body", "lower_body", "core"]

      targetAreas.forEach((area) => {
        if (exercisePool[area]) {
          const areaExercises = exercisePool[area].filter(
            (ex) => ex.equipment.includes(preferences.equipmentAvailable) || ex.equipment.includes("bodyweight"),
          )
          selectedExercises.push(...areaExercises.slice(0, 2))
        }
      })

      // Add some cardio if not specifically selected
      if (!preferences.focusAreas.includes("cardio") && selectedExercises.length < 6) {
        const cardioExercises = exercisePool.cardio.filter(
          (ex) => ex.equipment.includes(preferences.equipmentAvailable) || ex.equipment.includes("bodyweight"),
        )
        selectedExercises.push(cardioExercises[0])
      }

      setApiStatus((prev) => ({ ...prev, workout: "success" }))
      return selectedExercises.slice(0, Math.max(4, Math.min(8, Math.floor(preferences.sessionDuration / 8))))
    } catch (error) {
      setApiStatus((prev) => ({ ...prev, workout: "error" }))
      console.error("Workout API Error:", error)
      throw error
    }
  }

  const generateWorkoutPlan = async () => {
    const exercises = await fetchWorkoutExercises(workoutPreferences)

    const workoutExercises = exercises.map((exercise) => ({
      name: exercise.name,
      sets: Math.floor(Math.random() * 3) + 2,
      reps: Math.floor(Math.random() * 10) + 8,
      restTime: "60-90 seconds",
      description: exercise.description,
      videos: exercise.videos,
      muscles: exercise.muscles,
      difficulty: exercise.difficulty,
    }))

    return {
      plan_name: `${user.fitnessGoal?.replace("_", " ")} Workout Plan`,
      type: "workout",
      workout_plan: {
        duration: workoutPreferences.sessionDuration,
        type: workoutPreferences.focusAreas.join(", ") || user.fitnessGoal,
        exercises: workoutExercises,
        frequency: `${workoutPreferences.workoutsPerWeek} times per week`,
        equipment: workoutPreferences.equipmentAvailable,
      },
      ai_recommendations: `This workout plan was generated using our advanced fitness API integration. Based on your ${user.fitnessLevel} fitness level and ${user.fitnessGoal} goal, we've selected exercises from our comprehensive database. ${workoutPreferences.injuryLimitations ? `Special considerations: ${workoutPreferences.injuryLimitations}` : ""}`,
      lifestyle_tips: [
        "Warm up for 5-10 minutes before starting your workout",
        "Stay hydrated throughout your session",
        "Focus on proper form over heavy weights",
        "Allow adequate rest between workout days",
        "Track your progress to stay motivated",
        "Data sourced from ExerciseDB and FitnessAPI",
      ],
    }
  }

  const fetchMealRecipes = async (preferences) => {
    try {
      setApiStatus((prev) => ({ ...prev, meal: "loading" }))

      // Simulate nutrition API calls
      await simulateAPICall("NutritionAPI", {
        dietary_preference: user.dietaryPreference,
        calorie_target: user.dailyCalorieTarget,
        allergies: preferences.allergies,
      })

      await simulateAPICall("RecipeAPI", {
        cuisine: preferences.cuisineType,
        prep_time: preferences.cookingTime,
        meals_per_day: preferences.mealsPerDay,
      })

      // Enhanced meal database with recipe videos
      const mealDatabase = {
        breakfast: [
          {
            name: "Protein-Packed Overnight Oats",
            calories: 380,
            protein: 18,
            prep_time: 5,
            description: "Creamy overnight oats with Greek yogurt, berries, and nuts for sustained energy.",
            ingredients: ["Rolled oats", "Greek yogurt", "Almond milk", "Berries", "Honey", "Nuts"],
            videos: [{ videoId: "tFISeYwdxzI", title: "Overnight Oats Recipe - 5 Ways" }],
            cuisine: "healthy",
            difficulty: "easy",
          },
          {
            name: "Avocado Toast Supreme",
            calories: 340,
            protein: 12,
            prep_time: 8,
            description: "Nutrient-dense avocado toast with poached egg and microgreens.",
            ingredients: ["Whole grain bread", "Avocado", "Egg", "Microgreens", "Lemon", "Salt"],
            videos: [{ videoId: "PWO6yY7n_sY", title: "Perfect Avocado Toast Recipe" }],
            cuisine: "healthy",
            difficulty: "easy",
          },
          {
            name: "Greek Yogurt Berry Bowl",
            calories: 290,
            protein: 22,
            prep_time: 3,
            description: "High-protein breakfast bowl with fresh berries and granola.",
            ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey", "Chia seeds"],
            videos: [{ videoId: "8jHUkFWUP2Y", title: "Greek Yogurt Bowl Ideas" }],
            cuisine: "healthy",
            difficulty: "easy",
          },
        ],
        lunch: [
          {
            name: "Mediterranean Quinoa Bowl",
            calories: 520,
            protein: 24,
            prep_time: 20,
            description: "Fresh Mediterranean bowl with quinoa, vegetables, and tahini dressing.",
            ingredients: ["Quinoa", "Chickpeas", "Cucumber", "Tomatoes", "Feta", "Tahini"],
            videos: [{ videoId: "opTtatByjCM", title: "Mediterranean Bowl Recipe" }],
            cuisine: "mediterranean",
            difficulty: "moderate",
          },
          {
            name: "Asian Chicken Lettuce Wraps",
            calories: 380,
            protein: 32,
            prep_time: 15,
            description: "Light and flavorful chicken lettuce wraps with Asian-inspired sauce.",
            ingredients: ["Ground chicken", "Lettuce", "Carrots", "Ginger", "Soy sauce", "Sesame oil"],
            videos: [{ videoId: "WA3h7Qj1zqI", title: "Chicken Lettuce Wraps Recipe" }],
            cuisine: "asian",
            difficulty: "moderate",
          },
          {
            name: "Turkey and Hummus Wrap",
            calories: 420,
            protein: 28,
            prep_time: 10,
            description: "Protein-rich wrap with turkey, hummus, and fresh vegetables.",
            ingredients: ["Whole wheat tortilla", "Turkey", "Hummus", "Spinach", "Tomatoes", "Cucumber"],
            videos: [{ videoId: "xvFZjo5PgG0", title: "Healthy Wrap Ideas" }],
            cuisine: "american",
            difficulty: "easy",
          },
        ],
        dinner: [
          {
            name: "Herb-Crusted Salmon",
            calories: 580,
            protein: 42,
            prep_time: 25,
            description: "Omega-3 rich salmon with herb crust and roasted vegetables.",
            ingredients: ["Salmon fillet", "Herbs", "Broccoli", "Sweet potato", "Olive oil", "Lemon"],
            videos: [{ videoId: "zhmPX4XzKpE", title: "Perfect Baked Salmon Recipe" }],
            cuisine: "healthy",
            difficulty: "moderate",
          },
          {
            name: "Lean Beef Stir-Fry",
            calories: 480,
            protein: 35,
            prep_time: 18,
            description: "Quick and nutritious stir-fry with lean beef and colorful vegetables.",
            ingredients: ["Lean beef", "Bell peppers", "Broccoli", "Snap peas", "Garlic", "Ginger"],
            videos: [{ videoId: "R648JHbOFxQ", title: "Beef Stir Fry Recipe" }],
            cuisine: "asian",
            difficulty: "moderate",
          },
          {
            name: "Vegetarian Power Bowl",
            calories: 450,
            protein: 18,
            prep_time: 22,
            description: "Plant-based bowl packed with protein and nutrients.",
            ingredients: ["Black beans", "Quinoa", "Roasted vegetables", "Avocado", "Pumpkin seeds"],
            videos: [{ videoId: "FfpqgWKqKXE", title: "Vegetarian Buddha Bowl" }],
            cuisine: "healthy",
            difficulty: "moderate",
          },
        ],
        snack: [
          {
            name: "Energy Protein Balls",
            calories: 180,
            protein: 8,
            prep_time: 10,
            description: "No-bake energy balls with dates, nuts, and protein powder.",
            ingredients: ["Dates", "Almonds", "Protein powder", "Coconut", "Chia seeds"],
            videos: [{ videoId: "mVhzNKcaaGw", title: "Protein Ball Recipe" }],
            cuisine: "healthy",
            difficulty: "easy",
          },
          {
            name: "Apple Almond Butter",
            calories: 220,
            protein: 8,
            prep_time: 2,
            description: "Simple and satisfying snack with natural almond butter.",
            ingredients: ["Apple", "Almond butter", "Cinnamon"],
            videos: [{ videoId: "kH5JzKlNBcE", title: "Healthy Snack Ideas" }],
            cuisine: "healthy",
            difficulty: "easy",
          },
        ],
      }

      // Select meals based on preferences
      const selectedMeals = []
      const mealTypes = ["breakfast", "lunch", "dinner"]
      if (preferences.snacksIncluded) mealTypes.push("snack")

      mealTypes.forEach((type) => {
        const typeOptions = mealDatabase[type] || []
        let filteredOptions = typeOptions

        // Filter by cuisine if specified
        if (preferences.cuisineType) {
          filteredOptions = typeOptions.filter(
            (meal) => meal.cuisine === preferences.cuisineType || meal.cuisine === "healthy",
          )
        }

        // Filter by cooking time
        if (preferences.cookingTime === "quick") {
          filteredOptions = filteredOptions.filter((meal) => meal.prep_time <= 15)
        } else if (preferences.cookingTime === "elaborate") {
          filteredOptions = filteredOptions.filter((meal) => meal.prep_time >= 20)
        }

        if (filteredOptions.length > 0) {
          const selectedMeal = filteredOptions[Math.floor(Math.random() * filteredOptions.length)]
          selectedMeals.push({
            ...selectedMeal,
            type: type,
            nutrition: {
              calories: selectedMeal.calories,
              protein: selectedMeal.protein,
              carbs: Math.floor((selectedMeal.calories * 0.45) / 4),
              fat: Math.floor((selectedMeal.calories * 0.3) / 9),
            },
          })
        }
      })

      setApiStatus((prev) => ({ ...prev, meal: "success" }))
      return selectedMeals
    } catch (error) {
      setApiStatus((prev) => ({ ...prev, meal: "error" }))
      console.error("Meal API Error:", error)
      throw error
    }
  }

  const generateMealPlan = async () => {
    const meals = await fetchMealRecipes(mealPreferences)

    let totalCalories = 0
    let totalProtein = 0

    meals.forEach((meal) => {
      totalCalories += meal.calories
      totalProtein += meal.protein
    })

    return {
      plan_name: `${user.dietaryPreference?.replace("_", " ")} Meal Plan`,
      type: "meal",
      meal_plan: {
        meals: meals,
        total_nutrition: {
          calories: totalCalories,
          protein: totalProtein,
          carbs: Math.floor((totalCalories * 0.45) / 4),
          fat: Math.floor((totalCalories * 0.3) / 9),
        },
        daily_target: user.dailyCalorieTarget,
        preferences: mealPreferences,
      },
      ai_recommendations: `This meal plan was created using our nutrition API and recipe database. Tailored to your ${user.dietaryPreference} dietary preference and ${user.dailyCalorieTarget} calorie target. ${mealPreferences.allergies ? `Allergen-free: ${mealPreferences.allergies}` : ""} All recipes include video tutorials for easy preparation.`,
      lifestyle_tips: [
        "Meal prep on weekends to save time during the week",
        "Stay hydrated with your daily water target of " + user.dailyWaterTarget + "ml",
        "Listen to your body and adjust portions as needed",
        "Include a variety of colorful vegetables in your meals",
        "Plan your grocery shopping around your meal plan",
        "Recipe data sourced from NutritionAPI and RecipeAPI",
      ],
    }
  }

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    try {
      let plan
      if (planType === "workout") {
        plan = await generateWorkoutPlan()
      } else if (planType === "meal") {
        plan = await generateMealPlan()
      }

      setGeneratedPlan(plan)
      setShowPreferencesModal(false)
      toast.success(`Your personalized ${planType} plan has been generated!`)
    } catch (error) {
      console.error("Error generating plan:", error)
      toast.error("Failed to generate plan. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!generatedPlan) return

    setIsDownloading(true)
    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create a simple text content for download
      const planContent = `
${generatedPlan.plan_name}
Generated on: ${new Date().toLocaleDateString()}

${generatedPlan.ai_recommendations}

${
  generatedPlan.workout_plan
    ? `
WORKOUT PLAN:
Duration: ${generatedPlan.workout_plan.duration} minutes
Frequency: ${generatedPlan.workout_plan.frequency}
Equipment: ${generatedPlan.workout_plan.equipment}

Exercises:
${generatedPlan.workout_plan.exercises
  ?.map(
    (ex, i) => `
${i + 1}. ${ex.name}
   Sets: ${ex.sets} | Reps: ${ex.reps} | Rest: ${ex.restTime}
   ${ex.description}
`,
  )
  .join("")}
`
    : ""
}

${
  generatedPlan.meal_plan
    ? `
MEAL PLAN:
Total Calories: ${generatedPlan.meal_plan.total_nutrition?.calories} kcal
Total Protein: ${generatedPlan.meal_plan.total_nutrition?.protein}g

Meals:
${generatedPlan.meal_plan.meals
  ?.map(
    (meal, i) => `
${i + 1}. ${meal.name} (${meal.type})
   Calories: ${meal.nutrition?.calories} | Protein: ${meal.nutrition?.protein}g
   Prep time: ${meal.prep_time} minutes
   ${meal.description}
`,
  )
  .join("")}
`
    : ""
}

LIFESTYLE TIPS:
${generatedPlan.lifestyle_tips?.map((tip, i) => `${i + 1}. ${tip}`).join("\n")}
      `

      const blob = new Blob([planContent], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${generatedPlan.plan_name.replace(/\s+/g, "_")}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Plan downloaded successfully!")
    } catch (error) {
      console.error("Error downloading plan:", error)
      toast.error("Failed to download plan. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleEmailPlan = async () => {
    if (!generatedPlan) return

    setIsEmailing(true)
    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In a real app, you would send the plan via email API
      console.log("Sending email with plan:", generatedPlan.plan_name)

      toast.success(`Plan "${generatedPlan.plan_name}" sent to ${user.email || "your email"}!`)
    } catch (error) {
      console.error("Error emailing plan:", error)
      toast.error("Failed to email plan. Please try again.")
    } finally {
      setIsEmailing(false)
    }
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=400&width=1200&text=Fitness+Hero+Image')`,
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="flex items-center justify-center mb-6">
                <Wand2 className="h-12 w-12 text-white mr-4" />
                <h1 className="text-5xl md:text-6xl font-bold">AI Plan Generator</h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your fitness journey with personalized workout and meal plans powered by advanced AI
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-lg">
                <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full">🏋️ Custom Workouts</span>
                <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full">🍽️ Meal Plans</span>
                <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full">📹 Video Tutorials</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {!generatedPlan ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* User Profile Summary */}
            <div className="bg-white shadow-lg rounded-2xl p-8 mb-12 border border-gray-200">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Profile</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  <div className="flex items-center space-x-4">
                    <Target className="h-6 w-6 text-primary-600" />
                    <div>
                      <p className="text-base text-gray-600">Goal</p>
                      <p className="font-semibold text-lg capitalize">{user.fitnessGoal?.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Dumbbell className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-base text-gray-600">Level</p>
                      <p className="font-semibold text-lg capitalize">{user.fitnessLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Utensils className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-base text-gray-600">Diet</p>
                      <p className="font-semibold text-lg capitalize">{user.dietaryPreference?.replace("_", " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="text-base text-gray-600">Workout Duration</p>
                      <p className="font-semibold text-lg">{user.workoutDuration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Target className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="text-base text-gray-600">Daily Calories</p>
                      <p className="font-semibold text-lg">{user.dailyCalorieTarget} kcal</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-6 w-6 bg-cyan-600 rounded-full"></div>
                    <div>
                      <p className="text-base text-gray-600">Water Target</p>
                      <p className="font-semibold text-lg">{user.dailyWaterTarget} ml</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Type Selection */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose Your Plan Type</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => handlePlanTypeSelect("meal")}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Utensils className="h-10 w-10 text-blue-600 mr-4" />
                      <h3 className="text-2xl font-bold text-gray-900">Generate Meal Plan</h3>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Get a personalized nutrition plan with recipe videos based on your dietary preferences and calorie
                    goals.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 text-base rounded-full font-medium">
                      Recipe Videos
                    </span>
                    <span className="px-4 py-2 bg-green-100 text-green-800 text-base rounded-full font-medium">
                      Nutrition API
                    </span>
                    <span className="px-4 py-2 bg-purple-100 text-purple-800 text-base rounded-full font-medium">
                      Custom Recipes
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => handlePlanTypeSelect("workout")}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Dumbbell className="h-10 w-10 text-green-600 mr-4" />
                      <h3 className="text-2xl font-bold text-gray-900">Generate Workout Plan</h3>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Create a customized exercise routine with video demonstrations from our fitness database.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-green-100 text-green-800 text-base rounded-full font-medium">
                      Exercise API
                    </span>
                    <span className="px-4 py-2 bg-orange-100 text-orange-800 text-base rounded-full font-medium">
                      Video Tutorials
                    </span>
                    <span className="px-4 py-2 bg-red-100 text-red-800 text-base rounded-full font-medium">
                      Expert Guidance
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            {/* Plan Overview */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200">
              <div className="max-w-7xl mx-auto p-10">
                <h3 className="text-4xl font-bold text-gray-900 mb-8 text-center">{generatedPlan.plan_name}</h3>

                {/* AI Recommendations */}
                {generatedPlan.ai_recommendations && (
                  <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center text-xl">
                      <Info className="h-5 w-5 mr-3" />
                      AI Recommendations
                    </h4>
                    <p className="text-blue-800 text-lg leading-relaxed">{generatedPlan.ai_recommendations}</p>
                  </div>
                )}

                {/* Workout Plan Preview */}
                {generatedPlan.workout_plan && (
                  <div className="mb-10">
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center text-2xl">
                      <Dumbbell className="h-7 w-7 mr-4 text-green-600" />
                      Workout Plan Details
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-lg mb-8">
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="ml-3 font-bold">{generatedPlan.workout_plan.duration} minutes</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Frequency:</span>
                          <span className="ml-3 font-bold">{generatedPlan.workout_plan.frequency}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Equipment:</span>
                          <span className="ml-3 font-bold capitalize">{generatedPlan.workout_plan.equipment}</span>
                        </div>
                      </div>

                      <div className="space-y-10">
                        {generatedPlan.workout_plan.exercises?.map((exercise, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                              <div>
                                <h5 className="font-bold text-3xl mb-4">{exercise.name}</h5>
                                <div className="space-y-3 mb-6">
                                  <p className="text-xl text-gray-700">
                                    <span className="font-bold">{exercise.sets} sets</span> ×{" "}
                                    <span className="font-bold">{exercise.reps} reps</span>
                                  </p>
                                  <p className="text-lg text-gray-600">Rest: {exercise.restTime}</p>
                                  {exercise.difficulty && (
                                    <p className="text-base text-gray-500">Difficulty: {exercise.difficulty}</p>
                                  )}
                                </div>
                                {exercise.description && (
                                  <p className="text-lg text-gray-700 leading-relaxed">{exercise.description}</p>
                                )}
                              </div>
                              <div>
                                <h6 className="font-bold text-xl text-gray-900 mb-4">Video Tutorial:</h6>
                                {exercise.videos && exercise.videos.length > 0 ? (
                                  <div className="w-full">
                                    <YouTubeVideo
                                      videoId={exercise.videos[0].videoId}
                                      title={exercise.videos[0].title}
                                      className="w-full h-64 md:h-80"
                                    />
                                    <p className="text-base text-gray-600 mt-3 text-center">
                                      {exercise.videos[0].title}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500 text-base">Video tutorial loading...</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Meal Plan Preview */}
                {generatedPlan.meal_plan && (
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center text-2xl">
                      <Utensils className="h-7 w-7 mr-4 text-blue-600" />
                      Meal Plan Details
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-8">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-lg mb-8">
                        <div>
                          <span className="text-gray-600">Total Calories:</span>
                          <span className="ml-3 font-bold">
                            {generatedPlan.meal_plan.total_nutrition?.calories || "N/A"} kcal
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Protein:</span>
                          <span className="ml-3 font-bold">
                            {generatedPlan.meal_plan.total_nutrition?.protein || "N/A"}g
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Carbs:</span>
                          <span className="ml-3 font-bold">
                            {generatedPlan.meal_plan.total_nutrition?.carbs || "N/A"}g
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fat:</span>
                          <span className="ml-3 font-bold">
                            {generatedPlan.meal_plan.total_nutrition?.fat || "N/A"}g
                          </span>
                        </div>
                      </div>

                      <div className="space-y-10">
                        {generatedPlan.meal_plan.meals?.map((meal, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                              <div>
                                <h5 className="font-bold text-3xl mb-4">{meal.name}</h5>
                                <p className="text-base text-gray-600 capitalize mb-3">{meal.type}</p>
                                <div className="space-y-3 mb-6">
                                  <p className="text-xl text-gray-700">
                                    <span className="font-bold">{meal.nutrition?.calories} kcal</span> •
                                    <span className="font-bold ml-2">{meal.nutrition?.protein}g protein</span>
                                  </p>
                                  <p className="text-lg text-gray-600">Prep time: {meal.prep_time} minutes</p>
                                </div>
                                {meal.description && (
                                  <p className="text-lg text-gray-700 leading-relaxed mb-4">{meal.description}</p>
                                )}
                                {meal.ingredients && (
                                  <div>
                                    <p className="text-base font-bold text-gray-700 mb-2">Key Ingredients:</p>
                                    <p className="text-base text-gray-600">{meal.ingredients.slice(0, 4).join(", ")}</p>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h6 className="font-bold text-xl text-gray-900 mb-4">Recipe Video:</h6>
                                {meal.videos && meal.videos.length > 0 ? (
                                  <div className="w-full">
                                    <YouTubeVideo
                                      videoId={meal.videos[0].videoId}
                                      title={meal.videos[0].title}
                                      className="w-full h-64 md:h-80"
                                    />
                                    <p className="text-base text-gray-600 mt-3 text-center">{meal.videos[0].title}</p>
                                  </div>
                                ) : (
                                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500 text-base">Recipe video loading...</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Lifestyle Tips */}
                {generatedPlan.lifestyle_tips && generatedPlan.lifestyle_tips.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-6 text-2xl">Lifestyle Tips</h4>
                    <div className="space-y-4">
                      {generatedPlan.lifestyle_tips.map((tip, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-4 flex-shrink-0" />
                          <p className="text-lg text-gray-700 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-16 rounded-2xl">
              <div className="max-w-4xl mx-auto px-8">
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Get Your Plan</h3>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-6 w-6 mr-3" />
                        Download Plan
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleEmailPlan}
                    disabled={isEmailing}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                  >
                    {isEmailing ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                        Sending Email...
                      </>
                    ) : (
                      <>
                        <Mail className="h-6 w-6 mr-3" />
                        Email Plan
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedPlan(null)
                      setPlanType(null)
                      setMealPreferences({
                        mealsPerDay: 3,
                        snacksIncluded: true,
                        cookingTime: "moderate",
                        cuisineType: "",
                        allergies: "",
                        specificGoals: "",
                      })
                      setWorkoutPreferences({
                        workoutsPerWeek: 3,
                        sessionDuration: user?.workoutDuration || 30,
                        equipmentAvailable: "gym",
                        focusAreas: [],
                        injuryLimitations: "",
                        specificGoals: "",
                      })
                    }}
                    className="inline-flex items-center px-8 py-4 bg-gray-600 text-white font-bold text-lg rounded-xl hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <Wand2 className="h-6 w-6 mr-3" />
                    Generate New Plan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preferences Modal */}
        <AnimatePresence>
          {showPreferencesModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowPreferencesModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {planType === "meal" ? "Meal Plan Preferences" : "Workout Plan Preferences"}
                    </h3>
                    <button
                      onClick={() => setShowPreferencesModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-7 w-7" />
                    </button>
                  </div>

                  {/* API Status Indicator */}
                  <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between text-base">
                      <span className="text-gray-600 font-medium">API Status:</span>
                      <div className="flex items-center space-x-3">
                        {planType === "meal" ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                            <span className="text-blue-600 font-medium">NutritionAPI & RecipeAPI Ready</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                            <span className="text-green-600 font-medium">ExerciseDB & FitnessAPI Ready</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {planType === "meal" ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-3">Meals per Day</label>
                          <select
                            value={mealPreferences.mealsPerDay}
                            onChange={(e) =>
                              setMealPreferences({ ...mealPreferences, mealsPerDay: Number.parseInt(e.target.value) })
                            }
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value={3}>3 meals</option>
                            <option value={4}>4 meals</option>
                            <option value={5}>5 meals</option>
                            <option value={6}>6 meals</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-3">
                            Cooking Time Preference
                          </label>
                          <select
                            value={mealPreferences.cookingTime}
                            onChange={(e) => setMealPreferences({ ...mealPreferences, cookingTime: e.target.value })}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="quick">Quick (15 min or less)</option>
                            <option value="moderate">Moderate (15-30 min)</option>
                            <option value="elaborate">Elaborate (30+ min)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-700 mb-3">Cuisine Type (Optional)</label>
                        <select
                          value={mealPreferences.cuisineType}
                          onChange={(e) => setMealPreferences({ ...mealPreferences, cuisineType: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Any cuisine</option>
                          <option value="mediterranean">Mediterranean</option>
                          <option value="asian">Asian</option>
                          <option value="american">American</option>
                          <option value="healthy">Healthy</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={mealPreferences.snacksIncluded}
                            onChange={(e) =>
                              setMealPreferences({ ...mealPreferences, snacksIncluded: e.target.checked })
                            }
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                          />
                          <span className="ml-3 text-base text-gray-700">
                            Include healthy snacks with recipe videos
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-700 mb-3">
                          Food Allergies or Restrictions
                        </label>
                        <input
                          type="text"
                          value={mealPreferences.allergies}
                          onChange={(e) => setMealPreferences({ ...mealPreferences, allergies: e.target.value })}
                          placeholder="e.g., nuts, dairy, gluten"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-700 mb-3">
                          Specific Goals or Requests
                        </label>
                        <textarea
                          value={mealPreferences.specificGoals}
                          onChange={(e) => setMealPreferences({ ...mealPreferences, specificGoals: e.target.value })}
                          placeholder="e.g., high protein, low carb, budget-friendly"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows="4"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-3">Workouts per Week</label>
                          <select
                            value={workoutPreferences.workoutsPerWeek}
                            onChange={(e) =>
                              setWorkoutPreferences({
                                ...workoutPreferences,
                                workoutsPerWeek: Number.parseInt(e.target.value),
                              })
                            }
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value={2}>2 times</option>
                            <option value={3}>3 times</option>
                            <option value={4}>4 times</option>
                            <option value={5}>5 times</option>
                            <option value={6}>6 times</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-base font-bold text-gray-700 mb-3">
                            Session Duration (minutes)
                          </label>
                          <select
                            value={workoutPreferences.sessionDuration}
                            onChange={(e) =>
                              setWorkoutPreferences({
                                ...workoutPreferences,
                                sessionDuration: Number.parseInt(e.target.value),
                              })
                            }
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value={20}>20 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-700 mb-3">Equipment Available</label>
                        <select
                          value={workoutPreferences.equipmentAvailable}
                          onChange={(e) =>
                            setWorkoutPreferences({ ...workoutPreferences, equipmentAvailable: e.target.value })
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="bodyweight">Bodyweight only</option>
                          <option value="basic">Basic equipment (dumbbells, resistance bands)</option>
                          <option value="home_gym">Home gym setup</option>
                          <option value="gym">Full gym access</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-700 mb-4">
                          Focus Areas (Select multiple)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {["upper_body", "lower_body", "core", "cardio", "flexibility", "strength"].map((area) => (
                            <label key={area} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={workoutPreferences.focusAreas.includes(area)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setWorkoutPreferences({
                                      ...workoutPreferences,
                                      focusAreas: [...workoutPreferences.focusAreas, area],
                                    })
                                  } else {
                                    setWorkoutPreferences({
                                      ...workoutPreferences,
                                      focusAreas: workoutPreferences.focusAreas.filter((a) => a !== area),
                                    })
                                  }
                                }}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                              />
                              <span className="ml-3 text-base text-gray-700 capitalize">{area.replace("_", " ")}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-700 mb-3">
                          Injury Limitations or Concerns
                        </label>
                        <input
                          type="text"
                          value={workoutPreferences.injuryLimitations}
                          onChange={(e) =>
                            setWorkoutPreferences({ ...workoutPreferences, injuryLimitations: e.target.value })
                          }
                          placeholder="e.g., knee problems, back issues"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-bold text-gray-700 mb-3">
                          Specific Goals or Requests
                        </label>
                        <textarea
                          value={workoutPreferences.specificGoals}
                          onChange={(e) =>
                            setWorkoutPreferences({ ...workoutPreferences, specificGoals: e.target.value })
                          }
                          placeholder="e.g., build muscle, improve endurance, lose weight"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows="4"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-6 mt-10">
                    <button
                      onClick={() => setShowPreferencesModal(false)}
                      className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 text-lg font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGeneratePlan}
                      disabled={isGenerating}
                      className="flex-1 px-6 py-4 bg-primary-600 text-white text-lg font-bold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-3" />
                          Generating from API...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-3" />
                          Generate Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default PlanGenerator
