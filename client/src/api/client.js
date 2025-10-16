import axios from 'axios'
import { AUTH_STORAGE_KEY } from '../constants/storageKeys'
import { useAuth } from '../store/useAuth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true
})

api.interceptors.request.use((config) => {
  if(typeof window !== 'undefined'){
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if(raw){
      try{
        const parsed = JSON.parse(raw)
        const token = parsed?.state?.token
        if(token){
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }
      }catch(e){
        console.warn('Unable to parse auth storage', e)
      }
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response?.status === 401){
      const { logout } = useAuth.getState()
      logout()
    }
    return Promise.reject(error)
  }
)
