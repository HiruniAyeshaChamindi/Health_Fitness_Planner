"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Target } from "lucide-react"
import { coachService } from "../services/coachService"
import ChatWindow from "../components/ChatWindow"

const ActiveCoaching = () => {
  const [activeRequests, setActiveRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActiveCoaching()
  }, [])

  const fetchActiveCoaching = async () => {
    try {
      setLoading(true)
      const data = await coachService.getUserRequests()
      const accepted = data.filter((request) => request.status === "accepted")
      setActiveRequests(accepted)
    } catch (error) {
      console.error("Error fetching active coaching:", error)
    } finally {
      setLoading(false)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Active Coaching Sessions</h1>
          <p className="text-gray-600 mt-2">Communicate with your coaches and track your progress</p>
        </div>

        {activeRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active coaching sessions</h3>
            <p className="text-gray-600">Your accepted coaching requests will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coaches List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Coaches</h2>
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <div
                      key={request._id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedRequest?._id === request._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={request.coachId.profilePic || "/placeholder.svg?height=48&width=48&query=coach"}
                          alt={request.coachId.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{request.coachId.name}</h3>
                          <p className="text-sm text-gray-500">
                            Started {formatDate(request.startDate || request.createdAt)}
                          </p>
                          <div className="flex items-center mt-1">
                            <Target className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs text-gray-600">{request.planType} plan</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat/Content Area */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <div className="bg-white rounded-xl border border-gray-200 h-[600px]">
                  <ChatWindow
                    requestId={selectedRequest._id}
                    coachInfo={selectedRequest.coachId}
                    onClose={() => setSelectedRequest(null)}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center h-[600px] flex items-center justify-center">
                  <div>
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a coach to start chatting</h3>
                    <p className="text-gray-600">Choose a coach from the list to begin your conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActiveCoaching
