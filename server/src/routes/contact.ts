import { Router, Request, Response } from 'express'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Champs requis manquants' })
  // Nodemailer would be configured here with env vars
  console.log('Contact form:', { name, email, subject, message })
  res.json({ ok: true, message: 'Message envoyé avec succès' })
})

export default router
