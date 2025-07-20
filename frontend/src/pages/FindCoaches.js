"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CoachCard from "../components/CoachCard"
import CoachFilters from "../components/CoachFilters"
import RequestCoachingModal from "../components/RequestCoachingModal"
import { coachService } from "../services/coachService"
import { Loader2 } from "lucide-react"

const FindCoaches = () => {
  const navigate = useNavigate()
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  })

  useEffect(() => {
    loadCoaches()
  }, [filters])

  const loadCoaches = async (page = 1) => {
    setLoading(true)
    try {
      const response = await coachService.getCoaches({
        ...filters,
        page,
      })

      setCoaches(response.coaches)
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
      })
    } catch (error) {
      console.error("Error loading coaches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = (coachId) => {
    navigate(`/coaches/${coachId}`)
  }

  const handleRequestCoaching = (coach) => {
    setSelectedCoach(coach)
    setShowRequestModal(true)
  }

  const handleSubmitRequest = async (requestData) => {
    try {
      await coachService.createRequest(requestData)
      alert("Request sent successfully! The coach will respond soon.")
    } catch (error) {
      console.error("Error sending request:", error)
      alert("Error sending request. Please try again.")
    }
  }

  const handleSearch = () => {
    loadCoaches(1)
  }

  const handlePageChange = (page) => {
    loadCoaches(page)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Coach</h1>
          <p className="text-gray-600">Connect with certified fitness and wellness coaches to achieve your goals</p>
        </div>

        {/* Filters */}
        <CoachFilters filters={filters} onFiltersChange={setFilters} onSearch={handleSearch} />

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">{pagination.total} coaches found</p>
            </div>

            {/* Coach Grid */}
            {coaches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No coaches found matching your criteria</p>
                <button onClick={() => setFilters({})} className="text-blue-600 hover:text-blue-700 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {coaches.map((coach) => (
                  <CoachCard
                    key={coach._id}
                    coach={coach}
                    onViewProfile={handleViewProfile}
                    onRequestCoaching={handleRequestCoaching}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm rounded-lg ${
                      page === pagination.currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Request Modal */}
        {selectedCoach && (
          <RequestCoachingModal
            coach={selectedCoach}
            isOpen={showRequestModal}
            onClose={() => {
              setShowRequestModal(false)
              setSelectedCoach(null)
            }}
            onSubmit={handleSubmitRequest}
          />
        )}
      </div>
    </div>
  )
}

export default FindCoaches


