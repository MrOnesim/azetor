import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

const events = [
  { year: '2013', title: '"Drague Azonto"', desc: 'Premier single, naissance d\'un phénomène dans les rues de Cotonou.' },
  { year: '2014', title: 'MTN Découverte Talents', desc: 'Victoire nationale, dotation 5M FCFA. Tremplin décisif.' },
  { year: '2016', title: '"Adigoue Gboun Gboun"', desc: 'Buzz national, percée au Bénin. Hymne d\'une génération.' },
  { year: '2017', title: '"Je s\'en fou" + "Tonssimè chap"', desc: 'Collaborations stratégiques, hits enchaînés.' },
  { year: '2018', title: 'Universal Music Africa', desc: 'Signature internationale. Reconnaissance continentale.' },
  { year: '2019', title: '"Madame"', desc: 'Virage artistique vers un son plus mélodique et introspectif.' },
  { year: '2020', title: 'Label Red Line Africa', desc: 'Nouveau partenariat stratégique pour la distribution.' },
  { year: '2021', title: 'Bénin Top 10 Awards', desc: '1er titre Meilleur Artiste. Consécration nationale.' },
  { year: '2022', title: '"Diyo"', desc: 'Tube à conscience sociale, millions de streams.' },
  { year: '2023', title: 'Ambassadeur Betclic Bénin', desc: 'Rayonnement national renforcé.' },
  { year: '2024', title: '10 ans de règne', desc: 'Méga-concert en préparation à Cotonou.' },
]

function TimelineItem({ ev, index }: { ev: typeof events[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isLeft = index % 2 === 0

  return (
    <div className="relative flex items-center">
      {/* Left side */}
      <motion.div
        ref={ref}
        className={`w-1/2 ${isLeft ? 'pr-12 text-right' : 'pr-12 opacity-0 pointer-events-none'}`}
        initial={{ opacity: 0, x: isLeft ? -40 : 0 }}
        animate={inView ? { opacity: isLeft ? 1 : 0, x: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {isLeft && (
          <div className="bg-[#161616] border border-[#222] p-5 inline-block text-left hover:border-[#C0392B] transition-colors">
            <div className="font-bebas text-[#C0392B] text-3xl">{ev.year}</div>
            <h3 className="text-white font-semibold mt-1">{ev.title}</h3>
            <p className="text-[#666] text-sm mt-1">{ev.desc}</p>
          </div>
        )}
      </motion.div>

      {/* Center dot */}
      <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#C0392B] rounded-full border-2 border-[#080808] z-10" />

      {/* Right side */}
      <motion.div
        className={`w-1/2 ${!isLeft ? 'pl-12' : 'pl-12 opacity-0 pointer-events-none'}`}
        initial={{ opacity: 0, x: !isLeft ? 40 : 0 }}
        animate={inView ? { opacity: !isLeft ? 1 : 0, x: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {!isLeft && (
          <div className="bg-[#161616] border border-[#222] p-5 hover:border-[#C0392B] transition-colors">
            <div className="font-bebas text-[#C0392B] text-3xl">{ev.year}</div>
            <h3 className="text-white font-semibold mt-1">{ev.title}</h3>
            <p className="text-[#666] text-sm mt-1">{ev.desc}</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function Career() {
  return (
    <PageWrapper>
      {/* HERO */}
      <section className="relative h-[50vh] overflow-hidden bg-[#080808]">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <h1 className="font-bebas text-[10vw] leading-none">
              <span className="text-white">10 ANS DE </span>
              <span className="text-[#C0392B]">RÈGNE</span>
            </h1>
            <p className="text-[#999] tracking-widest mt-2">2014 → 2024</p>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-16">TIMELINE COMPLÈTE</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#C0392B] -translate-x-1/2" />
            <div className="space-y-10">
              {events.map((ev, i) => <TimelineItem key={ev.year + i} ev={ev} index={i} />)}
            </div>
          </div>
        </div>
      </section>

      {/* SOUND EVOLUTION */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-12">ÉVOLUTION DU SON</h2>
          <div className="relative h-16 rounded overflow-hidden flex">
            {[
              { label: 'RAP BRUT', years: '2013–2017', w: '35%' },
              { label: 'TRANSITION', years: '2018–2019', w: '20%' },
              { label: 'SON MÉLODIQUE', years: '2020–2024', w: '45%' },
            ].map((era, i) => (
              <motion.div
                key={era.label}
                className="h-full flex flex-col items-center justify-center text-white text-xs relative overflow-hidden"
                style={{ width: era.w, background: `hsl(${5 + i * 8}, ${60 + i * 15}%, ${30 + i * 8}%)` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                <span className="font-bebas text-sm">{era.label}</span>
                <span className="text-[10px] opacity-70">{era.years}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLABORATIONS */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-10">COLLABORATIONS</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {['Fanicko', 'Modeste', 'DJ Mix', 'Afro Black', 'Queen Toyin', 'Balton C'].map((name, i) => (
              <div key={name} className="flex-shrink-0 text-center">
                <img src={`https://picsum.photos/seed/collab${i}/80/80`} alt={name} className="w-20 h-20 rounded-full object-cover mx-auto mb-2" />
                <p className="text-white text-sm font-medium">{name}</p>
                <p className="text-[#555] text-xs">Collaboration</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LABELS */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-bebas text-white text-4xl tracking-widest text-center mb-10">LABELS & PARTENARIATS</h2>
          <div className="grid grid-cols-3 gap-6">
            {['MTN Bénin', 'Universal Music Africa', 'Red Line Records'].map(label => (
              <div key={label} className="bg-[#161616] border border-[#222] p-8 text-center hover:border-[#C0392B] transition-colors">
                <p className="font-bebas text-white text-xl tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
