import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/all', async (_req: Request, res: Response) => {
  const badges = await prisma.badge.findMany()
  res.json(badges)
})

router.get('/user/:id', async (req: Request, res: Response) => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId: Number(req.params.id) },
    include: { badge: true },
  })
  res.json(userBadges)
})

export default router
