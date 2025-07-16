import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { progressAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Activity,
  Scale,
  Ruler,
  Droplets,
  Timer,
  Plus,
  Edit3,
  Save,
  X
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Progress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  
  const [newEntry, setNewEntry] = useState({
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    water_intake: '',
    workout_duration: '',
    calories_consumed: '',
    notes: ''
  });

  useEffect(() => {
    fetchProgressData();
  }, [selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      const response = await progressAPI.getUserProgress(selectedPeriod);
      setProgressData(response.data.progress || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    try {
      const entryData = Object.fromEntries(
        Object.entries(newEntry).filter(([_, value]) => value !== '')
      );
      
      const response = await progressAPI.addProgress(entryData);
      setProgressData([response.data.progress, ...progressData]);
      setNewEntry({
        weight: '',
        body_fat_percentage: '',
        muscle_mass: '',
        water_intake: '',
        workout_duration: '',
        calories_consumed: '',
        notes: ''
      });
      setShowAddForm(false);
      toast.success('Progress entry added successfully!');
    } catch (error) {
      console.error('Error adding progress:', error);
      toast.error('Failed to add progress entry');
    }
  };

  const handleUpdateEntry = async (entryId, updatedData) => {
    try {
      const response = await progressAPI.updateProgress(entryId, updatedData);
      setProgressData(progressData.map(entry => 
        entry._id === entryId ? response.data.progress : entry
      ));
      setEditingEntry(null);
      toast.success('Progress entry updated successfully!');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress entry');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await progressAPI.deleteProgress(entryId);
      setProgressData(progressData.filter(entry => entry._id !== entryId));
      toast.success('Progress entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting progress:', error);
      toast.error('Failed to delete progress entry');
    }
  };

  const getChartData = () => {
    return progressData
      .slice(-30)
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: entry.weight || null,
        body_fat: entry.body_fat_percentage || null,
        muscle_mass: entry.muscle_mass || null,
        water_intake: entry.water_intake || null,
        workout_duration: entry.workout_duration || null,
        calories: entry.calories_consumed || null
      }));
  };

  const getStatsCards = () => {
    if (progressData.length === 0) return null;

    const latest = progressData[0];
    const previous = progressData[1];
    
    return [
      {
        label: 'Current Weight',
        value: latest.weight ? `${latest.weight} kg` : 'N/A',
        change: previous?.weight ? (latest.weight - previous.weight).toFixed(1) : null,
        icon: Scale,
        color: 'blue'
      },
      {
        label: 'Body Fat %',
        value: latest.body_fat_percentage ? `${latest.body_fat_percentage}%` : 'N/A',
        change: previous?.body_fat_percentage ? (latest.body_fat_percentage - previous.body_fat_percentage).toFixed(1) : null,
        icon: Target,
        color: 'red'
      },
      {
        label: 'Muscle Mass',
        value: latest.muscle_mass ? `${latest.muscle_mass} kg` : 'N/A',
        change: previous?.muscle_mass ? (latest.muscle_mass - previous.muscle_mass).toFixed(1) : null,
        icon: Activity,
        color: 'green'
      },
      {
        label: 'Water Intake',
        value: latest.water_intake ? `${latest.water_intake} ml` : 'N/A',
        change: previous?.water_intake ? (latest.water_intake - previous.water_intake) : null,
        icon: Droplets,
        color: 'cyan'
      }
    ];
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

  const chartData = getChartData();
  const statsCards = getStatsCards();

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
              <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
              <p className="mt-2 text-gray-600">
                Monitor your fitness journey and track your achievements
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Entry
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {statsCards && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      {stat.change && (
                        <p className={`text-sm ${
                          stat.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change > 0 ? '+' : ''}{stat.change}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Charts */}
        {progressData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Weight Progress Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Body Composition Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Body Composition</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="body_fat" stroke="#EF4444" strokeWidth={2} name="Body Fat %" />
                  <Line type="monotone" dataKey="muscle_mass" stroke="#10B981" strokeWidth={2} name="Muscle Mass" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Water Intake Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Water Intake</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="water_intake" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Workout Duration Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workout Duration</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workout_duration" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Progress Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
          </div>

          {progressData.length === 0 ? (
            <div className="p-8 text-center">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No progress data yet</h3>
              <p className="text-gray-600 mb-6">Start tracking your progress to see insights and trends</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Entry
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {progressData.map((entry, index) => (
                <div key={entry._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{formatDate(entry.date)}</p>
                      </div>
                      {entry.weight && (
                        <div>
                          <p className="text-sm text-gray-600">Weight</p>
                          <p className="font-medium">{entry.weight} kg</p>
                        </div>
                      )}
                      {entry.body_fat_percentage && (
                        <div>
                          <p className="text-sm text-gray-600">Body Fat</p>
                          <p className="font-medium">{entry.body_fat_percentage}%</p>
                        </div>
                      )}
                      {entry.muscle_mass && (
                        <div>
                          <p className="text-sm text-gray-600">Muscle Mass</p>
                          <p className="font-medium">{entry.muscle_mass} kg</p>
                        </div>
                      )}
                      {entry.water_intake && (
                        <div>
                          <p className="text-sm text-gray-600">Water Intake</p>
                          <p className="font-medium">{entry.water_intake} ml</p>
                        </div>
                      )}
                      {entry.workout_duration && (
                        <div>
                          <p className="text-sm text-gray-600">Workout</p>
                          <p className="font-medium">{entry.workout_duration} min</p>
                        </div>
                      )}
                      {entry.calories_consumed && (
                        <div>
                          <p className="text-sm text-gray-600">Calories</p>
                          <p className="font-medium">{entry.calories_consumed} kcal</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add Entry Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add Progress Entry</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.weight}
                      onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body Fat (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.body_fat_percentage}
                      onChange={(e) => setNewEntry({...newEntry, body_fat_percentage: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Muscle Mass (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newEntry.muscle_mass}
                      onChange={(e) => setNewEntry({...newEntry, muscle_mass: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water Intake (ml)
                    </label>
                    <input
                      type="number"
                      value={newEntry.water_intake}
                      onChange={(e) => setNewEntry({...newEntry, water_intake: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workout Duration (min)
                    </label>
                    <input
                      type="number"
                      value={newEntry.workout_duration}
                      onChange={(e) => setNewEntry({...newEntry, workout_duration: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories Consumed
                    </label>
                    <input
                      type="number"
                      value={newEntry.calories_consumed}
                      onChange={(e) => setNewEntry({...newEntry, calories_consumed: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    rows="3"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Any additional notes about your progress..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEntry}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Add Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
