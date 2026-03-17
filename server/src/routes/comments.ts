import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { checkAndAwardBadges } from '../services/badgeService'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (req: Request, res: Response) => {
  const { videoId } = req.query
  const comments = await prisma.comment.findMany({
    where: { videoId: Number(videoId), approved: true },
    include: { user: { select: { id: true, pseudo: true, avatarColor: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json(comments)
})

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { videoId, content } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'Contenu requis' })
  const comment = await prisma.comment.create({
    data: { userId: req.userId!, videoId: Number(videoId), content: content.trim() },
    include: { user: { select: { id: true, pseudo: true, avatarColor: true } } },
  })
  await checkAndAwardBadges(req.userId!)
  res.json(comment)
})

router.post('/:id/flag', requireAuth, async (req: Request, res: Response) => {
  const comment = await prisma.comment.update({
    where: { id: Number(req.params.id) },
    data: { flagCount: { increment: 1 } },
  })
  if (comment.flagCount >= 3) {
    await prisma.comment.update({ where: { id: comment.id }, data: { approved: false } })
  }
  res.json({ ok: true })
})

export default router
