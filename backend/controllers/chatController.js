const ChatMessage = require("../models/ChatMessage")
const CoachRequest = require("../models/CoachRequest")

// Get chat messages for a request
exports.getChatMessages = async (req, res) => {
  try {
    const { requestId } = req.params
    const { page = 1, limit = 50 } = req.query

    // Verify user is part of this conversation
    const request = await CoachRequest.findById(requestId).populate("coachId", "userId")

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    const isUserAuthorized =
      request.userId.toString() === req.user.id || request.coachId.userId.toString() === req.user.id

    if (!isUserAuthorized) {
      return res.status(403).json({ message: "Access denied" })
    }

    const messages = await ChatMessage.find({ requestId })
      .populate("fromUserId", "name profilePic")
      .populate("toUserId", "name profilePic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Mark messages as read
    await ChatMessage.updateMany(
      {
        requestId,
        toUserId: req.user.id,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      },
    )

    res.json(messages.reverse())
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { requestId } = req.params
    const { message, messageType = "text", attachments = [] } = req.body

    // Verify user is part of this conversation
    const request = await CoachRequest.findById(requestId).populate("coachId", "userId")

    if (!request || request.status !== "accepted") {
      return res.status(404).json({ message: "Active coaching session not found" })
    }

    const isUser = request.userId.toString() === req.user.id
    const isCoach = request.coachId.userId.toString() === req.user.id

    if (!isUser && !isCoach) {
      return res.status(403).json({ message: "Access denied" })
    }

    const toUserId = isUser ? request.coachId.userId : request.userId

    const chatMessage = new ChatMessage({
      fromUserId: req.user.id,
      toUserId,
      requestId,
      message,
      messageType,
      attachments,
    })

    await chatMessage.save()

    await chatMessage.populate("fromUserId", "name profilePic")
    await chatMessage.populate("toUserId", "name profilePic")

    // Emit to socket if available
    if (req.io) {
      req.io.to(`request_${requestId}`).emit("new_message", chatMessage)
    }

    res.status(201).json(chatMessage)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      toUserId: req.user.id,
      read: false,
    })

    res.json({ unreadCount: count })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
