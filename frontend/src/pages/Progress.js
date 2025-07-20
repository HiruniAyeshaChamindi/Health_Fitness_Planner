// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '../contexts/AuthContext';
// import { progressAPI } from '../services/api';
// import LoadingSpinner from '../components/LoadingSpinner';
// import toast from 'react-hot-toast';
// import {
//   TrendingUp,
//   Calendar,
//   Target,
//   Award,
//   Activity,
//   Scale,
//   Ruler,
//   Droplets,
//   Timer,
//   Plus,
//   Edit3,
//   Save,
//   X
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';

// const Progress = () => {
//   const { user } = useAuth();
//   const [progressData, setProgressData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [selectedPeriod, setSelectedPeriod] = useState('30');
  
//   const [newEntry, setNewEntry] = useState({
//     weight: '',
//     body_fat_percentage: '',
//     muscle_mass: '',
//     water_intake: '',
//     workout_duration: '',
//     calories_consumed: '',
//     notes: ''
//   });

//   useEffect(() => {
//     fetchProgressData();
//   }, [selectedPeriod]);

//   const fetchProgressData = async () => {
//     try {
//       const response = await progressAPI.getUserProgress(selectedPeriod);
//       setProgressData(response.data.progress || []);
//     } catch (error) {
//       console.error('Error fetching progress:', error);
//       toast.error('Failed to load progress data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddEntry = async () => {
//     try {
//       const entryData = Object.fromEntries(
//         Object.entries(newEntry).filter(([_, value]) => value !== '')
//       );
      
//       const response = await progressAPI.addProgress(entryData);
//       setProgressData([response.data.progress, ...progressData]);
//       setNewEntry({
//         weight: '',
//         body_fat_percentage: '',
//         muscle_mass: '',
//         water_intake: '',
//         workout_duration: '',
//         calories_consumed: '',
//         notes: ''
//       });
//       setShowAddForm(false);
//       toast.success('Progress entry added successfully!');
//     } catch (error) {
//       console.error('Error adding progress:', error);
//       toast.error('Failed to add progress entry');
//     }
//   };

//   const handleUpdateEntry = async (entryId, updatedData) => {
//     try {
//       const response = await progressAPI.updateProgress(entryId, updatedData);
//       setProgressData(progressData.map(entry => 
//         entry._id === entryId ? response.data.progress : entry
//       ));
//       setEditingEntry(null);
//       toast.success('Progress entry updated successfully!');
//     } catch (error) {
//       console.error('Error updating progress:', error);
//       toast.error('Failed to update progress entry');
//     }
//   };

//   const handleDeleteEntry = async (entryId) => {
//     if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
//     try {
//       await progressAPI.deleteProgress(entryId);
//       setProgressData(progressData.filter(entry => entry._id !== entryId));
//       toast.success('Progress entry deleted successfully!');
//     } catch (error) {
//       console.error('Error deleting progress:', error);
//       toast.error('Failed to delete progress entry');
//     }
//   };

//   const getChartData = () => {
//     return progressData
//       .slice(-30)
//       .map(entry => ({
//         date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//         weight: entry.weight || null,
//         body_fat: entry.body_fat_percentage || null,
//         muscle_mass: entry.muscle_mass || null,
//         water_intake: entry.water_intake || null,
//         workout_duration: entry.workout_duration || null,
//         calories: entry.calories_consumed || null
//       }));
//   };

//   const getStatsCards = () => {
//     if (progressData.length === 0) return null;

//     const latest = progressData[0];
//     const previous = progressData[1];
    
