import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.get('/', async (_req: Request, res: Response) => {
  const albums = await prisma.album.findMany({
    where: { status: 'published' },
    include: { tracks: { orderBy: { id: 'asc' } } },
    orderBy: { releaseYear: 'desc' },
  })
  res.json(albums)
})

router.get('/:id', async (req: Request, res: Response) => {
  const album = await prisma.album.findUnique({
    where: { id: Number(req.params.id) },
    include: { tracks: { orderBy: { id: 'asc' } } },
  })
  if (!album) return res.status(404).json({ error: 'Album introuvable' })
  res.json(album)
})

export default router
