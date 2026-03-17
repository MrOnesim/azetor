import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import IntroLoader from './components/IntroLoader'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PersistentPlayer from './components/PersistentPlayer'
import Home from './pages/Home'
import About from './pages/About'
import Career from './pages/Career'
import Music from './pages/Music'
import Videos from './pages/Videos'
import Concerts from './pages/Concerts'
import Community from './pages/Community'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMusic from './pages/admin/AdminMusic'
import AdminVideos from './pages/admin/AdminVideos'
import AdminEvents from './pages/admin/AdminEvents'
import AdminModeration from './pages/admin/AdminModeration'
import AdminUsers from './pages/admin/AdminUsers'

function AnimatedRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/career" element={<Career />} />
          <Route path="/music" element={<Music />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/concerts" element={<Concerts />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/music" element={<AdminMusic />} />
          <Route path="/admin/videos" element={<AdminVideos />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/moderation" element={<AdminModeration />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
      {!isAdmin && <PersistentPlayer />}
    </>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(() => sessionStorage.getItem('vb_seen') === '1')

  useEffect(() => {
    if (loaded) sessionStorage.setItem('vb_seen', '1')
  }, [loaded])

  return (
    <BrowserRouter>
      <CustomCursor />
      {!loaded ? (
        <IntroLoader onDone={() => { sessionStorage.setItem('vb_seen', '1'); setLoaded(true) }} />
      ) : (
        <AnimatedRoutes />
      )}
    </BrowserRouter>
  )
}
