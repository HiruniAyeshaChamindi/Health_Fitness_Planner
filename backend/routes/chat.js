const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const { getChatMessages, sendMessage, getUnreadCount } = require("../controllers/chatController")

router.get("/unread-count", auth, getUnreadCount)
router.get("/:requestId/messages", auth, getChatMessages)
router.post("/:requestId/messages", auth, sendMessage)

module.exports = router
