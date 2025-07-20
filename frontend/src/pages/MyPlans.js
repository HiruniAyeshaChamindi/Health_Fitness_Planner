import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { plansAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  Calendar,
  Download,
  Mail,
  Star,
  Clock,
  Target,
  Utensils,
  Dumbbell,
  Search,
  Filter,
  Eye,
  Trash2,
  Plus,
  TrendingUp,
  Heart
} from 'lucide-react';

const MyPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getUserPlans();
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load your plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await plansAPI.deletePlan(planId);
      setPlans(plans.filter(plan => plan._id !== planId));
      toast.success('Plan deleted successfully');
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const handleDownloadPDF = async (plan) => {
    try {
      const response = await plansAPI.downloadPDF(plan._id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.plan_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Plan downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const handleEmailPlan = async (plan) => {
    try {
      await plansAPI.emailPlan(plan._id);
      toast.success('Plan sent to your email!');
    } catch (error) {
      console.error('Error emailing plan:', error);
      toast.error('Failed to email plan');
    }
  };

  const handleRatePlan = async (planId, rating) => {
    try {
      await plansAPI.ratePlan(planId, { rating });
      setPlans(plans.map(plan => 
        plan._id === planId 
          ? { ...plan, user_feedback: { ...plan.user_feedback, rating } }
          : plan
      ));
      toast.success('Rating saved!');
    } catch (error) {
      console.error('Error rating plan:', error);
      toast.error('Failed to save rating');
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.plan_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || plan.plan_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'rating':
        return (b.user_feedback?.rating || 0) - (a.user_feedback?.rating || 0);
      case 'name':
        return a.plan_name.localeCompare(b.plan_name);
      default:
        return 0;
    }
  });

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Plans</h1>
              <p className="mt-2 text-gray-600">
                Manage and track your fitness and nutrition plans
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => window.location.href = '/generate-plan'}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Generate New Plan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.filter(plan => 
                    new Date(plan.created_at).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.length > 0 ? (
                    plans.reduce((acc, plan) => acc + (plan.user_feedback?.rating || 0), 0) / plans.length
                  ).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">
                  {plans.filter(plan => plan.user_feedback?.rating >= 4).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="daily">Daily Plans</option>
                  <option value="weekly">Weekly Plans</option>
                  <option value="custom">Custom Plans</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        {sortedPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by generating your first plan'
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedPlans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Plan Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {plan.plan_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      plan.plan_type === 'daily' ? 'bg-blue-100 text-blue-800' :
                      plan.plan_type === 'weekly' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {plan.plan_type}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(plan.created_at)}
                  </div>

                  {/* Plan Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {plan.workout_plan && (
                      <div className="flex items-center">
                        <Dumbbell className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-600">{plan.workout_plan.duration}min workout</span>
                      </div>
                    )}
                    {plan.meal_plan && (
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-gray-600">{plan.meal_plan.meals?.length || 0} meals</span>
                      </div>
                    )}
                    {plan.total_calories && (
                      <div className="flex items-center">
                        <Target className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-gray-600">{plan.total_calories} kcal</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-gray-600">
                        {plan.estimated_duration || plan.workout_plan?.duration || 'N/A'} min
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-3">
                    <div className="flex items-center mr-3">
                      {getRatingStars(plan.user_feedback?.rating || 0)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {plan.user_feedback?.rating || 'Not rated'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-100 px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowDetailModal(true);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(plan)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleEmailPlan(plan)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Rating */}
                  <div className="flex items-center justify-center mt-3 space-x-1">
                    <span className="text-xs text-gray-600 mr-2">Rate:</span>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatePlan(plan._id, rating)}
                        className="p-1"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            rating <= (plan.user_feedback?.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Plan Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.plan_name}</h2>
                      <p className="text-gray-600 mt-1">Created on {formatDate(selectedPlan.created_at)}</p>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Plan Content */}
                  <div className="space-y-6">
                    {selectedPlan.ai_recommendations && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">AI Recommendations</h3>
                        <p className="text-blue-800 text-sm">{selectedPlan.ai_recommendations}</p>
                      </div>
                    )}

                    {selectedPlan.workout_plan && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Dumbbell className="h-5 w-5 mr-2 text-green-600" />
                          Workout Plan ({selectedPlan.workout_plan.duration} minutes)
                        </h3>
                        <div className="space-y-3">
                          {selectedPlan.workout_plan.exercises?.map((exercise, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                              {exercise.sets && exercise.reps && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {exercise.sets} sets × {exercise.reps} reps
                                </p>
                              )}
                              {exercise.duration && (
                                <p className="text-sm text-gray-600 mt-1">Duration: {exercise.duration}</p>
                              )}
                              {exercise.instructions && (
                                <p className="text-sm text-gray-700 mt-2">{exercise.instructions}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPlan.meal_plan && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Utensils className="h-5 w-5 mr-2 text-blue-600" />
                          Meal Plan ({selectedPlan.meal_plan.total_nutrition?.calories || 'N/A'} kcal)
                        </h3>
                        <div className="space-y-3">
                          {selectedPlan.meal_plan.meals?.map((meal, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900">{meal.name}</h4>
                                  <p className="text-sm text-gray-600 capitalize">{meal.type}</p>
                                </div>
                                <div className="text-right text-sm">
                                  <p className="font-medium">{meal.nutrition?.calories || 'N/A'} kcal</p>
                                  <p className="text-gray-600">{meal.prep_time || 'N/A'} min prep</p>
                                </div>
                              </div>
                              {meal.ingredients && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Ingredients:</p>
                                  <ul className="text-sm text-gray-600 list-disc list-inside">
                                    {meal.ingredients.map((ingredient, idx) => (
                                      <li key={idx}>{ingredient}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {meal.instructions && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Instructions:</p>
                                  <p className="text-sm text-gray-600">{meal.instructions}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedPlan.lifestyle_tips && selectedPlan.lifestyle_tips.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Lifestyle Tips</h3>
                        <div className="space-y-2">
                          {selectedPlan.lifestyle_tips.map((tip, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <p className="text-sm text-gray-700">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Actions */}
                  <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleDownloadPDF(selectedPlan)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleEmailPlan(selectedPlan)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Email Plan
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyPlans;
