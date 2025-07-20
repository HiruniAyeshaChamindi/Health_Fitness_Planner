"use client"

import { useState, useEffect } from "react"
import { Award, Users, DollarSign, Clock, Plus, X } from "lucide-react"
import { coachService } from "../services/coachService"
import { useNavigate } from "react-router-dom"

const BecomeCoach = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [existingProfile, setExistingProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: [],
    certifications: [],
    experienceYears: "",
    languages: [],
    availability: [],
    pricing: {
      sessionRate: "",
      monthlyRate: "",
    },
  })

  const specialtyOptions = [
    "Weight Loss",
    "Muscle Gain",
    "Yoga",
    "Cardio",
    "Strength Training",
    "Nutrition",
    "Mental Health",
    "Rehabilitation",
  ]

  const languageOptions = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese"]

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  useEffect(() => {
    // Check if user already has a coach profile
    checkExistingProfile()
  }, [])

  const checkExistingProfile = async () => {
    try {
      // This would be a new API endpoint to get current user's coach profile
      // For now, we'll assume it doesn't exist
    } catch (error) {
      console.error("Error checking existing profile:", error)
    }
  }

  const handleSpecialtyToggle = (specialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const handleLanguageToggle = (language) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }))
  }

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""],
    }))
  }

  const updateCertification = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => (i === index ? value : cert)),
    }))
  }

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const addAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        {
          day: "Monday",
          timeSlots: [{ start: "09:00", end: "17:00" }],
        },
      ],
    }))
  }

  const updateAvailability = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((avail, i) => (i === index ? { ...avail, [field]: value } : avail)),
    }))
  }

  const removeAvailability = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.bio || formData.specialties.length === 0) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)

      const profileData = {
        ...formData,
        experienceYears: Number.parseInt(formData.experienceYears),
        pricing: {
          sessionRate: formData.pricing.sessionRate ? Number.parseFloat(formData.pricing.sessionRate) : null,
          monthlyRate: formData.pricing.monthlyRate ? Number.parseFloat(formData.pricing.monthlyRate) : null,
        },
        certifications: formData.certifications.filter((cert) => cert.trim() !== ""),
      }

      await coachService.createCoachProfile(profileData)

      alert("Coach profile created successfully!")
      navigate("/coach-dashboard")
    } catch (error) {
      console.error("Error creating coach profile:", error)
      alert(error.response?.data?.message || "Failed to create coach profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Become a Fitness Coach</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your expertise and help others achieve their fitness goals. Create your coach profile and start
            connecting with clients.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Connect with Clients</h3>
            <p className="text-sm text-gray-600">Build meaningful relationships with people on their fitness journey</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Earn Income</h3>
            <p className="text-sm text-gray-600">Set your own rates and build a sustainable coaching business</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Flexible Schedule</h3>
            <p className="text-sm text-gray-600">Work on your own terms with flexible scheduling options</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experienceYears: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell potential clients about your background, experience, and coaching philosophy..."
                  required
                />
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Specialties *</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {specialtyOptions.map((specialty) => (
                  <label
                    key={specialty}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.specialties.includes(specialty)
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Certifications</h2>
              <div className="space-y-3">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => updateCertification(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., NASM Certified Personal Trainer"
                    />
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCertification}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Certification
                </button>
              </div>
            </div>

            {/* Languages */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Languages</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languageOptions.map((language) => (
                  <label
                    key={language}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.languages.includes(language)
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(language)}
                      onChange={() => handleLanguageToggle(language)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{language}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Rate (USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing.sessionRate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricing: { ...prev.pricing, sessionRate: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rate (USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing.monthlyRate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricing: { ...prev.pricing, monthlyRate: e.target.value },
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="200.00"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Create Coach Profile
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

export default BecomeCoach
