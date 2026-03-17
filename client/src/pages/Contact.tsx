import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import axios from 'axios'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('/api/contact', form)
      setSent(true)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      {/* HERO */}
      <section className="h-[40vh] flex flex-col items-center justify-center bg-[#080808]">
        <h1 className="font-bebas text-white text-[10vw] leading-none">CONTACT</h1>
        <p className="text-[#C0392B] tracking-widest text-sm mt-2">Bookings · Presse · Partenariats</p>
      </section>

      {/* FORM */}
      <section className="py-16 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Left - Form */}
          <div>
            <h2 className="font-bebas text-white text-3xl tracking-widest mb-8">ENVOYER UN MESSAGE</h2>
            {sent ? (
              <div className="bg-[#161616] border border-[#C0392B] p-8 text-center">
                <div className="text-3xl mb-3">✓</div>
                <h3 className="font-bebas text-white text-2xl">Message envoyé !</h3>
                <p className="text-[#999] mt-2 text-sm">Nous vous répondrons dans les meilleurs délais.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Nom</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 focus:border-[#C0392B] transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 focus:border-[#C0392B] transition-colors text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Objet</label>
                  <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 focus:border-[#C0392B] transition-colors text-sm">
                    <option value="">Choisir...</option>
                    <option>Booking Concert</option>
                    <option>Demande Presse</option>
                    <option>Partenariat</option>
                    <option>Collaboration Artistique</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#999] uppercase tracking-widest block mb-1">Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={6} className="w-full bg-[#161616] border border-[#333] text-white px-4 py-3 focus:border-[#C0392B] transition-colors text-sm resize-none" />
                </div>
                {error && <p className="text-[#C0392B] text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="bg-[#C0392B] hover:bg-[#E74C3C] disabled:opacity-50 text-white px-8 py-3 font-bebas text-xl tracking-widest transition-colors">
                  {loading ? 'ENVOI...' : 'ENVOYER →'}
                </button>
              </form>
            )}
          </div>

          {/* Right - Info */}
          <div>
            <h2 className="font-bebas text-white text-3xl tracking-widest mb-8">INFORMATIONS</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bebas text-[#C0392B] text-xl tracking-wider">AZÉTO GBÈDÉ MUSIC</h3>
                <p className="text-[#666] text-sm mt-1">Management & Booking officiel</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-[#C0392B] mt-0.5">✉</span>
                  <a href="mailto:contact@vanobaby.bj" className="text-[#999] hover:text-white transition-colors">contact@vanobaby.bj</a>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C0392B] mt-0.5">📱</span>
                  <span className="text-[#999]">+229 XX XX XX XX</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C0392B] mt-0.5">📍</span>
                  <span className="text-[#999]">Cotonou, Bénin</span>
                </div>
              </div>
              <div className="border-t border-[#222] pt-6 space-y-3">
                {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map(s => (
                  <a key={s} href="#" className="flex items-center gap-3 text-[#666] hover:text-[#C0392B] transition-colors text-sm">
                    <span className="text-[#C0392B]">→</span> {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING INTERNATIONAL */}
      <section className="py-12 bg-[#080808]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#161616] border-t-2 border-[#C0392B] p-8">
            <h3 className="font-bebas text-white text-3xl tracking-widest mb-3">BOOKING INTERNATIONAL</h3>
            <p className="text-[#666] text-sm leading-relaxed">
              Pour les demandes de booking international, veuillez contacter directement notre partenaire de distribution et management continental.
              <strong className="text-white"> Red Line Records Africa</strong> gère les tournées et événements hors Bénin.
              Toutes les demandes sont traitées dans un délai de 72h ouvrées.
            </p>
            <a href="mailto:booking@redlinerecords.bj" className="inline-block mt-4 text-[#C0392B] hover:text-[#E74C3C] text-sm font-medium">booking@redlinerecords.bj →</a>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
