import api from "./api"

export const coachService = {
  // Get all coaches with filters
  getCoaches: async (filters = {}) => {
    try {
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.append(key, value)
        }
      })

      const response = await api.get(`/coaches?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error("Error in getCoaches:", error)
      throw error
    }
  },

  // Get single coach profile
  getCoachProfile: async (coachId) => {
    try {
      const response = await api.get(`/coaches/${coachId}`)
      return response.data
    } catch (error) {
      console.error("Error in getCoachProfile:", error)
      throw error
    }
  },

  // Create coach profile
  createCoachProfile: async (profileData) => {
    try {
      const response = await api.post("/coaches/profile", profileData)
      return response.data
    } catch (error) {
      console.error("Error in createCoachProfile:", error)
      throw error
    }
  },

  // Update coach profile
  updateCoachProfile: async (profileData) => {
    try {
      const response = await api.put("/coaches/profile", profileData)
      return response.data
    } catch (error) {
      console.error("Error in updateCoachProfile:", error)
      throw error
    }
  },

  // Request coaching
  requestCoaching: async (requestData) => {
    try {
      console.log("Sending coaching request:", requestData) // Debug log
      const response = await api.post("/coaches/request", requestData)
      return response.data
    } catch (error) {
      console.error("Error in requestCoaching:", error)
      console.error("Error response:", error.response?.data) // Debug log
      throw error
    }
  },

  // Get user's coaching requests
  getUserRequests: async () => {
    try {
      const response = await api.get("/coaches/requests/my")
      return response.data
    } catch (error) {
      console.error("Error in getUserRequests:", error)
      throw error
    }
  },

  // Get incoming requests (for coaches)
  getCoachRequests: async () => {
    try {
      const response = await api.get("/coaches/requests/incoming")
      return response.data
    } catch (error) {
      console.error("Error in getCoachRequests:", error)
      throw error
    }
  },

  // Respond to coaching request
  respondToRequest: async (requestId, responseData) => {
    try {
      const response = await api.put(`/coaches/requests/${requestId}/respond`, responseData)
      return response.data
    } catch (error) {
      console.error("Error in respondToRequest:", error)
      throw error
    }
  },
}
