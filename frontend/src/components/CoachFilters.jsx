"use client"
import { Star, Award } from "lucide-react"

const CoachFilters = ({ filters, onFilterChange }) => {
  const specialties = [
    "Weight Loss",
    "Muscle Gain",
    "Yoga",
    "Cardio",
    "Strength Training",
    "Nutrition",
    "Mental Health",
    "Rehabilitation",
  ]

  const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese"]

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFilterChange({
      specialty: "",
      minRating: "",
      language: "",
      verified: false,
      search: filters.search, // Keep search term
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Specialty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Specialty</label>
          <select
            value={filters.specialty}
            onChange={(e) => handleFilterChange("specialty", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Minimum Rating</label>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.minRating === rating.toString()}
                  onChange={(e) => handleFilterChange("minRating", e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm text-gray-700">
                    {rating}+ (
                    {rating === 4.5 ? "Excellent" : rating === 4.0 ? "Very Good" : rating === 3.5 ? "Good" : "Average"})
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
          <select
            value={filters.language}
            onChange={(e) => handleFilterChange("language", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Verified Filter */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => handleFilterChange("verified", e.target.checked)}
              className="mr-3 text-blue-600 focus:ring-blue-500 rounded"
            />
            <div className="flex items-center">
              <Award className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm text-gray-700">Verified Coaches Only</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default CoachFilters
