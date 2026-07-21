import axios from './axios'

export const searchUsers = (username) =>
  axios.get('/users/search', { params: { username } })

export const sendFriendRequest = (userId) =>
  axios.post(`/users/request/${userId}`)

export const getReceivedRequests = () => axios.get('/users/requests/received')

export const getSentRequests = () => axios.get('/users/requests/sent')

export const acceptFriendRequest = (requestId) =>
  axios.put(`/users/requests/${requestId}/accept`)

export const rejectFriendRequest = (requestId) =>
  axios.delete(`/users/requests/${requestId}/reject`)

export const cancelFriendRequest = (requestId) =>
  axios.delete(`/users/requests/${requestId}/cancel`)

export const getFriends = () => axios.get('/users/friends')

export const unfriend = (userId) =>
  axios.delete(`/users/friends/${userId}/unfriend`)

export const uploadProfilePicture = (formData) =>
  axios.put('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteProfilePicture = () => axios.delete('/users/profile-picture')

export const updateProfile = (data) => axios.put('/users/profile', data)

export const getMyProfile = () => axios.get('/users/me')

// New APIs
export const getPublicProfile = (userId) => axios.get(`/users/${userId}`)

export const getUserHustles = (userId) => axios.get(`/users/${userId}/hustles`)

export const getUserFriends = (userId) => axios.get(`/users/${userId}/friends`)

export const updateUsername = (data) => axios.put('/users/username', data)