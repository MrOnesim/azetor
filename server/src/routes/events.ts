import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { checkAndAwardBadges } from '../services/badgeService'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (_req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: { _count: { select: { reactions: true } } },
  })
  res.json(events)
})

router.post('/:id/react', requireAuth, async (req: AuthRequest, res: Response) => {
  const eventId = Number(req.params.id)
  const userId = req.userId!
  const existing = await prisma.eventReaction.findUnique({ where: { userId_eventId: { userId, eventId } } })
  if (existing) {
    await prisma.eventReaction.delete({ where: { userId_eventId: { userId, eventId } } })
    res.json({ reacted: false })
  } else {
    await prisma.eventReaction.create({ data: { userId, eventId } })
    await checkAndAwardBadges(userId)
    res.json({ reacted: true })
  }
})

export default router
