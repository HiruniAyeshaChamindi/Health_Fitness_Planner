import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { plansAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  Wand2, 
  Target, 
  Clock, 
  Utensils, 
  Dumbbell,
  CheckCircle,
  Download,
  Mail,
  Sparkles
} from 'lucide-react';

const PlanGenerator = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [customPreferences, setCustomPreferences] = useState({});

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const response = await plansAPI.generatePlan({
        planType: 'daily',
        customPreferences
      });
      
      setGeneratedPlan(response.data.plan);
      toast.success('Your personalized plan has been generated!');
    } catch (error) {
      console.error('Error generating plan:', error);
      toast.error('Failed to generate plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedPlan) return;
    
    try {
      const response = await plansAPI.downloadPDF(generatedPlan._id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedPlan.plan_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Plan downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const handleEmailPlan = async () => {
    if (!generatedPlan) return;
    
    try {
      await plansAPI.emailPlan(generatedPlan._id);
      toast.success('Plan sent to your email!');
    } catch (error) {
      console.error('Error emailing plan:', error);
      toast.error('Failed to email plan. Please try again.');
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Wand2 className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AI Plan Generator</h1>
          </div>
          <p className="text-lg text-gray-600">
            Let our AI create a personalized fitness and nutrition plan just for you
          </p>
        </motion.div>

        {!generatedPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* User Profile Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Goal</p>
                    <p className="font-medium capitalize">{user.fitnessGoal?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Dumbbell className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-medium capitalize">{user.fitnessLevel}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Utensils className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Diet</p>
                    <p className="font-medium capitalize">{user.dietaryPreference?.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Workout Duration</p>
                    <p className="font-medium">{user.workoutDuration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Daily Calories</p>
                    <p className="font-medium">{user.dailyCalorieTarget} kcal</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 bg-cyan-600 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-600">Water Target</p>
                    <p className="font-medium">{user.dailyWaterTarget} ml</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Preferences */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Custom Preferences (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Area (Workout)
                  </label>
                  <select
                    value={customPreferences.workoutFocus || ''}
                    onChange={(e) => setCustomPreferences({...customPreferences, workoutFocus: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Default</option>
                    <option value="upper_body">Upper Body</option>
                    <option value="lower_body">Lower Body</option>
                    <option value="core">Core</option>
                    <option value="cardio">Cardio</option>
                    <option value="full_body">Full Body</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Complexity
                  </label>
                  <select
                    value={customPreferences.mealComplexity || ''}
                    onChange={(e) => setCustomPreferences({...customPreferences, mealComplexity: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Default</option>
                    <option value="simple">Simple (15 min prep)</option>
                    <option value="moderate">Moderate (30 min prep)</option>
                    <option value="complex">Complex (45+ min prep)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={customPreferences.specialRequests || ''}
                  onChange={(e) => setCustomPreferences({...customPreferences, specialRequests: e.target.value})}
                  placeholder="Any specific requests or requirements..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-3" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 mr-3" />
                    Generate My AI Plan
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                This usually takes 10-15 seconds
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Success Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Generated Successfully!</h2>
              <p className="text-gray-600">Your personalized plan is ready. Here's what we've created for you:</p>
            </div>

            {/* Plan Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{generatedPlan.plan_name}</h3>
              
              {/* AI Recommendations */}
              {generatedPlan.ai_recommendations && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">AI Recommendations</h4>
                  <p className="text-blue-800 text-sm">{generatedPlan.ai_recommendations}</p>
                </div>
              )}

              {/* Workout Plan Preview */}
              {generatedPlan.workout_plan && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-green-600" />
                    Workout Plan
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-2 font-medium">{generatedPlan.workout_plan.duration} minutes</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 font-medium capitalize">{generatedPlan.workout_plan.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Exercises:</span>
                        <span className="ml-2 font-medium">{generatedPlan.workout_plan.exercises?.length || 0}</span>
                      </div>
                    </div>
                    {generatedPlan.workout_plan.exercises?.slice(0, 3).map((exercise, index) => (
                      <div key={index} className="mt-3 p-3 bg-white rounded border">
                        <p className="font-medium">{exercise.name}</p>
                        {exercise.sets && exercise.reps && (
                          <p className="text-sm text-gray-600">{exercise.sets} sets × {exercise.reps} reps</p>
                        )}
                      </div>
                    ))}
                    {generatedPlan.workout_plan.exercises?.length > 3 && (
                      <p className="text-sm text-gray-500 mt-2">
                        +{generatedPlan.workout_plan.exercises.length - 3} more exercises...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Meal Plan Preview */}
              {generatedPlan.meal_plan && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Utensils className="h-5 w-5 mr-2 text-blue-600" />
                    Meal Plan
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-600">Total Calories:</span>
                        <span className="ml-2 font-medium">{generatedPlan.meal_plan.total_nutrition?.calories || 'N/A'} kcal</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Protein:</span>
                        <span className="ml-2 font-medium">{generatedPlan.meal_plan.total_nutrition?.protein || 'N/A'}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Meals:</span>
                        <span className="ml-2 font-medium">{generatedPlan.meal_plan.meals?.length || 0}</span>
                      </div>
                    </div>
                    {generatedPlan.meal_plan.meals?.map((meal, index) => (
                      <div key={index} className="mt-3 p-3 bg-white rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{meal.name}</p>
                            <p className="text-sm text-gray-600 capitalize">{meal.type}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="font-medium">{meal.nutrition?.calories || 'N/A'} kcal</p>
                            <p className="text-gray-600">{meal.prep_time || 'N/A'} min prep</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lifestyle Tips */}
              {generatedPlan.lifestyle_tips && generatedPlan.lifestyle_tips.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Lifestyle Tips</h4>
                  <div className="space-y-2">
                    {generatedPlan.lifestyle_tips.map((tip, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </button>
              <button
                onClick={handleEmailPlan}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Email Plan
              </button>
              <button
                onClick={() => {
                  setGeneratedPlan(null);
                  setCustomPreferences({});
                }}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Wand2 className="h-5 w-5 mr-2" />
                Generate New Plan
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlanGenerator;
