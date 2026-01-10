export const mockConversations = [
  {
    id: "conv1",
    participants: ["1", "2"],
    lastMessage: {
      content: "Hey! How's the project going?",
      senderId: "2",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
    },
    unreadCount: 2,
  },
  {
    id: "conv2",
    participants: ["1", "3"],
    lastMessage: {
      content: "See you at the gym tomorrow!",
      senderId: "1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv3",
    participants: ["1", "4"],
    lastMessage: {
      content: "That book recommendation was amazing, thank you!",
      senderId: "4",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: "conv4",
    participants: ["1", "5"],
    lastMessage: {
      content: "Can't wait to hear the new track! 🎵",
      senderId: "1",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: true,
    },
    unreadCount: 0,
  },
]

export const mockMessages = [
  {
    id: "m1",
    conversationId: "conv1",
    senderId: "2",
    content: "Hey John! How are you?",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    read: true,
  },
  {
    id: "m2",
    conversationId: "conv1",
    senderId: "1",
    content: "Hey Jane! I'm doing great, thanks for asking! How about you?",
    timestamp: new Date(Date.now() - 540000).toISOString(),
    read: true,
  },
  {
    id: "m3",
    conversationId: "conv1",
    senderId: "2",
    content: "Pretty good! Just finished a big design project.",
    timestamp: new Date(Date.now() - 480000).toISOString(),
    read: true,
  },
  {
    id: "m4",
    conversationId: "conv1",
    senderId: "2",
    content: "Hey! How's the project going?",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    read: false,
  },
]
