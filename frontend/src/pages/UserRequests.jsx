"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, XCircle, MessageCircle, Calendar } from "lucide-react"
import { coachService } from "../services/coachService"
import { useNavigate } from "react-router-dom"

const UserRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await coachService.getUserRequests()
      setRequests(data)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Coaching Requests</h1>
          <p className="text-gray-600 mt-2">Track your coaching requests and connect with coaches</p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coaching requests yet</h3>
            <p className="text-gray-600 mb-6">Start your fitness journey by connecting with a coach</p>
            <button
              onClick={() => navigate("/coaches")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Find Coaches
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={request.coachId.profilePic || "/placeholder.svg?height=60&width=60&query=coach"}
                      alt={request.coachId.name}
                      className="w-15 h-15 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.coachId.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600">Rating: {request.coachId.rating}/5</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Requested on {formatDate(request.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(request.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Your Goals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {request.goals.map((goal, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Plan Type:</h4>
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-lg">
                    <Calendar className="h-4 w-4 mr-1" />
                    {request.planType.charAt(0).toUpperCase() + request.planType.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Your Message:</h4>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{request.message}</p>
                </div>

                {request.responseMessage && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Coach Response:</h4>
                    <p className="text-gray-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      {request.responseMessage}
                    </p>
                  </div>
                )}

                {request.status === "accepted" && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/dashboard/coaching?request=${request._id}`)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Coaching
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserRequests
