export const ROUTES = {
  // Public
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_VERIFY: '/register/verify',
  FORGOT_PASSWORD: '/forgot-password',
  FORGOT_PASSWORD_VERIFY: '/forgot-password/verify',
  RESET_PASSWORD: '/reset-password',

  // App (Protected)
  DASHBOARD: '/app/dashboard',
  SEARCH: '/app/search',
  HUSTLE_CREATE: '/app/hustles/create',
  HUSTLE_DETAILS: (id = ':id') => `/app/hustles/${id}`,
  HUSTLE_EDIT: (id = ':id') => `/app/hustles/${id}/edit`,
  MY_HUSTLES: '/app/my-hustles',
  MY_APPLICATIONS: '/app/my-applications',
  FRIENDS: '/app/friends',
  INBOX: '/app/inbox',
  CONVERSATION: (id = ':conversationId') => `/app/inbox/${id}`,
  NOTIFICATIONS: '/app/notifications',
  PROFILE: '/app/profile',
  PUBLIC_PROFILE: (userId = ':userId') => `/app/users/${userId}`,

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_HUSTLES: '/admin/hustles',
  ADMIN_APPLICATIONS: '/admin/applications',

  // Misc
  NOT_FOUND: '*',
}