import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (_req: Request, res: Response) => {
  const videos = await prisma.video.findMany({ where: { status: 'published' }, orderBy: { createdAt: 'desc' } })
  res.json(videos)
})

router.get('/:id', async (req: Request, res: Response) => {
  const video = await prisma.video.findUnique({
    where: { id: Number(req.params.id) },
    include: { comments: { include: { user: { select: { id: true, pseudo: true, avatarColor: true } } }, orderBy: { createdAt: 'desc' } } },
  })
  if (!video) return res.status(404).json({ error: 'Vidéo introuvable' })
  res.json(video)
})

router.post('/:id/view', async (req: Request, res: Response) => {
  await prisma.video.update({ where: { id: Number(req.params.id) }, data: { viewCount: { increment: 1 } } })
  res.json({ ok: true })
})

export default router
