"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, Calendar, TrendingUp, Star, Plus } from "lucide-react"
import { coachService } from "../services/coachService"
import ChatWindow from "../components/ChatWindow"

const CoachDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [clients, setClients] = useState([])
  const [requests, setRequests] = useState([])
  const [plans, setPlans] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClients: 0,
    pendingRequests: 0,
    activePlans: 0,
    rating: 0,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [clientsRes, requestsRes, plansRes] = await Promise.all([
        coachService.getCoachClients(),
        coachService.getCoachRequests(),
        coachService.getCoachPlans(),
      ])

      setClients(clientsRes.clients)
      setRequests(requestsRes.requests)
      setPlans(plansRes.plans)

      // Calculate stats
      setStats({
        totalClients: clientsRes.clients.length,
        pendingRequests: requestsRes.requests.filter((r) => r.status === "pending").length,
        activePlans: plansRes.plans.filter((p) => p.status === "active").length,
        rating: 4.8, // This would come from coach profile
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAction = async (requestId, status, notes = "") => {
    try {
      await coachService.updateRequestStatus(requestId, status, notes)
      loadDashboardData() // Reload data
    } catch (error) {
      console.error("Error updating request:", error)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "clients", label: "Clients", icon: Users },
              { id: "requests", label: "Requests", icon: MessageSquare },
              { id: "plans", label: "Plans", icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.id === "requests" && stats.pendingRequests > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                    {stats.pendingRequests}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Clients" value={stats.totalClients} icon={Users} color="blue" />
              <StatCard title="Pending Requests" value={stats.pendingRequests} icon={MessageSquare} color="yellow" />
              <StatCard title="Active Plans" value={stats.activePlans} icon={Calendar} color="green" />
              <StatCard title="Rating" value={stats.rating} icon={Star} color="purple" />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.userId.profilePic || "/placeholder.svg?height=40&width=40&query=user"}
                        alt={request.userId.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {request.userId.name} sent a coaching request
                        </p>
                        <p className="text-xs text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : request.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Your Clients</h2>
            </div>

            {clients.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                <p className="text-gray-600">Accept coaching requests to start building your client base</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div key={client._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={client.userId.profilePic || "/placeholder.svg?height=50&width=50&query=user"}
                        alt={client.userId.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{client.userId.name}</h3>
                        <p className="text-sm text-gray-600">{client.planType} plan</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        Started: {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                      {client.endDate && (
                        <p className="text-sm text-gray-600">Ends: {new Date(client.endDate).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedChat(client)}
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Chat
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        View Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Coaching Requests</h2>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                <p className="text-gray-600">Requests from potential clients will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={request.userId.profilePic || "/placeholder.svg?height=50&width=50&query=user"}
                          alt={request.userId.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{request.userId.name}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : request.status === "accepted"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {request.planType === "session" ? "Single Session" : "Monthly Plan"} • ${request.price}
                          </p>
                          <p className="text-sm text-gray-700 mb-3">{request.message}</p>
                          <p className="text-xs text-gray-500">
                            Requested on {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRequestAction(request._id, "rejected")}
                            className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleRequestAction(request._id, "accepted")}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Client Plans</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create New Plan
              </button>
            </div>

            {plans.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plans created yet</h3>
                <p className="text-gray-600">Create personalized workout and meal plans for your clients</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div key={plan._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{plan.title}</h3>
                        <p className="text-sm text-gray-600">{plan.userId.name}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          plan.status === "active"
                            ? "bg-green-100 text-green-700"
                            : plan.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{plan.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                      <span>→</span>
                      <span>{new Date(plan.endDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        Edit Plan
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh]">
            <ChatWindow
              coachRequest={selectedChat}
              currentUser={{ id: "current-coach-id" }} // This should come from auth context
              onClose={() => setSelectedChat(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CoachDashboard
