import io from "socket.io-client"

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect(token) {
    if (this.socket) {
      this.disconnect()
    }

    this.socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", {
      auth: {
        token,
      },
    })

    this.socket.on("connect", () => {
      console.log("Connected to server")
      this.isConnected = true
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server")
      this.isConnected = false
    })

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Chat methods
  joinChat(requestId) {
    if (this.socket) {
      this.socket.emit("join_chat", requestId)
    }
  }

  leaveChat(requestId) {
    if (this.socket) {
      this.socket.emit("leave_chat", requestId)
    }
  }

  sendTypingStart(requestId) {
    if (this.socket) {
      this.socket.emit("typing_start", { requestId })
    }
  }

  sendTypingStop(requestId) {
    if (this.socket) {
      this.socket.emit("typing_stop", { requestId })
    }
  }

  markMessageAsRead(messageId, requestId) {
    if (this.socket) {
      this.socket.emit("message_read", { messageId, requestId })
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback)
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on("user_typing", callback)
    }
  }

  onMessageReadReceipt(callback) {
    if (this.socket) {
      this.socket.on("message_read_receipt", callback)
    }
  }

  // Remove listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners()
    }
  }
}

export default new SocketService()
