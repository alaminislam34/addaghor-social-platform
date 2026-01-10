export const mockNotifications = [
  {
    id: "notif1",
    type: "like",
    userId: "2",
    postId: "3",
    message: "liked your post",
    createdAt: new Date(Date.now() - 300000).toISOString(),
    read: false,
  },
  {
    id: "notif2",
    type: "comment",
    userId: "3",
    postId: "3",
    message: "commented on your post",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    read: false,
  },
  {
    id: "notif3",
    type: "friend_request",
    userId: "5",
    message: "sent you a friend request",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    id: "notif4",
    type: "follow",
    userId: "4",
    message: "started following you",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
  {
    id: "notif5",
    type: "mention",
    userId: "2",
    postId: "1",
    message: "mentioned you in a post",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
]

export const mockFriendRequests = [
  {
    id: "fr1",
    fromUserId: "5",
    toUserId: "1",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
]
