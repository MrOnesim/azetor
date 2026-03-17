import { useState, useEffect } from 'react'
import axios from 'axios'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '1cf1c8410e114cbcb5974eeede2ac439'
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || ''
const ARTIST_ID = import.meta.env.VITE_SPOTIFY_ARTIST_ID || '6VxXJZxxq0cmpBvbVM8p0E'

let cachedToken: string | null = null
let tokenExpiry = 0

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const res = await axios.post('https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
    }
  )
  cachedToken = res.data.access_token
  tokenExpiry = Date.now() + res.data.expires_in * 1000
  return cachedToken!
}

export function useSpotify() {
  const [artist, setArtist] = useState<any>(null)
  const [topTracks, setTopTracks] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!CLIENT_SECRET) {
      setLoading(false)
      setError(true)
      return
    }
    getToken()
      .then(token => Promise.all([
        axios.get(`https://api.spotify.com/v1/artists/${ARTIST_ID}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=BJ`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?market=BJ&limit=20`, { headers: { Authorization: `Bearer ${token}` } }),
      ]))
      .then(([a, t, al]) => {
        setArtist(a.data)
        setTopTracks(t.data.tracks)
        setAlbums(al.data.items)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { artist, topTracks, albums, loading, error }
}