//     return [
//       {
//         label: 'Current Weight',
//         value: latest.weight ? `${latest.weight} kg` : 'N/A',
//         change: previous?.weight ? (latest.weight - previous.weight).toFixed(1) : null,
//         icon: Scale,
//         color: 'blue'
//       },
//       {
//         label: 'Body Fat %',
//         value: latest.body_fat_percentage ? `${latest.body_fat_percentage}%` : 'N/A',
//         change: previous?.body_fat_percentage ? (latest.body_fat_percentage - previous.body_fat_percentage).toFixed(1) : null,
//         icon: Target,
//         color: 'red'
//       },
//       {
//         label: 'Muscle Mass',
//         value: latest.muscle_mass ? `${latest.muscle_mass} kg` : 'N/A',
//         change: previous?.muscle_mass ? (latest.muscle_mass - previous.muscle_mass).toFixed(1) : null,
//         icon: Activity,
//         color: 'green'
//       },
//       {
//         label: 'Water Intake',
//         value: latest.water_intake ? `${latest.water_intake} ml` : 'N/A',
//         change: previous?.water_intake ? (latest.water_intake - previous.water_intake) : null,
//         icon: Droplets,
//         color: 'cyan'
//       }
//     ];
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   const chartData = getChartData();
//   const statsCards = getStatsCards();

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
//               <p className="mt-2 text-gray-600">
//                 Monitor your fitness journey and track your achievements
//               </p>
//             </div>
//             <div className="mt-4 sm:mt-0 flex items-center space-x-4">
//               <select
//                 value={selectedPeriod}
//                 onChange={(e) => setSelectedPeriod(e.target.value)}
//                 className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//               >
//                 <option value="7">Last 7 days</option>
//                 <option value="30">Last 30 days</option>
//                 <option value="90">Last 90 days</option>
//                 <option value="365">Last year</option>
//               </select>
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Add Entry
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Stats Cards */}
//         {statsCards && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//           >
//             {statsCards.map((stat, index) => {
//               const Icon = stat.icon;
//               return (
//                 <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                   <div className="flex items-center">
//                     <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
//                       <Icon className={`h-6 w-6 text-${stat.color}-600`} />
//                     </div>
//                     <div className="ml-4 flex-1">
//                       <p className="text-sm text-gray-600">{stat.label}</p>
//                       <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                       {stat.change && (
//                         <p className={`text-sm ${
//                           stat.change > 0 ? 'text-green-600' : 'text-red-600'
//                         }`}>
//                           {stat.change > 0 ? '+' : ''}{stat.change}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </motion.div>
//         )}

//         {/* Charts */}
//         {progressData.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
//           >
//             {/* Weight Progress Chart */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Body Composition Chart */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Composition</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="body_fat" stroke="#EF4444" strokeWidth={2} name="Body Fat %" />
//                   <Line type="monotone" dataKey="muscle_mass" stroke="#10B981" strokeWidth={2} name="Muscle Mass" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Water Intake Chart */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Water Intake</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="water_intake" fill="#06B6D4" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Workout Duration Chart */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Duration</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="workout_duration" fill="#8B5CF6" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>
//         )}

//         {/* Progress Entries */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white rounded-xl shadow-sm border border-gray-200"
//         >
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
//           </div>

//           {progressData.length === 0 ? (
//             <div className="p-8 text-center">
//               <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No progress data yet</h3>
//               <p className="text-gray-600 mb-6">Start tracking your progress to see insights and trends</p>
//               <button
//                 onClick={() => setShowAddForm(true)}
//                 className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
//               >
//                 <Plus className="h-5 w-5 mr-2" />
//                 Add First Entry
//               </button>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {progressData.map((entry, index) => (
//                 <div key={entry._id} className="p-6">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                       <div>
//                         <p className="text-sm text-gray-600">Date</p>
//                         <p className="font-medium">{formatDate(entry.date)}</p>
//                       </div>
//                       {entry.weight && (
//                         <div>
//                           <p className="text-sm text-gray-600">Weight</p>
//                           <p className="font-medium">{entry.weight} kg</p>
//                         </div>
//                       )}
//                       {entry.body_fat_percentage && (
//                         <div>
//                           <p className="text-sm text-gray-600">Body Fat</p>
//                           <p className="font-medium">{entry.body_fat_percentage}%</p>
//                         </div>
//                       )}
//                       {entry.muscle_mass && (
//                         <div>
//                           <p className="text-sm text-gray-600">Muscle Mass</p>
//                           <p className="font-medium">{entry.muscle_mass} kg</p>
//                         </div>
//                       )}
//                       {entry.water_intake && (
//                         <div>
//                           <p className="text-sm text-gray-600">Water Intake</p>
//                           <p className="font-medium">{entry.water_intake} ml</p>
//                         </div>
//                       )}
//                       {entry.workout_duration && (
//                         <div>
//                           <p className="text-sm text-gray-600">Workout</p>
//                           <p className="font-medium">{entry.workout_duration} min</p>
//                         </div>
//                       )}
//                       {entry.calories_consumed && (
//                         <div>
//                           <p className="text-sm text-gray-600">Calories</p>
//                           <p className="font-medium">{entry.calories_consumed} kcal</p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex items-center space-x-2 ml-4">
//                       <button
//                         onClick={() => setEditingEntry(entry)}
//                         className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         <Edit3 className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteEntry(entry._id)}
//                         className="p-2 text-gray-400 hover:text-red-600 transition-colors"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                   {entry.notes && (
//                     <div className="mt-3 p-3 bg-gray-50 rounded-lg">
//                       <p className="text-sm text-gray-700">{entry.notes}</p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </motion.div>

