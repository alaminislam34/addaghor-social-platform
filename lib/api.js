import { mockUsers, currentUser } from "@/data/mock-users"
import { mockPosts, mockComments } from "@/data/mock-posts"
import { mockStories, mockNotes } from "@/data/mock-stories"
import { mockConversations, mockMessages } from "@/data/mock-messages"
import { mockNotifications, mockFriendRequests } from "@/data/mock-notifications"

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// User API
export async function getCurrentUser() {
  await delay(300)
  return currentUser
}

export async function getUser(userId) {
  await delay(300)
  return mockUsers.find((u) => u.id === userId) || null
}

export async function getUserByUsername(username) {
  await delay(300)
  return mockUsers.find((u) => u.username === username) || null
}

export async function getUsers() {
  await delay(400)
  return mockUsers
}

export async function updateProfile(userId, data) {
  await delay(500)
  return { success: true, data }
}

export async function searchUsers(query) {
  await delay(400)
  const lowerQuery = query.toLowerCase()
  return mockUsers.filter(
    (u) => u.name.toLowerCase().includes(lowerQuery) || u.username.toLowerCase().includes(lowerQuery),
  )
}

// Post API
export async function getPosts(options = {}) {
  await delay(400)
  let posts = [...mockPosts]

  if (options.userId) {
    posts = posts.filter((p) => p.userId === options.userId)
  }

  return posts.map((post) => ({
    ...post,
    user: mockUsers.find((u) => u.id === post.userId),
  }))
}

export async function getPost(postId) {
  await delay(300)
  const post = mockPosts.find((p) => p.id === postId)
  if (!post) return null
  return {
    ...post,
    user: mockUsers.find((u) => u.id === post.userId),
  }
}

export async function createPost(data) {
  await delay(500)
  return {
    id: Date.now().toString(),
    ...data,
    userId: currentUser.id,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0,
    shares: 0,
    isLiked: false,
    isSaved: false,
  }
}

export async function updatePost(postId, data) {
  await delay(500)
  return { success: true, data }
}

export async function deletePost(postId) {
  await delay(400)
  return { success: true }
}

export async function likePost(postId) {
  await delay(200)
  return { success: true }
}

export async function sharePost(postId) {
  await delay(300)
  return { success: true }
}

// Comments API
export async function getComments(postId) {
  await delay(300)
  return mockComments
    .filter((c) => c.postId === postId)
    .map((comment) => ({
      ...comment,
      user: mockUsers.find((u) => u.id === comment.userId),
    }))
}

export async function createComment(postId, content) {
  await delay(400)
  return {
    id: Date.now().toString(),
    postId,
    userId: currentUser.id,
    content,
    createdAt: new Date().toISOString(),
    likes: 0,
  }
}

// Stories API
export async function getStories() {
  await delay(400)
  return mockStories.map((story) => ({
    ...story,
    user: mockUsers.find((u) => u.id === story.userId),
  }))
}

export async function createStory(data) {
  await delay(600)
  return {
    id: Date.now().toString(),
    ...data,
    userId: currentUser.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    views: 0,
  }
}

// Notes API
export async function getNotes() {
  await delay(300)
  return mockNotes.map((note) => ({
    ...note,
    user: mockUsers.find((u) => u.id === note.userId),
  }))
}

export async function createNote(content) {
  await delay(400)
  return {
    id: Date.now().toString(),
    userId: currentUser.id,
    content,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  }
}

// Messages API
export async function getConversations() {
  await delay(400)
  return mockConversations.map((conv) => {
    const otherUserId = conv.participants.find((id) => id !== currentUser.id)
    return {
      ...conv,
      otherUser: mockUsers.find((u) => u.id === otherUserId),
    }
  })
}

export async function getMessages(conversationId) {
  await delay(300)
  return mockMessages.filter((m) => m.conversationId === conversationId)
}

export async function sendMessage(conversationId, content) {
  await delay(300)
  return {
    id: Date.now().toString(),
    conversationId,
    senderId: currentUser.id,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  }
}

// Notifications API
export async function getNotifications() {
  await delay(300)
  return mockNotifications.map((notif) => ({
    ...notif,
    user: mockUsers.find((u) => u.id === notif.userId),
  }))
}

export async function markNotificationRead(notificationId) {
  await delay(200)
  return { success: true }
}

// Friends API
export async function getFriendRequests() {
  await delay(300)
  return mockFriendRequests.map((req) => ({
    ...req,
    fromUser: mockUsers.find((u) => u.id === req.fromUserId),
  }))
}

export async function sendFriendRequest(userId) {
  await delay(400)
  return { success: true }
}

export async function acceptFriendRequest(requestId) {
  await delay(400)
  return { success: true }
}

export async function rejectFriendRequest(requestId) {
  await delay(400)
  return { success: true }
}

export async function getFriendSuggestions() {
  await delay(500)
  return mockUsers.filter((u) => u.id !== currentUser.id).slice(0, 5)
}

// Block/Report API
export async function blockUser(userId) {
  await delay(400)
  return { success: true }
}

export async function unblockUser(userId) {
  await delay(400)
  return { success: true }
}

export async function reportUser(userId, reason) {
  await delay(500)
  return { success: true }
}

export async function reportPost(postId, reason) {
  await delay(500)
  return { success: true }
}

// Search API
export async function searchPosts(query) {
  await delay(400)
  const lowerQuery = query.toLowerCase()
  return mockPosts
    .filter((p) => p.content.toLowerCase().includes(lowerQuery))
    .map((post) => ({
      ...post,
      user: mockUsers.find((u) => u.id === post.userId),
    }))
}
