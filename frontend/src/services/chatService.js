import api from "./api"
import io from "socket.io-client"

class ChatService {
  constructor() {
    this.socket = null
  }

  // Initialize socket connection
  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000")
    }
    return this.socket
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Join request room
  joinRequest(requestId) {
    if (this.socket) {
      this.socket.emit("join_request", requestId)
    }
  }

  // Leave request room
  leaveRequest(requestId) {
    if (this.socket) {
      this.socket.emit("leave_request", requestId)
    }
  }

  // Send typing indicator
  sendTyping(requestId, userId, isTyping) {
    if (this.socket) {
      this.socket.emit("typing", { requestId, userId, isTyping })
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback)
    }
  }

  // Listen for typing indicators
  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on("user_typing", callback)
    }
  }

  // API calls
  async getChatMessages(requestId, page = 1) {
    const response = await api.get(`/chat/${requestId}/messages?page=${page}`)
    return response.data
  }

  async sendMessage(requestId, messageData) {
    const response = await api.post(`/chat/${requestId}/messages`, messageData)
    return response.data
  }

  async getUnreadCount() {
    const response = await api.get("/chat/unread-count")
    return response.data
  }
}

export const chatService = new ChatService()
