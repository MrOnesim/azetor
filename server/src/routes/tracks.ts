import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth'
import { checkAndAwardBadges } from '../services/badgeService'

const router = Router()
const prisma = new PrismaClient()
const playThrottle = new Map<string, number>()

router.get('/top', async (_req: Request, res: Response) => {
  const tracks = await prisma.track.findMany({
    orderBy: { playCount: 'desc' },
    take: 5,
    include: { album: true },
  })
  res.json(tracks)
})

router.post('/:id/play', optionalAuth, async (req: AuthRequest, res: Response) => {
  const trackId = Number(req.params.id)
  if (req.userId) {
    const key = `${req.userId}-${trackId}`
    const last = playThrottle.get(key) || 0
    const now = Date.now()
    if (now - last < 2 * 60 * 60 * 1000) {
      return res.json({ ok: true, throttled: true })
    }
    playThrottle.set(key, now)
    await prisma.playHistory.create({ data: { userId: req.userId, trackId } })
    await checkAndAwardBadges(req.userId)
  }
  await prisma.track.update({ where: { id: trackId }, data: { playCount: { increment: 1 } } })
  res.json({ ok: true })
})

router.post('/:id/like', requireAuth, async (req: AuthRequest, res: Response) => {
  const trackId = Number(req.params.id)
  const userId = req.userId!
  const existing = await prisma.like.findUnique({ where: { userId_trackId: { userId, trackId } } })
  if (existing) {
    await prisma.like.delete({ where: { userId_trackId: { userId, trackId } } })
    res.json({ liked: false })
  } else {
    await prisma.like.create({ data: { userId, trackId } })
    await checkAndAwardBadges(userId)
    res.json({ liked: true })
  }
})

router.get('/:id/likes', optionalAuth, async (req: AuthRequest, res: Response) => {
  const trackId = Number(req.params.id)
  const count = await prisma.like.count({ where: { trackId } })
  const liked = req.userId ? !!(await prisma.like.findUnique({ where: { userId_trackId: { userId: req.userId, trackId } } })) : false
  res.json({ count, liked })
})

export default router