//         {/* Add Entry Modal */}
//         {showAddForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold text-gray-900">Add Progress Entry</h2>
//                   <button
//                     onClick={() => setShowAddForm(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Weight (kg)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={newEntry.weight}
//                       onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Body Fat (%)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={newEntry.body_fat_percentage}
//                       onChange={(e) => setNewEntry({...newEntry, body_fat_percentage: e.target.value})}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Muscle Mass (kg)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={newEntry.muscle_mass}
//                       onChange={(e) => setNewEntry({...newEntry, muscle_mass: e.target.value})}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Water Intake (ml)
//                     </label>
//                     <input
//                       type="number"
//                       value={newEntry.water_intake}
//                       onChange={(e) => setNewEntry({...newEntry, water_intake: e.target.value})}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Workout Duration (min)
//                     </label>
//                     <input
//                       type="number"
//                       value={newEntry.workout_duration}
//                       onChange={(e) => setNewEntry({...newEntry, workout_duration: e.target.value})}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Calories Consumed
//                     </label>
//                     <input
//                       type="number"
//                       value={newEntry.calories_consumed}
//                       onChange={(e) => setNewEntry({...newEntry, calories_consumed: e.target.value})}
//                       className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Notes (optional)
//                   </label>
//                   <textarea
//                     value={newEntry.notes}
//                     onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
//                     rows="3"
//                     className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="Any additional notes about your progress..."
//                   />
//                 </div>

//                 <div className="flex justify-end space-x-3">
//                   <button
//                     onClick={() => setShowAddForm(false)}
//                     className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleAddEntry}
//                     className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//                   >
//                     Add Entry
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Progress;












//************Hardcoded */


"use client"

import { useState } from "react"
import {
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Scale,
  Droplets,
  Timer,
  Plus,
  Edit3,
  X,
  Download,
  BarChart3,
  Zap,
  Heart,
  Brain,
  Moon,
  Sun,
  Trophy,
  Flame,
  CheckCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Menu,
} from "lucide-react"

