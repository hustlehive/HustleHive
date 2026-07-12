export const queryKeys = {
  // Auth
  me: ['auth', 'me'],

  // Hustles
  hustles: (filters) => ['hustles', filters ?? {}],
  hustle: (id) => ['hustle', id],
  applicants: (hustleId) => ['hustles', hustleId, 'applicants'],
  myApplications: () => ['applications', 'mine'],

  // Users
  publicProfile: (userId) => ['users', userId, 'profile'],
  userHustles: (userId) => ['users', userId, 'hustles'],
  userFriends: (userId) => ['users', userId, 'friends'],
  userSearch: (username) => ['users', 'search', username ?? ''],

  // Friends
  friends: () => ['friends'],
  requestsReceived: () => ['friends', 'requests', 'received'],
  requestsSent: () => ['friends', 'requests', 'sent'],

  // Messages
  inbox: (type) => ['messages', 'inbox', type ?? 'all'],
  conversation: (id) => ['messages', 'conversation', id],

  // Notifications
  notifications: () => ['notifications'],

  // Admin
  adminDashboard: () => ['admin', 'dashboard'],
  adminUsers: () => ['admin', 'users'],
  adminHustles: () => ['admin', 'hustles'],
  adminApplications: () => ['admin', 'applications'],
}