import { Link } from 'react-router-dom'
import OwlIcon from './OwlIcon'

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#C0392B] pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-10">
          <OwlIcon size={40} />
          <h2 className="font-bebas text-white text-5xl tracking-widest mt-3">VANO BABY</h2>
          <p className="text-[#C0392B] text-xs tracking-widest mt-1">AZÉTO GBÈDÉ MUSIC</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-center md:text-left">
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Artiste</h4>
            <ul className="space-y-2 text-[#999] text-sm">
              <li><Link to="/about" className="hover:text-[#C0392B] transition-colors">Biographie</Link></li>
              <li><Link to="/career" className="hover:text-[#C0392B] transition-colors">Carrière</Link></li>
              <li><Link to="/community" className="hover:text-[#C0392B] transition-colors">Communauté</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Musique</h4>
            <ul className="space-y-2 text-[#999] text-sm">
              <li><Link to="/music" className="hover:text-[#C0392B] transition-colors">Discographie</Link></li>
              <li><Link to="/videos" className="hover:text-[#C0392B] transition-colors">Vidéos</Link></li>
              <li><Link to="/concerts" className="hover:text-[#C0392B] transition-colors">Concerts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Streaming</h4>
            <ul className="space-y-2 text-[#999] text-sm">
              <li><a href="https://open.spotify.com/artist/6VxXJZxxq0cmpBvbVM8p0E" target="_blank" rel="noreferrer" className="hover:text-[#C0392B] transition-colors">Spotify</a></li>
              <li><a href="#" className="hover:text-[#C0392B] transition-colors">Apple Music</a></li>
              <li><a href="#" className="hover:text-[#C0392B] transition-colors">Deezer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-[#999] text-sm">
              <li><Link to="/contact" className="hover:text-[#C0392B] transition-colors">Booking</Link></li>
              <li><Link to="/contact" className="hover:text-[#C0392B] transition-colors">Presse</Link></li>
              <li><Link to="/contact" className="hover:text-[#C0392B] transition-colors">Partenariats</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          {['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Twitter'].map(s => (
            <a key={s} href="#" className="text-[#999] hover:text-[#C0392B] transition-colors text-xs uppercase tracking-widest">{s}</a>
          ))}
        </div>

        <p className="text-center text-[#555] text-xs">
          © 2024 Vano Baby. Tous droits réservés. Cotonou, Bénin.
        </p>
      </div>
    </footer>
  )
}
