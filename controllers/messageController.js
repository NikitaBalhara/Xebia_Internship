// Mock data for presentation
const mockMessages = [
  {
    _id: "msg1",
    senderId: "recruiter_1",
    receiverId: "mock_user_123",
    content: "Hi! We reviewed your profile and would like to schedule an interview.",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    _id: "msg2",
    senderId: "mock_user_123",
    receiverId: "recruiter_1",
    content: "Thank you! I would love to discuss the opportunity further.",
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    _id: "msg3",
    senderId: "recruiter_2",
    receiverId: "mock_user_123",
    content: "Your resume looks great! Are you available for a quick call this week?",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  }
];

const mockContacts = [
  {
    _id: "recruiter_1",
    name: "Priya Sharma",
    email: "priya@technova.com",
    role: "recruiter",
    latestMessage: "Hi! We reviewed your profile and would like to schedule an interview.",
    latestMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    unreadCount: 1
  },
  {
    _id: "recruiter_2",
    name: "Rahul Mehta",
    email: "rahul@startupx.com",
    role: "recruiter",
    latestMessage: "Your resume looks great! Are you available for a quick call?",
    latestMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 1
  }
];

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const newMessage = {
      _id: `msg_${Date.now()}`,
      senderId: "mock_user_123",
      receiverId: req.params.userId || "recruiter_1",
      content: content,
      isRead: false,
      createdAt: new Date()
    };
    return res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const filtered = mockMessages.filter(
      msg =>
        (msg.senderId === "mock_user_123" && msg.receiverId === req.params.userId) ||
        (msg.senderId === req.params.userId && msg.receiverId === "mock_user_123")
    );
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get messages" });
  }
};

exports.getInboxUsers = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: mockContacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get inbox" });
  }
};