const ProgressTracker = () => {
  // State management
  const [progressData, setProgressData] = useState([
    {
      _id: "1",
      date: "2025-01-20",
      weight: 72.5,
      body_fat_percentage: 18.2,
      muscle_mass: 32.1,
      water_intake: 2500,
      workout_duration: 45,
      calories_consumed: 2100,
      steps: 8500,
      sleep_hours: 7.5,
      mood: 4,
      energy_level: 4,
      stress_level: 2,
      notes: "Great workout today! Feeling strong and energetic.",
      photos: [],
    },
    {
      _id: "2",
      date: "2025-01-19",
      weight: 72.8,
      body_fat_percentage: 18.5,
      muscle_mass: 31.9,
      water_intake: 2200,
      workout_duration: 60,
      calories_consumed: 2200,
      steps: 12000,
      sleep_hours: 8,
      mood: 5,
      energy_level: 5,
      stress_level: 1,
      notes: "Perfect day - hit all my targets!",
      photos: [],
    },
  ])

  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [activeTab, setActiveTab] = useState("overview") // overview, goals, analytics, entries
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const [goals, setGoals] = useState({
    weight: { target: 70, deadline: "2025-03-01", priority: "high" },
    body_fat_percentage: { target: 15, deadline: "2025-04-01", priority: "medium" },
    water_intake: { target: 3000, deadline: null, priority: "low" },
    workout_duration: { target: 60, deadline: null, priority: "high" },
  })

  const [newEntry, setNewEntry] = useState({
    weight: "",
    body_fat_percentage: "",
    muscle_mass: "",
    water_intake: "",
    workout_duration: "",
    calories_consumed: "",
    steps: "",
    sleep_hours: "",
    mood: "",
    energy_level: "",
    stress_level: "",
    notes: "",
    photos: [],
  })

  const [achievements, setAchievements] = useState([
    { id: 1, title: "First Entry", description: "Added your first progress entry", earned: true, date: "2025-01-19" },
    { id: 2, title: "Consistency King", description: "7 days in a row tracking", earned: false },
    { id: 3, title: "Water Champion", description: "Hit water goal 5 days straight", earned: true, date: "2025-01-18" },
    { id: 4, title: "Workout Warrior", description: "10 hours of workouts this week", earned: false },
  ])

  // Metrics configuration with fixed colors
  const metricsConfig = {
    weight: {
      label: "Weight",
      unit: "kg",
      icon: Scale,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    body_fat_percentage: {
      label: "Body Fat",
      unit: "%",
      icon: Target,
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200",
    },
    muscle_mass: {
      label: "Muscle Mass",
      unit: "kg",
      icon: Activity,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200",
    },
    water_intake: {
      label: "Water",
      unit: "ml",
      icon: Droplets,
      color: "cyan",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-200",
    },
    workout_duration: {
      label: "Workout",
      unit: "min",
      icon: Timer,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    calories_consumed: {
      label: "Calories",
      unit: "kcal",
      icon: Flame,
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
    },
    steps: {
      label: "Steps",
      unit: "",
      icon: Activity,
      color: "indigo",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
    },
    sleep_hours: {
      label: "Sleep",
      unit: "hrs",
      icon: Moon,
      color: "violet",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
      borderColor: "border-violet-200",
    },
    mood: {
      label: "Mood",
      unit: "/5",
      icon: Sun,
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200",
    },
    energy_level: {
      label: "Energy",
      unit: "/5",
      icon: Zap,
      color: "amber",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
    },
    stress_level: {
      label: "Stress",
      unit: "/5",
      icon: Brain,
      color: "pink",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      borderColor: "border-pink-200",
    },
  }

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getQuickStats = () => {
    if (progressData.length === 0) return []
    const latest = progressData[0]
    const previous = progressData[1]

    const primaryMetrics = ["weight", "body_fat_percentage", "muscle_mass", "water_intake"]

    return primaryMetrics.map((key) => {
      const config = metricsConfig[key]
      const currentValue = latest[key]
      const previousValue = previous?.[key]
      const change = previousValue ? currentValue - previousValue : null

      return {
        key,
        label: config.label,
        value: currentValue ? `${currentValue}${config.unit}` : "N/A",
        change: change ? change.toFixed(1) : null,
        icon: config.icon,
        ...config,
        goal: goals[key]?.target,
        progress: goals[key]?.target ? ((currentValue / goals[key].target) * 100).toFixed(1) : null,
      }
    })
  }

  // Event handlers
  const handleAddEntry = () => {
    const entryData = Object.fromEntries(
      Object.entries(newEntry).filter(([_, value]) => value !== "" && value !== null),
    )

    const newId = (progressData.length + 1).toString()
    const entry = {
      ...entryData,
      _id: newId,
      date: new Date().toISOString().split("T")[0],
    }

    setProgressData([entry, ...progressData])
    setNewEntry({
      weight: "",
      body_fat_percentage: "",
      muscle_mass: "",
      water_intake: "",
      workout_duration: "",
      calories_consumed: "",
      steps: "",
      sleep_hours: "",
      mood: "",
      energy_level: "",
      stress_level: "",
      notes: "",
      photos: [],
    })
    setShowAddForm(false)
  }

  const handleDeleteEntry = (entryId) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setProgressData(progressData.filter((entry) => entry._id !== entryId))
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(progressData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "progress-data.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const quickStats = getQuickStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="ml-3 text-xl font-bold text-gray-900">Progress Tracker</h1>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>

              <button
                onClick={exportData}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </button>
              <div className="flex space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <button onClick={exportData} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "goals", label: "Goals", icon: Target },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "entries", label: "Entries", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Overview</h2>
              {quickStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <div key={stat.key} className={`${stat.bgColor} rounded-xl p-6 border ${stat.borderColor}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                            <Icon className={`h-6 w-6 ${stat.textColor}`} />
                          </div>
                          {stat.change && (
                            <div
                              className={`flex items-center text-sm font-medium ${
                                stat.change > 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {stat.change > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                              {Math.abs(stat.change)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          {stat.progress && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Goal Progress</span>
                                <span>{stat.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full bg-${stat.color}-500 transition-all duration-500`}
                                  style={{ width: `${Math.min(stat.progress, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data yet</h3>
                  <p className="text-gray-600 mb-6">Start tracking your progress to see your overview</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Entry
                  </button>
                </div>
              )}
            </div>

            {/* Recent Achievements */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                Recent Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements
                  .filter((a) => a.earned)
                  .slice(0, 4)
                  .map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <Star className="h-5 w-5 text-yellow-500 fill-current mt-0.5 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                            {achievement.date && (
                              <p className="text-xs text-gray-500 mt-2">Earned {formatDate(achievement.date)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(goals).map(([key, goal]) => {
                const config = metricsConfig[key]
                const currentValue = progressData[0]?.[key]
                const progress = currentValue ? (currentValue / goal.target) * 100 : 0
                const isComplete = progress >= 100

                return (
                  <div key={key} className={`${config.bgColor} rounded-xl p-6 border ${config.borderColor} relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <config.icon className={`h-6 w-6 ${config.textColor}`} />
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          goal.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : goal.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {goal.priority} priority
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.label}</h3>
                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-3xl font-bold text-gray-900">{goal.target}</span>
                      <span className="text-lg text-gray-600">{config.unit}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Current: {currentValue || 0}
                          {config.unit}
                        </span>
                        <span className="font-medium">{Math.min(progress, 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3 shadow-inner">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isComplete ? "bg-green-500" : `bg-${config.color}-500`
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    {isComplete && (
                      <div className="absolute -top-2 -right-2">
                        <div className="bg-green-500 text-white rounded-full p-1">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600">Detailed charts and insights will be available here</p>
            </div>
          </div>
        )}

        {/* Entries Tab */}
        {activeTab === "entries" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Progress Entries</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </button>
            </div>

            {progressData.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
                <p className="text-gray-600 mb-6">Start tracking your progress by adding your first entry</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Entry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {progressData.map((entry) => (
                  <div
                    key={entry._id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{formatDate(entry.date)}</h3>
                          {entry.mood && (
                            <div className="flex items-center mt-1">
                              <Sun className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-gray-600">Mood: {entry.mood}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry._id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      {Object.entries(metricsConfig).map(([key, config]) => {
                        const value = entry[key]
                        if (!value) return null

                        return (
                          <div key={key} className={`${config.bgColor} rounded-lg p-3 text-center`}>
                            <config.icon className={`h-4 w-4 mx-auto mb-1 ${config.textColor}`} />
                            <p className="text-xs text-gray-600 mb-1">{config.label}</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {value}
                              {config.unit}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {entry.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-4">
                        <p className="text-sm text-gray-700">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Add Progress Entry</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Body Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Scale className="h-5 w-5 mr-2 text-blue-600" />
                  Body Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="72.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.body_fat_percentage}
                      onChange={(e) => setNewEntry({ ...newEntry, body_fat_percentage: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="18.2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Muscle Mass (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.muscle_mass}
                      onChange={(e) => setNewEntry({ ...newEntry, muscle_mass: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="32.1"
                    />
                  </div>
                </div>
              </div>

              {/* Activity Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  Activity & Exercise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workout Duration (min)</label>
                    <input
                      type="number"
                      value={newEntry.workout_duration}
                      onChange={(e) => setNewEntry({ ...newEntry, workout_duration: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
                    <input
                      type="number"
                      value={newEntry.steps}
                      onChange={(e) => setNewEntry({ ...newEntry, steps: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calories Consumed</label>
                    <input
                      type="number"
                      value={newEntry.calories_consumed}
                      onChange={(e) => setNewEntry({ ...newEntry, calories_consumed: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2100"
                    />
                  </div>
                </div>
              </div>

              {/* Wellness Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Wellness & Recovery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Water Intake (ml)</label>
                    <input
                      type="number"
                      value={newEntry.water_intake}
                      onChange={(e) => setNewEntry({ ...newEntry, water_intake: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="2500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newEntry.sleep_hours}
                      onChange={(e) => setNewEntry({ ...newEntry, sleep_hours: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="7.5"
                    />
                  </div>
                </div>
              </div>

              {/* Subjective Ratings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sun className="h-5 w-5 mr-2 text-yellow-600" />
                  How You Feel (1-5 Scale)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: "mood", label: "Mood", icon: Sun },
                    { key: "energy_level", label: "Energy Level", icon: Zap },
                    { key: "stress_level", label: "Stress Level", icon: Brain },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Icon className="h-4 w-4 mr-2 text-gray-600" />
                        {label}
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewEntry({ ...newEntry, [key]: rating.toString() })}
                            className={`w-10 h-10 rounded-full border-2 transition-all font-medium ${
                              newEntry[key] === rating.toString()
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-300 hover:border-blue-400 text-gray-600 hover:bg-blue-50"
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Edit3 className="h-4 w-4 mr-2 text-gray-600" />
                  Notes (optional)
                </label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How are you feeling today? Any observations about your progress..."
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Entry</h2>
                <button
                  onClick={() => setEditingEntry(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {Object.entries(metricsConfig)
                .slice(0, 8)
                .map(([key, config]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {config.label} {config.unit && `(${config.unit})`}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingEntry[key] || ""}
                      onChange={(e) => setEditingEntry({ ...editingEntry, [key]: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={editingEntry.notes || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setProgressData(
                      progressData.map((entry) =>
                        entry._id === editingEntry._id ? { ...entry, ...editingEntry } : entry,
                      ),
                    )
                    setEditingEntry(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressTracker
