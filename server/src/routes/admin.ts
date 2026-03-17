import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { adminOnly } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(adminOnly)

// Stats dashboard
router.get('/stats', async (_req: Request, res: Response) => {
  const [totalUsers, totalTracks, totalComments, nextEvent, topTracks] = await Promise.all([
    prisma.user.count(),
    prisma.track.count(),
    prisma.comment.count(),
    prisma.event.findFirst({ where: { status: 'upcoming' }, orderBy: { date: 'asc' } }),
    prisma.track.findMany({ orderBy: { playCount: 'desc' }, take: 5, include: { album: true } }),
  ])
  const totalPlays = await prisma.track.aggregate({ _sum: { playCount: true } })
  res.json({ totalUsers, totalTracks, totalComments, totalPlays: totalPlays._sum.playCount || 0, nextEvent, topTracks })
})

// Albums
router.get('/albums', async (_req, res) => {
  const albums = await prisma.album.findMany({ include: { tracks: true }, orderBy: { releaseYear: 'desc' } })
  res.json(albums)
})
router.post('/albums', async (req, res) => {
  const { title, coverUrl, releaseYear, type, status } = req.body
  const album = await prisma.album.create({ data: { title, coverUrl, releaseYear: Number(releaseYear), type, status } })
  res.json(album)
})
router.put('/albums/:id', async (req, res) => {
  const album = await prisma.album.update({ where: { id: Number(req.params.id) }, data: req.body })
  res.json(album)
})
router.delete('/albums/:id', async (req, res) => {
  await prisma.album.delete({ where: { id: Number(req.params.id) } })
  res.json({ ok: true })
})

// Tracks
router.post('/tracks', async (req, res) => {
  const { title, feat, audioUrl, duration, albumId } = req.body
  const track = await prisma.track.create({ data: { title, feat, audioUrl, duration: Number(duration), albumId: Number(albumId) } })
  res.json(track)
})
router.put('/tracks/:id', async (req, res) => {
  const track = await prisma.track.update({ where: { id: Number(req.params.id) }, data: req.body })
  res.json(track)
})
router.delete('/tracks/:id', async (req, res) => {
  await prisma.track.delete({ where: { id: Number(req.params.id) } })
  res.json({ ok: true })
})

// Videos
router.get('/videos', async (_req, res) => {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(videos)
})
router.post('/videos', async (req, res) => {
  const video = await prisma.video.create({ data: req.body })
  res.json(video)
})
router.put('/videos/:id', async (req, res) => {
  const video = await prisma.video.update({ where: { id: Number(req.params.id) }, data: req.body })
  res.json(video)
})
router.delete('/videos/:id', async (req, res) => {
  await prisma.video.delete({ where: { id: Number(req.params.id) } })
  res.json({ ok: true })
})

// Events
router.get('/events', async (_req, res) => {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' }, include: { _count: { select: { reactions: true } } } })
  res.json(events)
})
router.post('/events', async (req, res) => {
  const event = await prisma.event.create({ data: { ...req.body, date: new Date(req.body.date) } })
  res.json(event)
})
router.put('/events/:id', async (req, res) => {
  const event = await prisma.event.update({ where: { id: Number(req.params.id) }, data: { ...req.body, ...(req.body.date ? { date: new Date(req.body.date) } : {}) } })
  res.json(event)
})
router.delete('/events/:id', async (req, res) => {
  await prisma.event.delete({ where: { id: Number(req.params.id) } })
  res.json({ ok: true })
})

// Comments moderation
router.get('/comments', async (_req, res) => {
  const comments = await prisma.comment.findMany({ include: { user: { select: { pseudo: true } }, video: { select: { title: true } } }, orderBy: { createdAt: 'desc' } })
  res.json(comments)
})
router.put('/comments/:id/approve', async (req, res) => {
  const c = await prisma.comment.update({ where: { id: Number(req.params.id) }, data: { approved: true, flagCount: 0 } })
  res.json(c)
})
router.delete('/comments/:id', async (req, res) => {
  await prisma.comment.delete({ where: { id: Number(req.params.id) } })
  res.json({ ok: true })
})

// Users
router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { playHistory: true, badges: true } } } })
  res.json(users)
})
router.put('/users/:id/ban', async (req, res) => {
  const { days } = req.body
  const bannedUntil = days ? new Date(Date.now() + days * 24 * 60 * 60 * 1000) : null
  const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { isBanned: true, bannedUntil } })
  res.json(user)
})
router.put('/users/:id/unban', async (req, res) => {
  const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { isBanned: false, bannedUntil: null } })
  res.json(user)
})

export default router
