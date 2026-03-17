import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

const loginAttempts = new Map<string, { count: number; blockedUntil: number }>()

router.post('/register', async (req: Request, res: Response) => {
  const { pseudo, pin } = req.body
  if (!pseudo || !pin) return res.status(400).json({ error: 'Pseudo et PIN requis' })
  if (pin.length < 4 || pin.length > 6) return res.status(400).json({ error: 'PIN: 4-6 chiffres' })
  if (!/^\d+$/.test(pin)) return res.status(400).json({ error: 'PIN: chiffres uniquement' })

  const existing = await prisma.user.findUnique({ where: { pseudo } })
  if (existing) return res.status(409).json({ error: 'Pseudo déjà pris' })

  const hashed = await bcrypt.hash(pin, 12)
  const colors = ['#C0392B', '#2980B9', '#27AE60', '#8E44AD', '#E67E22', '#16A085']
  const avatarColor = colors[Math.floor(Math.random() * colors.length)]

  const user = await prisma.user.create({ data: { pseudo, pin: hashed, avatarColor } })
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30d' })

  res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
  res.json({ id: user.id, pseudo: user.pseudo, avatarColor: user.avatarColor })
})

router.post('/login', async (req: Request, res: Response) => {
  const { pseudo, pin } = req.body
  const key = pseudo?.toLowerCase()
  const now = Date.now()
  const attempt = loginAttempts.get(key)

  if (attempt && attempt.blockedUntil > now) {
    const mins = Math.ceil((attempt.blockedUntil - now) / 60000)
    return res.status(429).json({ error: `Compte bloqué. Réessayez dans ${mins} minute(s).` })
  }

  const user = await prisma.user.findUnique({ where: { pseudo } })
  if (!user) return res.status(401).json({ error: 'Pseudo ou PIN incorrect' })
  if (user.isBanned) {
    if (user.bannedUntil && user.bannedUntil < new Date()) {
      await prisma.user.update({ where: { id: user.id }, data: { isBanned: false, bannedUntil: null } })
    } else {
      return res.status(403).json({ error: 'Compte suspendu' })
    }
  }

  const valid = await bcrypt.compare(pin, user.pin)
  if (!valid) {
    const cur = attempt || { count: 0, blockedUntil: 0 }
    cur.count += 1
    if (cur.count >= 3) cur.blockedUntil = now + 15 * 60 * 1000
    loginAttempts.set(key, cur)
    return res.status(401).json({ error: 'Pseudo ou PIN incorrect' })
  }

  loginAttempts.delete(key)
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '30d' })
  res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 })
  res.json({ id: user.id, pseudo: user.pseudo, avatarColor: user.avatarColor })
})

router.post('/logout', (_req, res: Response) => {
  res.clearCookie('token')
  res.json({ ok: true })
})

router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: { badges: { include: { badge: true } } }
  })
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
  res.json({ id: user.id, pseudo: user.pseudo, avatarColor: user.avatarColor, badges: user.badges, createdAt: user.createdAt })
})

router.get('/check-pseudo', async (req: Request, res: Response) => {
  const { pseudo } = req.query
  const user = await prisma.user.findUnique({ where: { pseudo: String(pseudo) } })
  res.json({ available: !user })
})

router.post('/admin/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return res.status(401).json({ error: 'Identifiants incorrects' })
  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) return res.status(401).json({ error: 'Identifiants incorrects' })
  const token = jwt.sign({ adminId: admin.id }, process.env.JWT_ADMIN_SECRET || 'dev_admin_secret', { expiresIn: '8h' })
  res.cookie('adminToken', token, { httpOnly: true, secure: false, maxAge: 8 * 60 * 60 * 1000 })
  res.json({ ok: true })
})

router.post('/admin/logout', (_req, res: Response) => {
  res.clearCookie('adminToken')
  res.json({ ok: true })
})

export default router
