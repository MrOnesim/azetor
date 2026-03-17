import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function checkAndAwardBadges(userId: number): Promise<{ slug: string; name: string; emoji: string }[]> {
  const [playCount, likeCount, commentCount, eventCount, allBadges, userBadges, playHistory] = await Promise.all([
    prisma.playHistory.count({ where: { userId } }),
    prisma.like.count({ where: { userId } }),
    prisma.comment.count({ where: { userId } }),
    prisma.eventReaction.count({ where: { userId } }),
    prisma.badge.findMany(),
    prisma.userBadge.findMany({ where: { userId } }),
    prisma.playHistory.findMany({ where: { userId }, select: { trackId: true } }),
  ])

  const earned = new Set(userBadges.map((ub) => ub.badgeId))
  const trackCounts = new Map<number, number>()
  playHistory.forEach((p) => trackCounts.set(p.trackId, (trackCounts.get(p.trackId) || 0) + 1))
  const maxRepeat = Math.max(...Array.from(trackCounts.values()), 0)
  const uniqueAlbums = new Set(await prisma.playHistory.findMany({ where: { userId }, select: { track: { select: { albumId: true } } } }).then((r) => r.map((x) => x.track.albumId))).size

  const newBadges: { slug: string; name: string; emoji: string }[] = []

  for (const badge of allBadges) {
    if (earned.has(badge.id)) continue
    let condition = false
    switch (badge.slug) {
      case 'auditeur-actif': condition = playCount >= badge.threshold; break
      case 'fan-premiere-heure': condition = playCount >= badge.threshold; break
      case 'legende': condition = playCount >= badge.threshold; break
      case 'voix-du-peuple': condition = commentCount >= badge.threshold; break
      case 'coeur-fidele': condition = likeCount >= badge.threshold; break
      case 'present-concerts': condition = eventCount >= badge.threshold; break
      case 'addict': condition = maxRepeat >= badge.threshold; break
      case 'decouvreur': condition = uniqueAlbums >= badge.threshold; break
    }
    if (condition) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } })
      newBadges.push({ slug: badge.slug, name: badge.name, emoji: badge.emoji })
    }
  }
  return newBadges
}
