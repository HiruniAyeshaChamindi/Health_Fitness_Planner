"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send, Target, Calendar, Clock, AlertCircle } from "lucide-react"
import { coachService } from "../services/coachService"
import { useAuth } from "../contexts/AuthContext"

const CoachingRequest = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [coach, setCoach] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    message: "",
    goals: [],
    preferredSchedule: "",
    planType: "monthly",
  })

  const goalOptions = [
    "Weight Loss",
    "Muscle Gain",
    "Improve Fitness",
    "Build Strength",
    "Increase Flexibility",
    "Better Nutrition",
    "Stress Management",
    "Injury Recovery",
    "Sports Performance",
    "General Wellness",
  ]

  const planTypes = [
    { value: "session", label: "Single Session", description: "One-time coaching session" },
    { value: "weekly", label: "Weekly Plan", description: "Weekly coaching and check-ins" },
    { value: "monthly", label: "Monthly Plan", description: "Comprehensive monthly coaching" },
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    fetchCoachProfile()
  }, [id, isAuthenticated])

  const fetchCoachProfile = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await coachService.getCoachProfile(id)
      setCoach(response.coach)
    } catch (error) {
      console.error("Error fetching coach profile:", error)
      setError("Failed to load coach profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoalToggle = (goal) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const validateForm = () => {
    if (!formData.message.trim()) {
      setError("Please write a message to the coach")
      return false
    }
    if (formData.goals.length === 0) {
      setError("Please select at least one goal")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)

      const requestData = {
        coachId: id,
        message: formData.message.trim(),
        goals: formData.goals,
        preferredSchedule: formData.preferredSchedule,
        planType: formData.planType,
      }

      console.log("Sending request data:", requestData) // Debug log

      await coachService.requestCoaching(requestData)

      // Show success message and redirect
      alert("Coaching request sent successfully! The coach will respond soon.")
      navigate("/dashboard/requests")
    } catch (error) {
      console.error("Error sending request:", error)

      // Handle different error types
      if (error.response?.status === 401) {
        setError("Please log in to send a coaching request")
        navigate("/login")
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || "Invalid request data")
      } else if (error.response?.status === 404) {
        setError("Coach not found")
      } else {
        setError("Failed to send request. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to request coaching</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coach not found</h2>
          <button onClick={() => navigate("/coaches")} className="text-blue-600 hover:text-blue-700">
            Back to coaches
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate(`/coaches/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to profile
        </button>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Coach Info Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <img
                src={coach.profilePic || "/placeholder.svg?height=64&width=64&query=coach"}
                alt={coach.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold">{coach.name}</h1>
                <p className="text-blue-100">
                  {coach.experienceYears} years experience • {coach.specialties.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Plan Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Calendar className="h-5 w-5 inline mr-2" />
                Choose Your Plan
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planTypes.map((plan) => (
                  <label
                    key={plan.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.planType === plan.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="planType"
                      value={plan.value}
                      checked={formData.planType === plan.value}
                      onChange={(e) => setFormData((prev) => ({ ...prev, planType: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-1">{plan.label}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                      {coach.pricing && (
                        <p className="text-lg font-bold text-blue-600 mt-2">
                          ${plan.value === "session" ? coach.pricing.sessionRate : coach.pricing.monthlyRate}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Goals Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Target className="h-5 w-5 inline mr-2" />
                Your Goals *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {goalOptions.map((goal) => (
                  <label
                    key={goal}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.goals.includes(goal)
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{goal}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Select all that apply</p>
            </div>

            {/* Preferred Schedule */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Clock className="h-5 w-5 inline mr-2" />
                Preferred Schedule
              </label>
              <textarea
                value={formData.preferredSchedule}
                onChange={(e) => setFormData((prev) => ({ ...prev, preferredSchedule: e.target.value }))}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Let your coach know your preferred days and times (e.g., 'Weekday evenings after 6 PM' or 'Weekend mornings')"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Send className="h-5 w-5 inline mr-2" />
                Message to Coach *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                rows="6"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell your coach about yourself, your current fitness level, any injuries or limitations, and what you hope to achieve together..."
                required
              />
              <p className="text-sm text-gray-500 mt-2">Be specific about your current situation and expectations</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/coaches/${id}`)}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CoachingRequest
