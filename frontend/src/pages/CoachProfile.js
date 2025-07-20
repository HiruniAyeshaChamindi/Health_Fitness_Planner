"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, Award, Clock, Calendar, MessageCircle, ArrowLeft, CheckCircle, Globe, DollarSign } from "lucide-react"
import { coachService } from "../services/coachService"
import ReviewsList from "../components/ReviewsList"

const CoachProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [coach, setCoach] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    fetchCoachProfile()
  }, [id])

  const fetchCoachProfile = async () => {
    try {
      setLoading(true)
      const response = await coachService.getCoachProfile(id)
      setCoach(response.coach)
      setReviews(response.reviews)
    } catch (error) {
      console.error("Error fetching coach profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestCoaching = () => {
    navigate(`/coaches/${id}/request`)
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate("/coaches")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to coaches
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            {/* Profile Picture */}
            <div className="relative mb-4 md:mb-0">
              <img
                src={coach.profilePic || "/placeholder.svg?height=120&width=120&query=coach profile"}
                alt={coach.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
              {coach.verified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                  <Award className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{coach.name}</h1>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-4">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-lg font-semibold text-gray-900">{coach.rating.toFixed(1)}</span>
                      <span className="ml-1 text-gray-600">({coach.totalReviews} reviews)</span>
                    </div>
                    {coach.verified && (
                      <div className="flex items-center text-blue-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{coach.experienceYears} years of experience</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={handleRequestCoaching}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Request Coaching
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "about", label: "About" },
              { id: "specialties", label: "Specialties" },
              { id: "availability", label: "Availability" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "about" && (
          <div className="space-y-8">
            {/* Bio */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
            </div>

            {/* Certifications */}
            {coach.certifications && coach.certifications.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {coach.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Award className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-gray-900">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {coach.languages && coach.languages.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.languages.map((language, index) => (
                    <div key={index} className="flex items-center px-3 py-2 bg-blue-50 rounded-lg">
                      <Globe className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-blue-900">{language}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            {coach.pricing && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coach.pricing.sessionRate && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                        <div>
                          <p className="font-semibold text-gray-900">${coach.pricing.sessionRate} per session</p>
                          <p className="text-sm text-gray-600">One-time session</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {coach.pricing.monthlyRate && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                        <div>
                          <p className="font-semibold text-gray-900">${coach.pricing.monthlyRate} per month</p>
                          <p className="text-sm text-gray-600">Monthly coaching</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "specialties" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Specialties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coach.specialties.map((specialty, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">{specialty}</h4>
                  <p className="text-sm text-blue-700">
                    Specialized training and guidance in {specialty.toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "availability" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Availability</h3>
            {coach.availability && coach.availability.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coach.availability.map((slot, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">{slot.day}</h4>
                    {slot.timeSlots && slot.timeSlots.length > 0 ? (
                      <div className="space-y-1">
                        {slot.timeSlots.map((time, timeIndex) => (
                          <p key={timeIndex} className="text-sm text-green-700">
                            {time.start} - {time.end}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-green-700">Available all day</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Availability information not provided</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && <ReviewsList reviews={reviews} />}
      </div>
    </div>
  )
}

export default CoachProfile
