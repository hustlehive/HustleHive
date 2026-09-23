import axios from './axios'

export const improveHustleWithAI = (data) => axios.post('/ai/improve-hustle', data)

export const askHustleHive = (data) => axios.post('/ai/ask', data)