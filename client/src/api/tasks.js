// API client for task operations
const API_BASE_URL = 'http://localhost:4000'

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken')
}

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'API request failed')
  }
  
  return response.json()
}

// Task API functions
export const taskAPI = {
  // Get all tasks
  getAllTasks: () => apiRequest('/tasks'),
  
  // Get tasks for a specific date
  getTasksByDate: (date) => apiRequest(`/tasks/date/${date}`),
  
  // Get tasks by status
  getTasksByStatus: (status) => apiRequest(`/tasks?status=${status}`),
  
  // Create a new task
  createTask: (taskData) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  
  // Update a task
  updateTask: (taskId, taskData) => apiRequest(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  }),
  
  // Update task status
  updateTaskStatus: (taskId, status) => apiRequest(`/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // Delete a task
  deleteTask: (taskId) => apiRequest(`/tasks/${taskId}`, {
    method: 'DELETE',
  }),
}

export default taskAPI

