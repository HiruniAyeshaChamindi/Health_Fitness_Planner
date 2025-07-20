"use client"

import { useState } from "react"
import { X, Calendar, Clock, DollarSign } from "lucide-react"

const RequestCoachingModal = ({ coach, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    message: "",
    planType: "session",
    sessionDate: "",
    startDate: "",
    endDate: "",
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        coachId: coach._id,
        ...formData,
      })
      onClose()
      setFormData({
        message: "",
        planType: "session",
        sessionDate: "",
        startDate: "",
        endDate: "",
      })
    } catch (error) {
      console.error("Error submitting request:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriceDisplay = () => {
    if (formData.planType === "session") {
      return coach.pricing.sessionRate > 0 ? `$${coach.pricing.sessionRate}` : "Free"
    } else {
      return coach.pricing.monthlyRate > 0 ? `$${coach.pricing.monthlyRate}/month` : "Free"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Request Coaching from {coach.name}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Coach Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img
                src={coach.profilePic || "/placeholder.svg?height=60&width=60&query=coach"}
                alt={coach.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{coach.name}</h3>
                <p className="text-sm text-gray-600">{coach.specialties.slice(0, 2).join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Plan Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Your Plan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.planType === "session"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setFormData({ ...formData, planType: "session" })}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="planType"
                      value="session"
                      checked={formData.planType === "session"}
                      onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                      className="mr-3"
                    />
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium">Single Session</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {coach.pricing.sessionRate > 0 ? `$${coach.pricing.sessionRate}` : "Free"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-8">One-time coaching session</p>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.planType === "monthly"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setFormData({ ...formData, planType: "monthly" })}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="planType"
                      value="monthly"
                      checked={formData.planType === "monthly"}
                      onChange={(e) => setFormData({ ...formData, planType: e.target.value })}
                      className="mr-3"
                    />
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium">Monthly Plan</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {coach.pricing.monthlyRate > 0 ? `$${coach.pricing.monthlyRate}/mo` : "Free"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-8">Ongoing coaching relationship</p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          {formData.planType === "session" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Session Date</label>
              <input
                type="datetime-local"
                value={formData.sessionDate}
                onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message to Coach</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="4"
              placeholder="Tell the coach about your goals, experience level, and what you're looking for..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">Total Cost</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{getPriceDisplay()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? "Sending Request..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestCoachingModal
