import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: number
  adminId?: number
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: 'Non authentifié' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as { userId: number }
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Token invalide' })
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.token
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as { userId: number }
      req.userId = payload.userId
    } catch {}
  }
  next()
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.adminToken
  if (!token) return res.status(401).json({ error: 'Accès refusé' })
  try {
    const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET || 'dev_admin_secret') as { adminId: number }
    req.adminId = payload.adminId
    next()
  } catch {
    res.status(401).json({ error: 'Token admin invalide' })
  }
}
