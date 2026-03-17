import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin
  const adminPassword = await bcrypt.hash('VanoBaby2024!', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@vanobaby.bj' },
    update: {},
    create: { email: 'admin@vanobaby.bj', password: adminPassword },
  })

  // Badges
  const badges = [
    { slug: 'auditeur-actif', name: 'Auditeur Actif', emoji: '🎧', description: '10 titres écoutés', condition: 'plays', threshold: 10 },
    { slug: 'fan-premiere-heure', name: 'Fan de la Première Heure', emoji: '🔥', description: '50 titres écoutés', condition: 'plays', threshold: 50 },
    { slug: 'legende', name: 'Légende', emoji: '💎', description: '200 titres écoutés', condition: 'plays', threshold: 200 },
    { slug: 'voix-du-peuple', name: 'Voix du Peuple', emoji: '💬', description: '20 commentaires postés', condition: 'comments', threshold: 20 },
    { slug: 'coeur-fidele', name: 'Cœur Fidèle', emoji: '❤️', description: '30 titres likés', condition: 'likes', threshold: 30 },
    { slug: 'present-concerts', name: 'Présent aux Concerts', emoji: '📅', description: '3 événements "Je serai là"', condition: 'events', threshold: 3 },
    { slug: 'addict', name: 'Addict', emoji: '🔁', description: 'Même track 10 fois', condition: 'repeat', threshold: 10 },
    { slug: 'decouvreur', name: 'Découvreur', emoji: '🌟', description: '5 albums différents', condition: 'albums', threshold: 5 },
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({ where: { slug: badge.slug }, update: {}, create: badge })
  }

  // Albums & tracks
  const albumsData = [
    {
      title: 'Drague Azonto',
      coverUrl: 'https://picsum.photos/seed/album1/300/300',
      releaseYear: 2013,
      type: 'single',
      tracks: [
        { title: 'Drague Azonto', feat: '', duration: 210 },
        { title: 'Cotonou by Night', feat: '', duration: 198 },
      ],
    },
    {
      title: 'Adigoue Gboun Gboun',
      coverUrl: 'https://picsum.photos/seed/album2/300/300',
      releaseYear: 2016,
      type: 'single',
      tracks: [
        { title: 'Adigoue Gboun Gboun', feat: '', duration: 225 },
        { title: 'Je s\'en fou', feat: '', duration: 213 },
        { title: 'Tonssimè chap', feat: '', duration: 187 },
      ],
    },
    {
      title: 'Madame',
      coverUrl: 'https://picsum.photos/seed/album3/300/300',
      releaseYear: 2019,
      type: 'album',
      tracks: [
        { title: 'Madame', feat: '', duration: 234 },
        { title: 'Fitè', feat: '', duration: 201 },
        { title: 'Diyo', feat: '', duration: 245 },
        { title: 'Chéri Coco', feat: '', duration: 218 },
      ],
    },
    {
      title: 'Tu mérites tout',
      coverUrl: 'https://picsum.photos/seed/album4/300/300',
      releaseYear: 2021,
      type: 'single',
      tracks: [
        { title: 'Tu mérites tout', feat: '', duration: 222 },
        { title: 'Azéto Vibration', feat: '', duration: 196 },
      ],
    },
    {
      title: '10 Ans de Règne',
      coverUrl: 'https://picsum.photos/seed/album5/300/300',
      releaseYear: 2024,
      type: 'album',
      tracks: [
        { title: 'Intro — 10 Ans', feat: '', duration: 90 },
        { title: 'Grand-Popo Flow', feat: '', duration: 238 },
        { title: 'Sainte-Rita', feat: '', duration: 215 },
        { title: 'Cotonou Love', feat: '', duration: 229 },
        { title: 'Bénin My Heart', feat: '', duration: 241 },
      ],
    },
  ]

  for (const albumData of albumsData) {
    const { tracks, ...albumInfo } = albumData
    const album = await prisma.album.upsert({
      where: { id: (await prisma.album.findFirst({ where: { title: albumInfo.title } }))?.id || 0 },
      update: {},
      create: { ...albumInfo, tracks: { create: tracks.map(t => ({ ...t, audioUrl: '' })) } },
    })
    console.log('Created album:', album.title)
  }

  // Videos
  const videosData = [
    { title: 'Vano Baby — Diyo (Clip Officiel)', description: 'Le clip officiel de Diyo', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'clip', thumbnailUrl: 'https://picsum.photos/seed/vid1/640/360' },
    { title: 'Vano Baby — Madame (Live Concert)', description: 'Performance live', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'live', thumbnailUrl: 'https://picsum.photos/seed/vid2/640/360' },
    { title: 'Vano Baby — Interview Canal 3 Bénin', description: 'Interview exclusive', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'interview', thumbnailUrl: 'https://picsum.photos/seed/vid3/640/360' },
    { title: 'Vano Baby — Freestyle Radio Bénin', description: 'Freestyle inédit', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'freestyle', thumbnailUrl: 'https://picsum.photos/seed/vid4/640/360' },
    { title: 'Vano Baby — Fitè (Clip Officiel)', description: 'Clip officiel Fitè', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'clip', thumbnailUrl: 'https://picsum.photos/seed/vid5/640/360' },
    { title: 'Vano Baby — Chéri Coco (Clip)', description: 'Clip Chéri Coco', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', category: 'clip', thumbnailUrl: 'https://picsum.photos/seed/vid6/640/360' },
  ]

  for (const video of videosData) {
    const existing = await prisma.video.findFirst({ where: { title: video.title } })
    if (!existing) await prisma.video.create({ data: video })
  }

  // Events
  const eventsData = [
    { title: '10 Ans de Règne — Le Méga-Concert', date: new Date('2025-12-31T20:00:00'), venue: 'Stade de l\'Amitié', city: 'Cotonou', country: 'Bénin', ticketUrl: '#', status: 'upcoming' },
    { title: 'Vano Baby en Live — Bohicon', date: new Date('2025-08-15T19:00:00'), venue: 'Place de l\'Indépendance', city: 'Bohicon', country: 'Bénin', ticketUrl: '#', status: 'upcoming' },
    { title: 'Tour Afrique de l\'Ouest', date: new Date('2025-10-01T20:00:00'), venue: 'Palais des Sports', city: 'Abidjan', country: 'Côte d\'Ivoire', ticketUrl: '#', status: 'upcoming' },
    { title: 'Concert Grand-Popo Ancestral', date: new Date('2024-12-01T19:00:00'), venue: 'Plage de Grand-Popo', city: 'Grand-Popo', country: 'Bénin', ticketUrl: '#', status: 'past' },
  ]

  for (const event of eventsData) {
    const existing = await prisma.event.findFirst({ where: { title: event.title } })
    if (!existing) await prisma.event.create({ data: event })
  }

  console.log('Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
