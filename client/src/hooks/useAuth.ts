import { useEffect } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, setUser, openAuth, closeAuth } = useAuthStore()

  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true })
      .then(r => setUser(r.data))
      .catch(() => setUser(null))
  }, [])

  return { user, openAuth, closeAuth }
}
