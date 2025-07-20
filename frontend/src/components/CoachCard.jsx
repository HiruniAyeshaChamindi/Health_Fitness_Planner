"use client"
import { Star, Clock, Award, MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CoachCard = ({ coach }) => {
  const navigate = useNavigate()

  const handleViewProfile = () => {
    navigate(`/coaches/${coach._id}`)
  }

  const handleRequestCoaching = () => {
    navigate(`/coaches/${coach._id}/request`)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={coach.profilePic || "/placeholder.svg?height=64&width=64&query=coach profile"}
            alt={coach.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {coach.verified && (
            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
              <Award className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{coach.name}</h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-900">{coach.rating.toFixed(1)}</span>
              <span className="ml-1 text-sm text-gray-500">({coach.totalReviews})</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Clock className="h-4 w-4 mr-1" />
            <span>{coach.experienceYears} years experience</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{coach.bio}</p>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {coach.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {specialty}
            </span>
          ))}
          {coach.specialties.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{coach.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Languages */}
      {coach.languages && coach.languages.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Languages:</span> {coach.languages.join(", ")}
          </p>
        </div>
      )}

      {/* Pricing */}
      {coach.pricing && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            {coach.pricing.sessionRate && (
              <span className="text-gray-600">
                <span className="font-medium">${coach.pricing.sessionRate}</span>/session
              </span>
            )}
            {coach.pricing.monthlyRate && (
              <span className="text-gray-600">
                <span className="font-medium">${coach.pricing.monthlyRate}</span>/month
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleViewProfile}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          View Profile
        </button>
        <button
          onClick={handleRequestCoaching}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Request Coaching
        </button>
      </div>
    </div>
  )
}

export default CoachCard
