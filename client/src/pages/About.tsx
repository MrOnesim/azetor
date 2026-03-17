import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import OwlIcon from '../components/OwlIcon'

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }}>
      {children}
    </motion.div>
  )
}

const blocks = [
  {
    id: 1, title: 'LES ORIGINES', imgSeed: 20, imgRight: true,
    text: 'Né le 9 mai 1994 à Sainte-Rita, Cotonou, au sein d\'une famille originaire de Grand-Popo dans le sud du Bénin, Aurel Sylvanus Adjivon grandit bercé par la culture locale et la musique de la rue. Très tôt, il développe un sens aigu du rythme. Il adopte le nom de scène Vano Baby et se forge un alter ego : Azéto Gbèdé.',
  },
  {
    id: 2, title: 'LES DÉBUTS 2013–2014', imgSeed: 21, imgRight: false,
    text: 'En 2013, il sort "Drague Azonto", premier single qui crée le buzz dans les rues de Cotonou. En 2014, il remporte le concours MTN Découverte Talents, tremplin national assorti d\'une dotation de 5 millions de FCFA. C\'est le début d\'une ascension fulgurante.',
  },
  {
    id: 3, title: 'LA PERCÉE 2016–2018', imgSeed: 22, imgRight: true,
    text: '"Adigoue Gboun Gboun" en 2016 devient un hymne national. En 2018, il signe avec Universal Music Africa, confirmation de sa stature continentale. Son rap mêlant fon, français et anglais traduit la réalité de la jeunesse béninoise.',
  },
  {
    id: 4, title: 'LA MATURITÉ 2019–2024', imgSeed: 23, imgRight: false,
    text: 'Avec "Madame" en 2019, Vano Baby opère un virage artistique vers un son plus mélodique et introspectif. "Fitè", "Diyo", "Chéri Coco", "Tu mérites tout" transcendent le rap pour toucher un public plus large. De 2021 à 2024, il remporte chaque année le Bénin Top 10 Awards.',
  },
]

const awards = [
  { year: '2014', title: 'MTN Découverte Talents' },
  { year: '2018', title: 'Contrat Universal Music Africa' },
  { year: '2021', title: 'Bénin Top 10 Awards — Meilleur Artiste' },
  { year: '2022', title: 'Bénin Top 10 Awards — Meilleur Artiste' },
  { year: '2023', title: 'Bénin Top 10 Awards — Meilleur Artiste' },
  { year: '2023', title: 'Ambassadeur Betclic Bénin' },
]

export default function About() {
  return (
    <PageWrapper>
      {/* HERO */}
      <section className="relative h-[60vh] overflow-hidden">
        <img src="https://picsum.photos/seed/about10/1920/1080" alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* TODO: replace with official Vano Baby photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080808] bg-[#080808]/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.h1 className="font-bebas text-white text-[10vw] leading-none" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            BIOGRAPHIE
          </motion.h1>
          <div className="w-24 h-[2px] bg-[#C0392B] mt-4" />
        </div>
      </section>

      {/* STORY BLOCKS */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        {blocks.map(b => (
          <FadeIn key={b.id}>
            <div className={`flex flex-col ${b.imgRight ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              <div className="flex-1">
                <h2 className="font-bebas text-white text-4xl tracking-widest mb-4">{b.title}</h2>
                <div className="w-12 h-0.5 bg-[#C0392B] mb-4" />
                <p className="text-[#999] leading-relaxed">{b.text}</p>
              </div>
              <div className="w-full md:w-80 h-64 md:h-80 overflow-hidden rounded">
                <img src={`https://picsum.photos/seed/about${b.imgSeed}/400/400`} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                {/* TODO: replace with official photos */}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* OWL EMBLEM */}
      <section className="py-24 bg-[#111111] text-center">
        <FadeIn>
          <OwlIcon size={200} animated />
          <h2 className="font-bebas text-white text-5xl tracking-widest mt-6 mb-4">L'EMBLÈME DU HIBOU</h2>
          <div className="w-16 h-0.5 bg-[#C0392B] mx-auto mb-6" />
          <p className="text-[#999] max-w-xl mx-auto leading-relaxed">
            Le hibou symbolise la sagesse, la vision nocturne et la maîtrise de la nuit.
            Métaphore du parcours de Vano Baby depuis les rues de Cotonou jusqu'aux scènes d'Afrique.
            Azéto Gbèdé voit là où les autres ne voient pas.
          </p>
        </FadeIn>
      </section>

      {/* AWARDS */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-12">RÉCOMPENSES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {awards.map((a, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#161616] border-t-2 border-[#C0392B] p-6">
                  <div className="font-bebas text-[#C0392B] text-3xl">{a.year}</div>
                  <h3 className="text-white mt-2 font-medium">{a.title}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS QUOTES */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {[
            { quote: '"Vano Baby est la voix authentique d\'une génération béninoise qui s\'affirme sur la scène africaine."', source: 'Le Monde Afrique' },
            { quote: '"Azéto Gbèdé mêle avec brio les langues et les cultures pour créer un son universel."', source: 'Jeune Afrique' },
            { quote: '"10 ans de carrière et toujours aussi affûté — Vano Baby est un phénomène."', source: 'Canal+ Afrique' },
          ].map((q, i) => (
            <FadeIn key={i}>
              <blockquote className={`font-playfair italic text-xl md:text-2xl leading-relaxed ${i % 2 === 0 ? 'text-[#C0392B]' : 'text-white'}`}>
                {q.quote}
              </blockquote>
              <cite className="text-[#555] text-sm block mt-3 not-italic">— {q.source}</cite>
            </FadeIn>
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
