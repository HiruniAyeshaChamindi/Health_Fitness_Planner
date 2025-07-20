import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Scale, Ruler } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onChange' }); // Validate on change for immediate feedback

  const onSubmit = async (data) => {
    // Only submit on the final step
    if (currentStep < 3) {
      nextStep();
      return;
    }

    // Validate required fields
    const requiredFields = [
      'name', 'email', 'password', 'age', 'weight', 'height',
      'gender', 'activityLevel', 'fitnessGoal', 'fitnessLevel', 'dietaryPreference'
    ];
    const missingFields = requiredFields.filter(field => !data[field] || data[field] === '');

    if (missingFields.length > 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        toast.success('Welcome to FitGenie!');
        navigate('/dashboard');
      } else {
        toast.error(result.message); // Display specific backend validation errors
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join FitGenie Today
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center">
          <div className="flex space-x-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                      maxLength: { value: 50, message: 'Name must be less than 50 characters' }
                    })}
                    type="text"
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    {...register('age', { 
                      required: 'Age is required',
                      valueAsNumber: true,
                      min: { value: 10, message: 'Age must be at least 10' },
                      max: { value: 100, message: 'Age must be less than 100' }
                    })}
                    type="number"
                    className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="25"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    {...register('gender', { required: 'Gender is required' })}
                    className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Scale className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('weight', { 
                        required: 'Weight is required',
                        valueAsNumber: true,
                        min: { value: 30, message: 'Weight must be at least 30 kg' },
                        max: { value: 300, message: 'Weight must be less than 300 kg' }
                      })}
                      type="number"
                      step="0.1"
                      className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="70"
                    />
                  </div>
                  {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Ruler className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('height', { 
                        required: 'Height is required',
                        valueAsNumber: true,
                        min: { value: 100, message: 'Height must be at least 100 cm' },
                        max: { value: 250, message: 'Height must be less than 250 cm' }
                      })}
                      type="number"
                      className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="170"
                    />
                  </div>
                  {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Activity Level</label>
                <select
                  {...register('activityLevel', { required: 'Activity level is required' })}
                  className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                  <option value="active">Active (hard exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (very hard exercise/physical job)</option>
                </select>
                {errors.activityLevel && <p className="mt-1 text-sm text-red-600">{errors.activityLevel.message}</p>}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Fitness Goals & Preferences</h3>
              
              {/* Fitness Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Fitness Goal</label>
                <select
                  {...register('fitnessGoal', { required: 'Fitness goal is required' })}
                  className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select your primary goal</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Improve Endurance</option>
                  <option value="flexibility">Increase Flexibility</option>
                  <option value="maintenance">Maintain Current Fitness</option>
                </select>
                {errors.fitnessGoal && <p className="mt-1 text-sm text-red-600">{errors.fitnessGoal.message}</p>}
              </div>

              {/* Fitness Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Fitness Level</label>
                <select
                  {...register('fitnessLevel', { required: 'Fitness level is required' })}
                  className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select your fitness level</option>
                  <option value="beginner">Beginner (new to exercise)</option>
                  <option value="intermediate">Intermediate (some experience)</option>
                  <option value="advanced">Advanced (very experienced)</option>
                </select>
                {errors.fitnessLevel && <p className="mt-1 text-sm text-red-600">{errors.fitnessLevel.message}</p>}
              </div>

              {/* Dietary Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Dietary Preference</label>
                <select
                  {...register('dietaryPreference', { required: 'Dietary preference is required' })}
                  className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select dietary preference</option>
                  <option value="balanced">Balanced Diet</option>
                  <option value="keto">Ketogenic</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="paleo">Paleo</option>
                  <option value="low_carb">Low Carb</option>
                  <option value="mediterranean">Mediterranean</option>
                </select>
                {errors.dietaryPreference && <p className="mt-1 text-sm text-red-600">{errors.dietaryPreference.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Workout Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Workout Days per Week</label>
                  <select
                    {...register('workoutDaysPerWeek', { valueAsNumber: true })}
                    className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select workout days</option>
                    <option value={3}>3 days</option>
                    <option value={4}>4 days</option>
                    <option value={5}>5 days</option>
                    <option value={6}>6 days</option>
                    <option value={7}>7 days</option>
                  </select>
                </div>

                {/* Workout Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Workout Duration (minutes)</label>
                  <select
                    {...register('workoutDuration', { valueAsNumber: true })}
                    className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select duration</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || Object.keys(errors).length > 0}
                className="ml-auto inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
