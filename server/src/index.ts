import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'

import authRoutes from './routes/auth'
import albumRoutes from './routes/albums'
import trackRoutes from './routes/tracks'
import videoRoutes from './routes/videos'
import eventRoutes from './routes/events'
import commentRoutes from './routes/comments'
import badgeRoutes from './routes/badges'
import contactRoutes from './routes/contact'
import adminRoutes from './routes/admin'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: true,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/albums', albumRoutes)
app.use('/api/tracks', trackRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/badges', badgeRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
