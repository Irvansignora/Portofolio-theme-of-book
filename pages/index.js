import Head from 'next/head'
import { useEffect, useRef, useState, useCallback } from 'react'

const CHAPTERS = {
  home:      { pageL: '— i —',        pageR: '— 1 —',  numRoman: 'I',    title: 'Preface',            page: 1  },
  portfolio: { pageL: '— vii —',      pageR: '— 7 —',  numRoman: 'II',   title: 'Portfolio',          page: 7  },
  projects:  { pageL: '— xiv —',      pageR: '— 14 —', numRoman: 'III',  title: 'Projects',           page: 14 },
  skills:    { pageL: '— xxi —',      pageR: '— 21 —', numRoman: 'IV',   title: 'Skills & Expertise', page: 21 },
  social:    { pageL: '— xxviii —',   pageR: '— 28 —', numRoman: 'V',    title: 'Social Experience',  page: 28 },
  travel:    { pageL: '— xxxv —',     pageR: '— 35 —', numRoman: 'VI',   title: 'Travel Gallery',     page: 35 },
  contact:   { pageL: '— xlii —',     pageR: '— 42 —', numRoman: 'VII',  title: 'Correspondence',     page: 42 },
}
const CHAPTER_ORDER = ['home','portfolio','projects','skills','social','travel','contact']


// Cloudinary auto-optimize: resize ke thumbnail, WebP, quality auto, eager load
const cloudinaryThumb = (url, w = 400, h = 400) => {
  if (!url.includes('res.cloudinary.com')) return url
  // Insert transformation params after /upload/
  return url.replace(
    '/upload/',
    `/upload/w_${w},h_${h},c_fill,q_auto,f_auto,dpr_auto/`
  )
}

const TRAVEL_PHOTOS = [
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772681838/Dieng_4_msizry.jpg', dest:'Dieng, Indonesia',    year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772684165/IMG_20240819_112414_144_o78tbx.jpg', dest:'Merbabu Mount, Indonesia',  year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772685244/rinjani_wkvdyr.jpg',  dest:'Rinjani, Indonesia',     year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772681856/gn_gede_ttv1dd.jpg', dest:'Gede Mount, Indonesia', year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772683058/20230911_071846_hvd7oc.jpg', dest:'Prau Mount, Indonesia', year:'2023' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772685248/semeru_btzs5h.png', dest:'Semeru Mount, Indonesia', year:'2023' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772682267/20250607_114807_uyhff4.jpg', dest:'Pangradinan Mount, Indonesia',  year:'2025' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772682397/IMG_20230219_075958_n5lumv.jpg', dest:'Pari Island, Indonesia',     year:'2023' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772682547/20240505_091651_okt1ey.jpg', dest:'Dufan, Indonesia',      year:'2023' },
]



const SOCIAL_PLACEHOLDER = {
  1: [
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679021/Donasi_speaker_ke_masjid_igbpb3.jpg'},
    {type:'video',src:'https://res.cloudinary.com/dyhvx9wit/video/upload/v1772679211/Bersih_bersih_Masjid_uhtzus.mp4'},
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772680208/Aksi_Sosial_f6kfge.jpg'},
  ],
  2: [
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679040/Banjir_01_pzud0m.jpg'},
    {type:'video',src:'https://res.cloudinary.com/dyhvx9wit/video/upload/v1772679251/Aksi_Sosial_Banjir_01_gmctq7.mp4'},
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679038/Peduli_Banjir_lndedb.jpg'},
  ],
  3: [
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679067/Olahraga_Bareng_Anak2_Yatim_ymmvez.jpg'},
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679067/Olahraga_Bareng_Anak2_Yatim_ymmvez.jpg'},
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679022/Alhilal_01_iewoun.jpg'},
  ],
  4: [
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772680214/Rihlah_2_cxmahy.jpg'},
    {type:'video',src:'https://res.cloudinary.com/dyhvx9wit/video/upload/v1772679168/Jambore_Anak_Yatim_xqnrlc.mp4'},
    {type:'image',src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679069/Jambore_Anak_Yatim_f6ry9h.jpg'},
  ],
  5: [
    {type:'image',src:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=220&fit=crop'},
    {type:'image',src:'https://images.unsplash.com/photo-1560785496-3c9d27877182?w=300&h=220&fit=crop'},
    {type:'image',src:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=220&fit=crop'},
  ],
  6: [
    {type:'image',src:'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=220&fit=crop'},
    {type:'image',src:'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=300&h=220&fit=crop'},
    {type:'image',src:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=220&fit=crop'},
  ],
}



// ===== PROJECTS DATA — module-level so it's reusable everywhere =====
const PROJECTS_DATA = [
  {
    num:'§ I', tag:'Finance Tool', title:'Finance Manager',
    subtitle:'Personal Finance & Cash Flow Tracker',
    desc:'A smart personal finance manager built for clarity, speed, and everyday use. Track income, expenses, and cash flow in real-time with an intuitive dashboard. Built on Firebase for instant data sync across devices.',
    story:'This project was born from a personal need — managing monthly finances across multiple income streams. The goal was to build something fast, beautiful, and genuinely useful for daily use.',
    tech:['Firebase','React','Realtime DB','CSS3','Vercel'],
    links:[{href:'https://monflow-v2.web.app/',label:'→ Visit Application'}],
    highlights:['Real-time Firebase sync','Multi-category expense tracking','Monthly cash flow charts','Mobile-responsive design'],
    status:'Live & Deployed', year:'2024',
  },
  {
    num:'§ II', tag:'Lifestyle App', title:'Ramadhan Planner',
    subtitle:'Spiritual Goal Tracker for Ramadhan',
    desc:'Plan your most meaningful month with purpose. Track ibadah, set daily goals, and stay consistent throughout Ramadhan — all in one beautiful application. Designed with intentionality and simplicity at its core.',
    story:'Built as a personal Ramadhan companion, this app emerged from the desire to bring more structure and reflection to the holy month. The minimalist design was intentional — keeping focus on what truly matters.',
    tech:['Next.js','Vercel','LocalStorage','Tailwind CSS'],
    links:[{href:'https://ramadhan-planner2.vercel.app/',label:'→ Visit Application'}],
    highlights:['Daily ibadah tracker','Goal setting & streaks','Beautiful minimalist UI','Offline-capable with LocalStorage'],
    status:'Live & Deployed', year:'2024',
  },
  {
    num:'§ III', tag:'School Website', title:'Early Childhood School Website',
    subtitle:'PAUD Fajar Pagi — School Web Presence',
    desc:"A clean, welcoming website for an early childhood school. Built to help parents learn about the school's programmes and how to enrol their little ones. Focuses on clarity, warmth, and ease of navigation.",
    story:"Commissioned to help a local early childhood school establish a professional web presence. The design prioritises warmth and approachability — reflecting the school's caring environment.",
    tech:['Next.js','Tailwind CSS','Vercel','Responsive Design'],
    links:[{href:'https://paud-fajar-pagi.vercel.app/',label:'→ Visit Application'}],
    highlights:['Parent-friendly navigation','School programme info','Enrolment information','Mobile-first design'],
    status:'Live & Deployed', year:'2024',
  },
  {
    num:'§ IV', tag:'Personal Portfolio', title:'Portfolio Sites',
    subtitle:'Custom Portfolios for Real Clients',
    desc:'Custom-built portfolio websites for real clients — designed to make strong first impressions and showcase their unique skills to prospective employers and collaborators. Each site is tailored to the individual.',
    story:'Every portfolio tells a story. These projects involved deep collaboration with each client to understand their personality, goals, and the impression they wanted to leave on the world.',
    tech:['Next.js','CSS3','Vercel','Responsive Design'],
    links:[{href:'https://m-nazar.vercel.app/',label:'→ Nazar Portfolio'},{href:'https://portofolio-anisa.vercel.app/',label:'→ Anisa Portfolio'}],
    highlights:['Tailored to each client','Custom animations','SEO-optimised','Fast loading performance'],
    status:'Live & Deployed', year:'2024',
  },
  {
    num:'§ V', tag:'Machine Learning', title:'Sales ML Analytics',
    subtitle:'AI-Powered Sales Intelligence Platform',
    desc:'An AI-powered analytics platform using machine learning to uncover sales patterns, forecast trends, and deliver actionable business insights in real-time. Built with Python and Streamlit for rapid deployment.',
    story:'Combining professional sales experience with data science skills, this project bridges the gap between raw sales data and meaningful business decisions. ML models were trained on real sales patterns.',
    tech:['Python','Streamlit','Scikit-learn','Pandas','Plotly'],
    links:[{href:'https://sales-ml-analytics.streamlit.app/',label:'→ Visit Application'}],
    highlights:['ML-powered trend forecasting','Interactive Plotly dashboards','Sales pattern recognition','Actionable business insights'],
    status:'Live & Deployed', year:'2024',
  },
  {
    num:'§ VI', tag:'E-Commerce & POS', title:'Online Store & POS System',
    subtitle:'Full-Featured Digital Commerce Solutions',
    desc:'Full-featured digital commerce solutions — from a fresh grocery e-commerce store with cart & checkout, to a coffee shop POS system with real-time transaction flow. Two complete systems built for real business use.',
    story:'Two separate projects with a shared goal: making commerce digital, smooth, and reliable. The grocery store focuses on customer experience; the POS system on operational efficiency for staff.',
    tech:['Next.js','Tailwind CSS','Vercel','Context API'],
    links:[{href:'https://ecommerce-freshmarket.vercel.app/',label:'→ FreshMarket Store'},{href:'https://demo-coffee-shop-v2.vercel.app/',label:'→ Coffee Shop POS'}],
    highlights:['Full cart & checkout flow','Real-time POS transactions','Inventory management','Clean, professional UI'],
    status:'Live & Deployed', year:'2024',
  },
]

export default function BookPortfolio() {
  const [current, setCurrent]             = useState('home')
  const [pageNums, setPageNums]           = useState({ l: '— i —', r: '— 1 —' })
  const [isFlipping, setIsFlipping]       = useState(false)
  const [flipDir, setFlipDir]             = useState('forward')
  const [lbOpen, setLbOpen]               = useState(false)
  const [lbImgs, setLbImgs]               = useState([])
  const [lbIdx, setLbIdx]                 = useState(0)
  const [formSent, setFormSent]           = useState(false)
  const [formError, setFormError]         = useState(false)
  const [formSending, setFormSending]     = useState(false)
  const [scrollPct, setScrollPct]         = useState(0)
  const [soundOn, setSoundOn]             = useState(false)
  const [flipQuote, setFlipQuote]         = useState('')
  const [showQuote, setShowQuote]         = useState(false)
  const [darkMode, setDarkMode]           = useState(false)
  const [darkTransition, setDarkTransition] = useState(null) // 'todark' | 'tolight' | null
  const [visitCount, setVisitCount]       = useState(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [previewUrl, setPreviewUrl]       = useState(null)
  const [previewPos, setPreviewPos]       = useState({ x: 0, y: 0 })
  const [introPhase, setIntroPhase]       = useState('closed') // 'closed' | 'ready' | 'opening' | 'done'
  const [introTimer, setIntroTimer]       = useState(5)        // countdown seconds
  const [introScrolled, setIntroScrolled] = useState(false)
  const [toolbarOpen, setToolbarOpen]     = useState(false)
  const [konamiActive, setKonamiActive]   = useState(false)
  const [konamiPhase, setKonamiPhase]     = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const [detailTransition, setDetailTransition] = useState('in') // 'in' | 'out-left' | 'out-right'
  const [flipInDir, setFlipInDir] = useState('forward') // 'forward' | 'backward'
  const [secretTapCount, setSecretTapCount] = useState(0)        // mobile konami: tap logo 7x
  const [isMobile, setIsMobile] = useState(false)
  const secretTapTimer = useRef(null)

  // ===== ALL REFS — declared before any useCallback to avoid SSR issues =====
  const rightScrollRef     = useRef(null)
  const leafRef            = useRef(null)
  const flipping           = useRef(false)
  const audioCtx           = useRef(null)
  const canvasRef          = useRef(null)
  const particlesRef       = useRef([])
  const cursorDotRef       = useRef(null)
  const cursorRingRef      = useRef(null)
  const konamiSeq          = useRef([])
  const konamiParticlesRef = useRef([])
  const konamiCanvasRef    = useRef(null)
  const konamiAnimRef      = useRef(null)
  const dustPuffRef        = useRef([])
  const dustAnimRef        = useRef(null)

  const spawnDustPuff = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Spawn from spine area — roughly center-left of viewport
    const bookEl = document.getElementById('book')
    const spineX = bookEl ? bookEl.getBoundingClientRect().left + 28 : window.innerWidth * 0.28
    const bookTop = bookEl ? bookEl.getBoundingClientRect().top : window.innerHeight * 0.1
    const bookH   = bookEl ? bookEl.getBoundingClientRect().height : window.innerHeight * 0.8
    const DUST_COLORS = ['rgba(196,152,30,.7)','rgba(220,180,80,.5)','rgba(244,234,213,.4)','rgba(160,120,20,.6)']
    for (let i = 0; i < 22; i++) {
      const y = bookTop + Math.random() * bookH
      dustPuffRef.current.push({
        x: spineX + Math.random() * 18,
        y,
        r: Math.random() * 3.5 + 0.8,
        vx: (Math.random() - 0.3) * 2.5,
        vy: -(Math.random() * 2.2 + 0.5),
        alpha: Math.random() * 0.6 + 0.2,
        decay: Math.random() * 0.018 + 0.010,
        life: 0,
        color: DUST_COLORS[Math.floor(Math.random() * DUST_COLORS.length)],
      })
    }
    const ctx = canvas.getContext('2d')
    const animate = () => {
      const alive = dustPuffRef.current.filter(p => p.life < 1)
      if (alive.length === 0) { dustAnimRef.current = null; return }
      alive.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.97
        p.life += p.decay
        const fade = 1 - p.life
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (1 + p.life * 0.8), 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${parseFloat(p.color.match(/[\d.]+\)$/)?.[0] ?? '0.5') * fade})`)
        ctx.fill()
      })
      dustPuffRef.current = alive
      dustAnimRef.current = requestAnimationFrame(animate)
    }
    if (!dustAnimRef.current) dustAnimRef.current = requestAnimationFrame(animate)
  }, [])

  const fireKonamiParticles = useCallback(() => {
    const canvas = konamiCanvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')

    // Spawn ink explosion particles from center
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const particles = []
    const COLORS = ['#d4a820','#b5890f','#9b1c1c','#f4ead5','#c4431a','#e8d5b0','#fff8e7']

    // Big ink splatter burst
    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + Math.random() * 0.3
      const speed = Math.random() * 18 + 4
      const size = Math.random() * 6 + 1
      particles.push({
        x: cx + (Math.random()-0.5)*40,
        y: cy + (Math.random()-0.5)*40,
        vx: Math.cos(angle) * speed * (0.5 + Math.random()),
        vy: Math.sin(angle) * speed * (0.5 + Math.random()) - Math.random()*6,
        r: size,
        alpha: 1,
        color: COLORS[Math.floor(Math.random()*COLORS.length)],
        gravity: 0.25 + Math.random()*0.2,
        decay: 0.012 + Math.random()*0.01,
        splat: false,
        splatted: false,
        ink: Math.random() > 0.5,
      })
    }
    // Extra glitter stars
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 25 + 8
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 10,
        r: Math.random() * 3 + 1,
        alpha: 1,
        color: '#d4a820',
        gravity: 0.15,
        decay: 0.008,
        star: true,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random()-0.5) * 0.3,
      })
    }
    konamiParticlesRef.current = particles

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const alive = konamiParticlesRef.current.filter(p => p.alpha > 0.02)
      if (alive.length === 0) return

      alive.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= 0.98
        p.alpha -= p.decay
        if (p.alpha < 0) p.alpha = 0

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)

        if (p.star) {
          // Draw 5-point star
          ctx.translate(p.x, p.y)
          p.rotation += p.rotSpeed
          ctx.rotate(p.rotation)
          ctx.beginPath()
          for (let i = 0; i < 5; i++) {
            const a = (i * Math.PI * 2) / 5 - Math.PI/2
            const b = a + Math.PI / 5
            if (i === 0) ctx.moveTo(Math.cos(a)*p.r*2.5, Math.sin(a)*p.r*2.5)
            else ctx.lineTo(Math.cos(a)*p.r*2.5, Math.sin(a)*p.r*2.5)
            ctx.lineTo(Math.cos(b)*p.r, Math.sin(b)*p.r)
          }
          ctx.closePath()
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 8
          ctx.fill()
        } else if (p.ink) {
          // Ink splatter drop
          ctx.beginPath()
          ctx.ellipse(p.x, p.y, p.r * (1 + Math.abs(p.vx)*0.05), p.r, Math.atan2(p.vy, p.vx), 0, Math.PI*2)
          ctx.fillStyle = p.color
          ctx.shadowColor = p.color
          ctx.shadowBlur = 4
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
          ctx.fillStyle = p.color
          ctx.fill()
        }
        ctx.restore()
      })

      konamiParticlesRef.current = alive
      konamiAnimRef.current = requestAnimationFrame(draw)
    }
    cancelAnimationFrame(konamiAnimRef.current)
    draw()
  }, [])

  const triggerKonami = useCallback(() => {
    setKonamiActive(true)
    setKonamiPhase(1)
    setTimeout(() => { fireKonamiParticles(); setKonamiPhase(2) }, 80)
    setTimeout(() => setKonamiPhase(3), 600)
    setTimeout(() => { setKonamiActive(false); setKonamiPhase(0); cancelAnimationFrame(konamiAnimRef.current) }, 5500)
  }, [fireKonamiParticles])

  // Mobile secret: tap the MIY monogram 7 times quickly
  const handleSecretTap = useCallback(() => {
    clearTimeout(secretTapTimer.current)
    setSecretTapCount(c => {
      const next = c + 1
      if (next >= 7) {
        setSecretTapCount(0)
        triggerKonami()
        return 0
      }
      secretTapTimer.current = setTimeout(() => setSecretTapCount(0), 2000)
      return next
    })
  }, [triggerKonami])

  useEffect(() => {
    const KONAMI = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a'
    const onKey = (e) => {
      const k = e.key === 'B' ? 'b' : e.key === 'A' ? 'a' : e.key
      konamiSeq.current = [...konamiSeq.current, k].slice(-10)
      if (konamiSeq.current.join(',') === KONAMI) {
        konamiSeq.current = []
        triggerKonami()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [triggerKonami])

  // Animated project navigation — slide out then slide in
  const navigateProject = useCallback((nextIdx) => {
    if (nextIdx === selectedProject) return
    const goingForward = nextIdx > selectedProject
    const dir = goingForward ? 'out-left' : 'out-right'
    setDetailTransition(dir)
    setTimeout(() => {
      setFlipInDir(goingForward ? 'forward' : 'backward')
      setSelectedProject(nextIdx)
      setDetailTransition('in')
      if (rightScrollRef.current) rightScrollRef.current.scrollTop = 0
    }, isMobile ? 260 : 410)
  }, [selectedProject, isMobile])

  // Open project with reset scroll + transition
  const openProject = useCallback((idx) => {
    setDetailTransition('in')
    setSelectedProject(idx)
    setTimeout(() => { if (rightScrollRef.current) rightScrollRef.current.scrollTop = 0 }, 50)
  }, [])

  const trigCounters = useCallback(() => {
    setTimeout(() => {
      document.querySelectorAll('[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target)
        const suf = el.dataset.suf || ''
        let cur = 0
        const step = Math.max(1, Math.ceil(target / 50))
        const t = setInterval(() => {
          cur += step
          if (cur >= target) { cur = target; clearInterval(t) }
          el.textContent = cur + suf
        }, 22)
      })
    }, 600)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    try {
      const key = 'portfolio_visit_count'
      const v = parseInt(localStorage.getItem(key) || '0') + 1
      localStorage.setItem(key, v)
      setVisitCount(v)
    } catch(e) {}
  }, [])

  // Opening book animation — timer + scroll to open
  const openBook = useCallback(() => {
    if (introPhase === 'opening' || introPhase === 'done') return
    setIntroPhase('opening')
    setTimeout(() => setIntroPhase('done'), 900)
  }, [introPhase])

  useEffect(() => {
    // Show intro content after short delay
    const tReady = setTimeout(() => setIntroPhase('ready'), 300)

    // Countdown timer 5 → 0, then auto-open
    let count = 5
    setIntroTimer(count)
    const interval = setInterval(() => {
      count -= 1
      setIntroTimer(count)
      if (count <= 0) {
        clearInterval(interval)
        openBook()
      }
    }, 1000)

    // Scroll / wheel / touch to open early
    const onWheel = (e) => { if (e.deltaY > 0) openBook() }
    const onTouchStart = (e) => { e._startY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      const dy = (e._startY || 0) - e.changedTouches[0].clientY
      if (dy > 30) openBook()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      clearTimeout(tReady)
      clearInterval(interval)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSectionVisible(false)
    const t = setTimeout(() => setSectionVisible(true), 80)
    if (current !== 'projects') setSelectedProject(null)
    return () => clearTimeout(t)
  }, [current])

  useEffect(() => {
    const el = rightScrollRef.current
    if (!el) return
    const onScroll = () => {
      const pct = el.scrollHeight <= el.clientHeight ? 0
        : Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
      setScrollPct(pct)
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [current])

  const playFlipSound = useCallback(() => {
    if (!soundOn) return
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
      const ctx = audioCtx.current
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.45, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate
        const env = Math.sin(Math.PI * t / 0.45) * Math.pow(1 - t / 0.45, 1.5)
        data[i] = (Math.random() * 2 - 1) * env * 0.18
      }
      const src = ctx.createBufferSource()
      const filt = ctx.createBiquadFilter()
      filt.type = 'bandpass'
      filt.frequency.setValueAtTime(2200, ctx.currentTime)
      filt.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.45)
      filt.Q.value = 0.8
      src.buffer = buf; src.connect(filt); filt.connect(ctx.destination); src.start()
    } catch(e) {}
  }, [soundOn])

  const FLIP_QUOTES = [
    '"A page turned is a life changed."',
    '"Every chapter holds a new beginning."',
    '"In the turning of pages, wisdom grows."',
    '"The next page awaits — turn with purpose."',
    '"Each leaf of parchment tells a story."',
    '"Forward ever, backward never."',
    '"The greatest chapters are yet unwritten."',
    '"Curiosity is the compass of great minds."',
  ]

  const gotoChapter = useCallback((id) => {
    if (id === current || flipping.current) return
    flipping.current = true
    setIsFlipping(true)
    setMobileMenuOpen(false)
    playFlipSound()
    spawnDustPuff()
    const q = FLIP_QUOTES[Math.floor(Math.random() * FLIP_QUOTES.length)]
    setFlipQuote(q); setShowQuote(true)
    setTimeout(() => setShowQuote(false), 900)
    const curIdx = CHAPTER_ORDER.indexOf(current)
    const newIdx = CHAPTER_ORDER.indexOf(id)
    setFlipDir(newIdx > curIdx ? 'forward' : 'backward')
    setTimeout(() => {
      setCurrent(id)
      setPageNums({ l: CHAPTERS[id].pageL, r: CHAPTERS[id].pageR })
      if (rightScrollRef.current) rightScrollRef.current.scrollTop = 0
      if (id === 'home') trigCounters()
    }, 620)
    setTimeout(() => { setIsFlipping(false); flipping.current = false }, 1300)
  }, [current, trigCounters, playFlipSound, spawnDustPuff])

  useEffect(() => {
    const onKey = (e) => {
      if (lbOpen) {
        if (e.key === 'Escape') setLbOpen(false)
        if (e.key === 'ArrowLeft') setLbIdx(i => (i - 1 + lbImgs.length) % lbImgs.length)
        if (e.key === 'ArrowRight') setLbIdx(i => (i + 1) % lbImgs.length)
        return
      }
      if (e.key === 'ArrowRight') { const idx = CHAPTER_ORDER.indexOf(current); if (idx < CHAPTER_ORDER.length-1) gotoChapter(CHAPTER_ORDER[idx+1]) }
      if (e.key === 'ArrowLeft')  { const idx = CHAPTER_ORDER.indexOf(current); if (idx > 0) gotoChapter(CHAPTER_ORDER[idx-1]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lbOpen, lbImgs.length, current, gotoChapter])

  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init ambient dust particles
    const COUNT = 55
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 1.4 + 0.3,
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    -(Math.random() * 0.25 + 0.08),
      alpha: Math.random() * 0.35 + 0.05,
      life:  Math.random(),
    }))

    // Ink drop trail from cursor
    const inkDrops = []
    let lastMx = 0, lastMy = 0
    const spawnInk = (e) => {
      const dx = e.clientX - lastMx, dy = e.clientY - lastMy
      const dist = Math.hypot(dx,dy)
      if (dist < 10) return
      lastMx = e.clientX; lastMy = e.clientY
      if (inkDrops.length > 36) inkDrops.shift()
      // Main drop
      inkDrops.push({
        x: e.clientX, y: e.clientY,
        r: Math.random() * 3.0 + 1.2,
        alpha: Math.random() * 0.52 + 0.25,
        life: 0,
        decay: Math.random() * 0.013 + 0.008,
        vx: (Math.random()-.5)*0.5,
        vy: Math.random()*0.6 + 0.18,
      })
      // Occasional micro-splatter when moving fast
      if (dist > 22 && Math.random() > 0.55) {
        for (let s = 0; s < 2; s++) {
          inkDrops.push({
            x: e.clientX + (Math.random()-.5)*16,
            y: e.clientY + (Math.random()-.5)*16,
            r: Math.random() * 1.4 + 0.4,
            alpha: Math.random() * 0.28 + 0.10,
            life: 0,
            decay: Math.random() * 0.022 + 0.016,
            vx: (Math.random()-.5)*1.2,
            vy: Math.random()*0.9 + 0.25,
          })
        }
      }
    }
    window.addEventListener('mousemove', spawnInk)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Ink drops — fall with gravity, fade out
      for (let i = inkDrops.length - 1; i >= 0; i--) {
        const d = inkDrops[i]
        d.life += d.decay
        d.x += d.vx
        d.y += d.vy
        d.vy += 0.04
        d.vx *= 0.985
        const fade = Math.max(0, 1 - d.life)
        ctx.beginPath()
        ctx.ellipse(d.x, d.y, d.r * (1 + d.life*.5), d.r * (1 - d.life*.15), Math.atan2(d.vy, d.vx), 0, Math.PI*2)
        ctx.fillStyle = `rgba(158,102,8,${d.alpha * fade * .72})`
        ctx.shadowColor = `rgba(120,70,5,${d.alpha * fade * .3})`
        ctx.shadowBlur = d.r * 1.5
        ctx.fill()
        ctx.shadowBlur = 0
        if (d.life >= 1) inkDrops.splice(i, 1)
      }

      // Ambient dust
      particlesRef.current.forEach(p => {
        p.x    += p.vx
        p.y    += p.vy
        p.life += 0.003
        if (p.life > 1 || p.y < -10) {
          p.x    = Math.random() * canvas.width
          p.y    = canvas.height + 5
          p.life = 0
          p.alpha = Math.random() * 0.35 + 0.05
        }
        const fade = Math.sin(p.life * Math.PI)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(196,152,30,${p.alpha * fade})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', spawnInk)
    }
  }, [])

  useEffect(() => { trigCounters() }, [trigCounters])

  // Custom cursor tracking
  useEffect(() => {
    const dot  = cursorDotRef.current
    const ring = cursorRingRef.current
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let raf

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      dot.style.left  = mx + 'px'
      dot.style.top   = my + 'px'
    }
    const animate = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(animate)
    }
    const onEnter = () => { dot.classList.add('hovering'); ring.classList.add('hovering') }
    const onLeave = () => { dot.classList.remove('hovering'); ring.classList.remove('hovering') }

    window.addEventListener('mousemove', onMove)
    const hoverEls = Array.from(document.querySelectorAll('a,button,[role="button"]'))
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  // Hover preview handlers
  const handleLinkEnter = (e, url) => {
    const rect = e.target.getBoundingClientRect()
    setPreviewUrl(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`)
    setPreviewPos({ x: Math.min(rect.left, window.innerWidth - 220), y: rect.top - 145 })
  }
  const handleLinkLeave = () => setPreviewUrl(null)

  const openLB = (imgs, title, startIdx = 0) => {
    const normalized = imgs.map(i => {
      if (typeof i === 'object') {
        const src = i.src.startsWith('http') || i.src.startsWith('/') ? i.src : '/'+i.src
        return { src, type: i.type||'image', title: i.title||title, cap: i.caption||i.cap||'' }
      }
      const src = i.startsWith('http') || i.startsWith('/') ? i : '/'+i
      return { src, type:'image', title, cap: '' }
    })
    setLbImgs(normalized); setLbIdx(startIdx); setLbOpen(true)
  }

  const doSubmit = async (e) => {
    e.preventDefault(); setFormSending(true); setFormError(false)
    const data = new FormData(e.target)
    data.append('_replyto', data.get('email'))
    try {
      const res = await fetch('https://formspree.io/f/mbdzdorp', { method:'POST', body:data, headers:{ Accept:'application/json' } })
      if (res.ok) { setFormSent(true); e.target.reset(); setTimeout(() => setFormSent(false), 6000) }
      else { setFormError(true); setTimeout(() => setFormError(false), 4000) }
    } catch { setFormError(true); setTimeout(() => setFormError(false), 4000) }
    setFormSending(false)
  }

  const flipStyle = isFlipping ? { animation: `${flipDir==='forward'?'flipForward':'flipBackward'} 1.25s cubic-bezier(0.22,1,0.36,1) forwards` } : {}

  return (
    <>
      <Head>
        <title>Muhamad Irpan Yasin — Sales · Finance · Data Analysis Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`

          /* ====================================================
             UPGRADED 3D PAGE FLIP SYSTEM
             - perspective on parent wrapper, not per-keyframe
             - dramatic pause at 90° (page standing upright)
             - backface: dark paper texture visible mid-flip
             - progressive curl shadow that peaks at 90°
             - shimmer highlight sweeps across page surface
             ==================================================== */

          /* Wrapper gives stable perspective context */
          .flip-wrapper {
            position:absolute; inset:0;
            perspective:1800px;
            perspective-origin:0% 50%;
            pointer-events:none; z-index:40;
            overflow:visible;
          }

          @keyframes flipForward {
            0%   {
              transform: rotateY(0deg) translateZ(0);
              box-shadow: 2px 0 8px rgba(0,0,0,.1);
              filter: brightness(1);
            }
            12%  {
              transform: rotateY(-18deg) translateZ(2px);
              box-shadow: 12px 0 40px rgba(0,0,0,.32), 0 4px 20px rgba(0,0,0,.2);
              filter: brightness(0.97);
            }
            /* Acceleration into the flip */
            38%  {
              transform: rotateY(-72deg) translateZ(18px);
              box-shadow: 28px 0 70px rgba(0,0,0,.50), 0 8px 30px rgba(0,0,0,.3);
              filter: brightness(0.88);
            }
            /* DRAMATIC PAUSE — page standing upright at 90° */
            46%  {
              transform: rotateY(-90deg) translateZ(22px);
              box-shadow: 32px 0 80px rgba(0,0,0,.58), 0 10px 35px rgba(0,0,0,.35);
              filter: brightness(0.72);
            }
            54%  {
              transform: rotateY(-90deg) translateZ(22px);
              box-shadow: 32px 0 80px rgba(0,0,0,.58), 0 10px 35px rgba(0,0,0,.35);
              filter: brightness(0.68);
            }
            /* Decelerate landing */
            70%  {
              transform: rotateY(-118deg) translateZ(14px);
              box-shadow: 18px 0 50px rgba(0,0,0,.38), 0 6px 22px rgba(0,0,0,.22);
              filter: brightness(0.82);
            }
            88%  {
              transform: rotateY(-162deg) translateZ(4px);
              box-shadow: 5px 0 20px rgba(0,0,0,.18);
              filter: brightness(0.93);
              opacity: .85;
            }
            100% {
              transform: rotateY(-180deg) translateZ(0);
              box-shadow: none;
              filter: brightness(1);
              opacity: 0;
            }
          }

          @keyframes flipBackward {
            0%   {
              transform: rotateY(-180deg) translateZ(0);
              box-shadow: none;
              filter: brightness(1);
              opacity: 0;
            }
            12%  {
              transform: rotateY(-162deg) translateZ(4px);
              box-shadow: 5px 0 20px rgba(0,0,0,.18);
              filter: brightness(0.93);
              opacity: .85;
            }
            30%  {
              transform: rotateY(-118deg) translateZ(14px);
              box-shadow: 18px 0 50px rgba(0,0,0,.38), 0 6px 22px rgba(0,0,0,.22);
              filter: brightness(0.82);
              opacity: 1;
            }
            /* DRAMATIC PAUSE — page standing upright at 90° */
            46%  {
              transform: rotateY(-90deg) translateZ(22px);
              box-shadow: 32px 0 80px rgba(0,0,0,.58), 0 10px 35px rgba(0,0,0,.35);
              filter: brightness(0.68);
            }
            54%  {
              transform: rotateY(-90deg) translateZ(22px);
              box-shadow: 32px 0 80px rgba(0,0,0,.58), 0 10px 35px rgba(0,0,0,.35);
              filter: brightness(0.72);
            }
            62%  {
              transform: rotateY(-72deg) translateZ(18px);
              box-shadow: 28px 0 70px rgba(0,0,0,.50), 0 8px 30px rgba(0,0,0,.3);
              filter: brightness(0.88);
            }
            88%  {
              transform: rotateY(-18deg) translateZ(2px);
              box-shadow: 12px 0 40px rgba(0,0,0,.32), 0 4px 20px rgba(0,0,0,.2);
              filter: brightness(0.97);
            }
            100% {
              transform: rotateY(0deg) translateZ(0);
              box-shadow: 2px 0 8px rgba(0,0,0,.1);
              filter: brightness(1);
            }
          }

          /* Shimmer sweep that plays once at start of flip */
          @keyframes pageShimmer {
            0%   { opacity:0; left:-120%; }
            15%  { opacity:1; }
            55%  { opacity:0.6; left:160%; }
            100% { opacity:0; left:160%; }
          }

          /* Backface paper — visible when page is > 90° through flip */
          @keyframes backfaceReveal {
            0%,44% { opacity:0; }
            50%     { opacity:1; }
            100%    { opacity:1; }
          }

          .flip-leaf {
            position:absolute; top:0; left:0; right:0; bottom:0;
            transform-origin:left center;
            transform-style:preserve-3d;
            pointer-events:none;
            background:linear-gradient(108deg,#ddc898 0%,#f4ead5 30%,#efe3c6 58%,#e5d4a4 85%,#dcc58e 100%);
            will-change:transform,filter,box-shadow;
          }

          /* Front face — parchment grain + page-crease shadow */
          .flip-leaf::before {
            content:'';
            position:absolute; inset:0;
            background:
              /* left binding shadow */
              linear-gradient(90deg,
                rgba(0,0,0,.28) 0%,
                rgba(0,0,0,.10) 8%,
                rgba(255,248,230,.20) 18%,
                transparent 35%,
                /* center fold highlight */
                rgba(255,255,230,.08) 48%,
                transparent 55%,
                /* right edge ambient */
                rgba(0,0,0,.04) 80%,
                rgba(0,0,0,.14) 100%
              );
            pointer-events:none; z-index:2;
          }

          /* Shimmer highlight sweep */
          .flip-leaf-shimmer {
            position:absolute; top:0; bottom:0; width:35%;
            background:linear-gradient(105deg,
              transparent 0%,
              rgba(255,250,220,.08) 20%,
              rgba(255,248,210,.32) 50%,
              rgba(255,250,220,.08) 80%,
              transparent 100%
            );
            pointer-events:none; z-index:3;
            animation: pageShimmer 1.15s cubic-bezier(.4,0,.6,1) forwards;
          }

          /* Grain texture */
          .flip-leaf-grain {
            position:absolute; inset:0;
            background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");
            opacity:.55; pointer-events:none; z-index:1;
          }

          /* Backface — the underside of the page, aged paper */
          .flip-leaf-back {
            position:absolute; inset:0;
            background:linear-gradient(108deg,#cbb882 0%,#e0ceac 40%,#d8c49a 100%);
            backface-visibility:visible;
            pointer-events:none; z-index:4;
            animation: backfaceReveal 1.15s forwards;
          }
          .flip-leaf-back::before {
            content:'';
            position:absolute; inset:0;
            background:
              linear-gradient(90deg,
                rgba(0,0,0,.18) 0%,
                rgba(0,0,0,.06) 12%,
                transparent 30%,
                rgba(255,248,200,.06) 55%,
                transparent 70%,
                rgba(0,0,0,.10) 100%
              );
          }
          @keyframes quillBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
          @keyframes quoteFlash { 0%{opacity:0;transform:scale(.96)} 20%{opacity:1;transform:scale(1)} 75%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.02)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          @keyframes otwPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
          .intro-opening #book { animation: bookOpen .9s cubic-bezier(.16,1,.3,1) .15s both; }
          @keyframes bookOpen { from{opacity:0;transform:rotateX(8deg) scale(.92)} to{opacity:1;transform:rotateX(2deg) scale(1)} }
          .intro-done #book { opacity:1; transform:rotateX(2deg); }
          @keyframes konamiReveal { from{opacity:0} to{opacity:1} }
          @keyframes konamiText { from{opacity:0;transform:translateY(20px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes konamiFlash { 0%{opacity:0} 30%{opacity:1} 100%{opacity:0} }
          @keyframes konamiBadge { from{opacity:0;transform:scale(.5) rotate(-12deg)} to{opacity:1;transform:scale(1) rotate(0deg)} }
          @keyframes konamiKeyReveal { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes candleBlow {
            0%   { opacity:0; transform:scale(1); }
            25%  { opacity:1; transform:scale(1.4); filter:brightness(1.8); }
            60%  { opacity:.7; transform:scale(1.8); filter:brightness(.4); }
            100% { opacity:0; transform:scale(2.2); filter:brightness(0); }
          }
          @keyframes candleLight {
            0%   { opacity:0; transform:scale(2); filter:brightness(0); }
            30%  { opacity:1; transform:scale(1.6); filter:brightness(2.5); }
            70%  { opacity:.6; transform:scale(1.2); filter:brightness(1.2); }
            100% { opacity:0; transform:scale(1);   filter:brightness(1); }
          }
        `}</style>
      </Head>

      <div id="book-scene" className={[
        darkMode ? 'dark-mode' : '',
        `intro-${introPhase}`,
        konamiActive ? 'konami-mode' : '',
      ].filter(Boolean).join(' ')}>

      {/* Candle blow transition overlay */}
      {darkTransition && (
        <div style={{
          position:'fixed', inset:0, zIndex:99980, pointerEvents:'none',
          background: darkTransition==='todark'
            ? 'radial-gradient(ellipse at 50% 40%, rgba(255,200,80,.18) 0%, rgba(10,5,0,.0) 40%)'
            : 'radial-gradient(ellipse at 50% 40%, rgba(255,230,150,.35) 0%, rgba(10,5,0,.0) 60%)',
          animation: darkTransition==='todark' ? 'candleBlow .42s ease-out forwards' : 'candleLight .42s ease-out forwards',
        }}/>
      )}

      {/* Intro overlay — candle-light curtain */}
      {introPhase !== 'done' && (
        <div
          className={`intro-curtain${introPhase === 'opening' ? ' opening' : ''}`}
          onClick={openBook}
          style={{cursor: introPhase === 'ready' ? 'pointer' : 'default'}}
        >
          <div className="intro-curtain-inner">
            <div className="intro-welcome">— Welcome to my journey —</div>
            <div className="intro-monogram">MIY</div>
            <div className="intro-title">Muhamad Irpan Yasin</div>
            <div className="intro-subtitle">— Portfolio —</div>
            <div className="intro-journey">
              "A life's work, bound between these pages."
            </div>
            <div className="intro-ornament">✦ · · · ✦ · · · ✦</div>

            {/* Timer + scroll hint */}
            {introPhase === 'ready' && (
              <div className="intro-open-row">
                {/* Circular countdown */}
                <div className="intro-timer-wrap">
                  <svg className="intro-timer-svg" viewBox="0 0 44 44">
                    <circle className="intro-timer-track" cx="22" cy="22" r="18" />
                    <circle
                      className="intro-timer-ring"
                      cx="22" cy="22" r="18"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 18}`,
                        strokeDashoffset: `${2 * Math.PI * 18 * (1 - introTimer / 5)}`,
                        transition: introTimer < 5 ? 'stroke-dashoffset 1s linear' : 'none',
                      }}
                    />
                  </svg>
                  <span className="intro-timer-num">{introTimer}</span>
                </div>

                <div className="intro-open-cta">
                  <div className="intro-open-label">scroll or click to open</div>
                  <div className="intro-scroll-arrow">
                    <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
                      <rect x="1" y="1" width="12" height="20" rx="6" stroke="rgba(181,137,15,.4)" strokeWidth="1.2"/>
                      <circle className="intro-scroll-dot" cx="7" cy="6" r="2" fill="rgba(181,137,15,.7)"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          {introPhase !== 'ready' && <div className="intro-hint">opening the book…</div>}
        </div>
      )}

      {/* Atmospheric vignette corners */}
      <div className="scene-vignette" />
      <div className="scene-candle scene-candle-l" />
      <div className="scene-candle scene-candle-r" />

      {/* Particle dust canvas */}
      <canvas ref={canvasRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}} />

      {/* Custom cursor — quill dot + ring */}
      <div ref={cursorDotRef}  className="cursor-dot"  />
      <div ref={cursorRingRef} className="cursor-ring" />

      {/* Hover preview popup */}
      {previewUrl && (
        <div style={{
          position:'fixed', left: previewPos.x, top: previewPos.y,
          width:'200px', height:'130px',
          zIndex:200, pointerEvents:'none',
          border:'2px solid rgba(139,105,20,.5)',
          boxShadow:'0 8px 32px rgba(0,0,0,.6)',
          background:'#1a1005',
          overflow:'hidden',
          animation:'fadeUp .2s ease both',
        }}>
          <img src={previewUrl} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover',opacity:.9}} onError={e => e.target.style.display='none'} />
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'.25rem .4rem',background:'rgba(10,5,0,.8)',fontFamily:'var(--display)',fontSize:'.38rem',letterSpacing:'.08em',color:'rgba(196,152,30,.8)',textTransform:'uppercase'}}>Preview</div>
        </div>
      )}


        <div id="book">

          {/* SPINE — dengan chapter indicator marker bergerak */}
          <div id="spine">
            {[
              {id:'home',      pct: 7  },
              {id:'portfolio', pct: 21 },
              {id:'projects',  pct: 35 },
              {id:'skills',    pct: 50 },
              {id:'social',    pct: 64 },
              {id:'travel',    pct: 78 },
              {id:'contact',   pct: 92 },
            ].map(ch => (
              <div
                key={ch.id}
                className={`spine-tick${current===ch.id?' active-tick':''}`}
                style={{top:`${ch.pct}%`}}
              />
            ))}
            <div
              className="spine-marker"
              style={{top:`${[
                {id:'home',pct:7},{id:'portfolio',pct:21},{id:'projects',pct:35},
                {id:'skills',pct:50},{id:'social',pct:64},{id:'travel',pct:78},{id:'contact',pct:92}
              ].find(c=>c.id===current)?.pct ?? 7}%`}}
            />
          </div>

          {/* LEFT PAGE */}
          <div id="page-left">
            <div className="left-inner">
              <div className="book-monogram" onClick={handleSecretTap} style={{cursor: current==='home' ? 'default':'pointer', userSelect:'none'}}>MIY</div>
              <div className="book-author-name">M. Irpan Yasin</div>
              {/* Secret tap progress indicator — subtle dots */}
              {secretTapCount > 0 && (
                <div style={{display:'flex',gap:'.18rem',justifyContent:'center',marginBottom:'.1rem'}}>
                  {Array.from({length:7}).map((_,i) => (
                    <div key={i} style={{
                      width:'4px',height:'4px',borderRadius:'50%',
                      background: i < secretTapCount ? 'rgba(212,168,32,.8)' : 'rgba(181,137,15,.18)',
                      transition:'background .15s',
                    }}/>
                  ))}
                </div>
              )}
              <div className="ornament shimmer-ornament">— ✦ —</div>

              {current === 'projects' ? (
                <>
                  <div className="toc-label" style={{fontSize:'.52rem',letterSpacing:'.22em'}}>Index of Projects</div>
                  <div className="ornament" style={{fontSize:'.65rem',marginBottom:'.6rem'}}>· · · · · · · · · ·</div>
                  <nav className="chapter-list project-index-list">
                    {PROJECTS_DATA.map((p, i) => (
                      <button
                        key={p.num}
                        className={`chapter-btn project-index-btn${selectedProject === i ? ' active' : ''}`}
                        onClick={() => openProject(i)}
                        style={{animationDelay:`${i*0.06}s`}}
                      >
                        <span className="ch-num" style={{color:'var(--red)',fontSize:'.42rem'}}>{p.num}</span>
                        <span className="ch-title" style={{fontSize:'.7rem',lineHeight:1.2}}>{p.title}</span>
                        {selectedProject === i && <span style={{marginLeft:'auto',color:'var(--gold)',fontSize:'.65rem'}}>◆</span>}
                      </button>
                    ))}
                  </nav>
                  <div className="project-index-hint">
                    <span style={{fontFamily:'var(--fell)',fontStyle:'italic',fontSize:'.72rem',color:'var(--ink3)'}}>
                      ← Click to view detail
                    </span>
                  </div>
                  <div className="left-footer" style={{marginTop:'auto'}}>
                    <div className="ornament" style={{fontSize:'.65rem'}}>· · · · · · · · · ·</div>
                    <button
                      className="chapter-btn"
                      style={{borderTop:'none',padding:'.3rem 0',opacity:.7}}
                      onClick={() => gotoChapter('portfolio')}
                    >
                      <span className="ch-num">←</span>
                      <span className="ch-title" style={{fontSize:'.62rem'}}>Back to Portfolio</span>
                    </button>
                    <div className="page-num-left">{pageNums.l}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="toc-label">Table of Contents</div>
                  <div className="ornament" style={{fontSize:'.65rem',marginBottom:'.6rem'}}>· · · · · · · · · ·</div>
                  <nav className="chapter-list">
                    {[
                      {id:'home',      num:'I',    title:'Preface',            page:1  },
                      {id:'portfolio', num:'II',   title:'Portfolio',          page:7  },
                      {id:'projects',  num:'III',  title:'Projects',           page:14 },
                      {id:'skills',    num:'IV',   title:'Skills & Expertise', page:21 },
                      {id:'social',    num:'V',    title:'Social Experience',  page:28 },
                      {id:'travel',    num:'VI',   title:'Travel Gallery',     page:35 },
                      {id:'contact',   num:'VII',  title:'Correspondence',     page:42 },
                    ].map(ch => (
                      <button key={ch.id} className={`chapter-btn${current===ch.id?' active':''}`} onClick={() => gotoChapter(ch.id)}>
                        <span className="ch-num">{ch.num}</span>
                        <span className="ch-title">{ch.title}</span>
                        <span className="ch-dots" />
                        <span className="ch-page">{ch.page}</span>
                      </button>
                    ))}
                  </nav>
                  <div className="kbd-hint"><span className="kbd-key">←</span><span className="kbd-key">→</span> navigate</div>
                  <div className="left-footer">
                    <div className="ornament" style={{fontSize:'.65rem'}}>· · · · · · · · · ·</div>
                    <div className="page-num-left">{pageNums.l}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div id="page-right" style={{position:'relative'}}>
            {isFlipping && !isMobile && (
              <div className="flip-wrapper">
                <div className="flip-leaf" ref={leafRef} style={flipStyle}>
                  <div className="flip-leaf-grain" />
                  <div className="flip-leaf-shimmer" />
                  <div className="flip-leaf-back" />
                </div>
              </div>
            )}

            {/* Chapter ribbon — decorative progress */}
            <div className="chapter-ribbon-wrap">
              <div className="chapter-ribbon-track" />
              <div
                className="chapter-ribbon-fill"
                style={{width:`${((CHAPTER_ORDER.indexOf(current)+1)/CHAPTER_ORDER.length)*100}%`}}
              />
              <div className="chapter-ribbon-label">
                {CHAPTERS[current].numRoman} · {CHAPTERS[current].title}
              </div>
            </div>

            <div className="right-inner" id="right-scroll" ref={rightScrollRef} style={{opacity:sectionVisible?1:0,transition:'opacity .35s ease'}}>

              {/* ===== HOME ===== */}
              <div className={`content-section${current==='home'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter I</span>
                  <h1 className="ch-heading-title">Preface <em>&amp; Introduction</em></h1>
                </div>
                <div className="home-spread">
                  <div>
                    <p className="book-p dropcap">
                      <strong>Muhamad Irpan Yasin</strong> is a versatile and accomplished professional hailing from Bandung, West Java, Indonesia — a man of many disciplines, whose career has traversed the varied landscapes of Sales Management, Administration, Data Analysis, and Tax Management.
                    </p>
                    <p className="book-p">
                      With more than <strong>fifteen years</strong> of comprehensive professional experience, he has cultivated a rare breadth of expertise spanning diverse industries. His proven track record speaks of results delivered, teams led with purpose, and administrative excellence achieved across every endeavour.
                    </p>
                    <div className="book-h3">Vital Statistics</div>
                    <div className="stats-row">
                      <div className="stat-box"><div className="sn" data-target="15" data-suf="+">0</div><div className="sl">Years Experience</div></div>
                      <div className="stat-box"><div className="sn" data-target="6" data-suf="+">0</div><div className="sl">Positions Held</div></div>
                      <div className="stat-box"><div className="sn" data-target="4">0</div><div className="sl">Tongues Spoken</div></div>
                    </div>
                    <div className="book-h3">Languages of Correspondence</div>
                    <div className="lang-row">
                      {[
                        {code:'ID', flag:'id', lang:'Indonesian', lvl:'Native'},
                        {code:'EN', flag:'gb', lang:'English',    lvl:'Elementary'},
                        {code:'DE', flag:'de', lang:'German',     lvl:'Elementary'},
                        {code:'JP', flag:'jp', lang:'Japanese',   lvl:'Elementary'},
                      ].map(({code,flag,lang,lvl}) => (
                        <div key={code} className="lang-pill">
                          <img src={`https://flagcdn.com/w40/${flag}.png`} alt={lang} width="24" height="16" style={{objectFit:'cover',border:'1px solid rgba(139,105,20,.3)',flexShrink:0}} />
                          <span className="lang-code">{code}</span>
                          <span>{lang}</span>
                          <span className="lv">— {lvl}</span>
                        </div>
                      ))}
                    </div>
                    <div className="open-to-work">
                      <span className="otw-dot"/>
                      <span className="otw-text">Open to Opportunities</span>
                      <span className="otw-sub"> · Full-time · Freelance · Consulting</span>
                    </div>
                    <div className="sec-break">✦ · · · ✦ · · · ✦</div>
                    <p className="book-p" style={{fontStyle:'italic',fontFamily:'var(--fell)',fontSize:'.94rem',textAlign:'center',color:'var(--ink3)',borderLeft:'3px solid rgba(181,137,15,.35)',paddingLeft:'1rem',marginLeft:'.5rem',lineHeight:'1.8'}}>
                      &ldquo;A versatile professional whose experience is matched only by his dedication to excellence in every endeavour.&rdquo;
                    </p>
                    {visitCount > 1 && (
                      <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginTop:'.8rem',padding:'.4rem .7rem',border:'1px solid rgba(181,137,15,.18)',background:'rgba(181,137,15,.04)',width:'fit-content'}}>
                        <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--gold)',boxShadow:'0 0 6px rgba(212,168,32,.6)',flexShrink:0,animation:'otwPulse 2s ease-in-out infinite'}}/>
                        <span style={{fontFamily:'var(--display)',fontSize:'.38rem',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--ink3)'}}>
                          This tome has been opened <strong style={{color:'var(--gold)',fontFamily:'var(--display)'}}>{visitCount.toLocaleString()}</strong> {visitCount===1?'time':'times'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="profile-portrait">
                    <img src="/irvan.jpg" alt="Muhamad Irpan Yasin" onError={e => e.target.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=260&fit=crop&q=80&grayscale'} />
                    <div className="portrait-caption">Muhamad Irpan Yasin<br/>Bandung, West Java<br/><em>Indonesia</em></div>
                    <div className="portrait-socials">
                      <a href="https://www.linkedin.com/in/muhamad-irpan-yasin" target="_blank" rel="noopener" className="psoc-link" title="LinkedIn">in</a>
                      <a href="https://wa.me/6285776077292" target="_blank" rel="noopener" className="psoc-link" title="WhatsApp">wa</a>
                      <a href="mailto:irvansignora@gmail.com" className="psoc-link" title="Email">✉</a>
                    </div>
                  </div>
                </div>
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== PORTFOLIO ===== */}
              <div className={`content-section${current==='portfolio'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter II</span>
                  <h2 className="ch-heading-title">Portfolio <em>of Works</em></h2>
                </div>
                <p className="book-p dropcap">Herein are recorded the principal achievements and key undertakings of the author&apos;s career — selected works that demonstrate mastery across multiple domains, from the sciences of commerce and finance to the analytical arts.</p>
                <div className="sec-break">✦ · · · ✦</div>

                {/* Animated Career Timeline */}
                <div className="career-timeline">
                  {[
                    {num:'§ I',  year:'-', tag:'Data Analysis',         title:'Sales Analytics Dashboard',    desc:'Developed a comprehensive sales tracking system using WordPress, enabling real-time monitoring of team performance and revenue trends across multiple territories.',      tech:['WordPress','Data Analysis','Reporting'],       links:[{href:'/sales-dashboard.html',label:'→ View Dashboard',ext:true}], side:'left'},
                    {num:'§ II', year:'-', tag:'Tax Management',         title:'Tax Performance & Compliance', desc:'Managing VAT, income tax, and multi-branch reporting across corporate entities with data-driven accuracy — ensuring full regulatory compliance at all times.',              tech:['Tax Reporting','Compliance','Reconciliation'],  links:[{href:'/tax-dashboard.html',label:'→ View Dashboard',ext:true}], side:'right', onGallery:false},
                    {num:'§ III',year:'-', tag:'Sales Leadership',       title:'Sales Team Development',       desc:'Successfully supervised and trained multiple sales teams, consistently achieving and exceeding quarterly targets through effective coaching and strategic planning.',         tech:['Team Training','Sales Strategy','Performance'],  links:[], side:'left', onGallery:true,galleryImgs:['https://res.cloudinary.com/dyhvx9wit/image/upload/v1772679048/Team_Imoo_p6c38j.jpg','https://res.cloudinary.com/dyhvx9wit/image/upload/v1772685898/20190728_203730_bu8dwi.jpg','https://res.cloudinary.com/dyhvx9wit/image/upload/v1772688847/IMG_20221021_160056_ivbghx.jpg'],galleryTitle:'Sales Team'},
                    {num:'§ IV', year:'-', tag:'Professional Development',title:'Credentials & Recognition',  desc:'A distinguished portfolio of credentials — from Japanese and German language certificates to awards of excellence recognising outstanding contribution to commerce.',       tech:['Certifications','Awards','Achievement'],         links:[], side:'right', onCerts:true},
                    {num:'§ V',  year:'-', tag:'Business Development',   title:'Partner Network Expansion',    desc:'Built and maintained strategic relationships with sales partners, expanding market reach and increasing revenue streams across regions through effective networking.',      tech:['Partnership','Networking','Growth'],             links:[], side:'left', onGallery:true,galleryImgs:['https://res.cloudinary.com/dyhvx9wit/image/upload/v1772687273/20241204_162834_isoiyr.jpg','https://res.cloudinary.com/dyhvx9wit/image/upload/v1772685891/IMG_20190920_193619_pwc6au.jpg','https://res.cloudinary.com/dyhvx9wit/image/upload/v1772685896/IMG20190806091605_ssinhd.jpg'],galleryTitle:'Partner Network'},
                  ].map((item, idx) => (
                    <div key={item.title} className={`tl-entry tl-${item.side} stagger-entry`} style={{animationDelay:`${idx*0.12}s`}}>
                      <div className="tl-year-badge">{item.year}</div>
                      <div className="tl-node"/>
                      <div className="tl-card">
                        <div className="tl-card-header">
                          <span className="porto-num">{item.num}</span>
                          <span className="porto-tag">{item.tag}</span>
                        </div>
                        <div className="porto-title">{item.title}</div>
                        <p className="porto-desc">{item.desc}</p>
                        <div className="porto-tech">{item.tech.map(t => <span key={t} className="porto-pill">{t}</span>)}</div>
                        {(item.links?.length>0||item.onCerts||item.onGallery) && (
                          <div className="porto-links">
                            {item.links?.map(l => <a key={l.label} className="porto-link" href={l.href} target={l.ext?'_blank':undefined} rel="noopener">{l.label}</a>)}
                            {item.onCerts && <button className="porto-link" onClick={() => openLB([{src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772676080/JFT_BASIC_M_Irpan_Yasin_page-0001_crpcof.jpg',title:'Japanese Language',caption:'JFT Certificate'},{src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772676181/Zertifikat_B1_DLMF_page-0001_bhxsts.jpg',title:'German Language',caption:'Deutsch Zertifikat'},{src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772676073/FPUH3_M_Irpan_Yasin_Sertifikat_1_page-0001_hnvkjs.jpg',title:'Hilal Leadership Community',caption:'Excellence Recognition'},{src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772676065/FPUH3_M_Irpan_Yasin_Sertifikat_1_page-0002_k7wyr8.jpg',title:'Hilal Leadership',caption:'Excellence Recognition'},{src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772676174/Mindluster_Certificate_Ms_Excel_page-0001_zd5ccz.jpg',title:'Certificate Excel',caption:'Advanced Excel'},{src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772676077/Auszeichnungsplakette_page-0001_uyed4g.jpg',title:'Award',caption:'Best Employee'}],'Credentials')}>→ View Certificates</button>}
                            {item.onGallery && <button className="porto-link" onClick={() => openLB(item.galleryImgs,item.galleryTitle)}>→ View Gallery</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Timeline spine line */}
                  <div className="tl-spine"/>
                </div>
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== PROJECTS ===== */}
              <div className={`content-section${current==='projects'?' active':''}`}>
                {selectedProject === null ? (
                  <>
                    <div className="ch-heading">
                      <span className="ch-heading-num">Chapter III</span>
                      <h2 className="ch-heading-title">Development Projects <em>— Live &amp; Deployed</em></h2>
                    </div>
                    <p className="book-p dropcap">A collection of digital undertakings — real-world applications conceived, constructed, and launched into the world. Each endeavour addresses a genuine need, from personal finance management to community-focused applications.</p>
                    <div className="sec-break">✦ · · · ✦</div>
                    <p className="book-p" style={{fontFamily:'var(--fell)',fontStyle:'italic',fontSize:'.88rem',color:'var(--ink3)',textAlign:'center',border:'1px solid rgba(181,137,15,.2)',padding:'.8rem 1.2rem',background:'rgba(181,137,15,.03)'}}>
                      ← Select a project from the index on the left to view its full details
                    </p>
                    <div className="projects-preview-grid">
                      {PROJECTS_DATA.map((item, idx) => (
                        <div key={item.title}
                          className="proj-preview-card stagger-entry"
                          style={{animationDelay:`${idx*0.08}s`}}
                          onClick={() => openProject(idx)}
                        >
                          <div className="proj-preview-num">{item.num}</div>
                          <div className="proj-preview-tag">{item.tag}</div>
                          <div className="proj-preview-title">{item.title}</div>
                          <p className="proj-preview-desc">{item.desc.substring(0,100)}…</p>
                          <div className="proj-preview-tech">{item.tech.slice(0,3).map(t=><span key={t} className="porto-pill">{t}</span>)}</div>
                          <div className="proj-preview-open">Open details →</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* PROJECT DETAIL VIEW */
                  (() => {
                    const proj = PROJECTS_DATA[selectedProject]
                    return (
                      <div
                        className="project-detail-page"
                        key={selectedProject}
                        style={{
                          animation: detailTransition === 'in'
                            ? (isMobile
                                ? 'projSlideIn 300ms cubic-bezier(.16,1,.3,1) both'
                                : (flipInDir === 'forward'
                                    ? 'projFlipIn 550ms cubic-bezier(.16,1,.3,1) both'
                                    : 'projFlipInReverse 550ms cubic-bezier(.16,1,.3,1) both'))
                            : detailTransition === 'out-left'
                            ? (isMobile ? 'projSlideOutLeft 250ms cubic-bezier(.4,0,1,1) both' : 'projFlipOut 400ms cubic-bezier(.4,0,1,1) both')
                            : (isMobile ? 'projSlideOutRight 250ms cubic-bezier(.4,0,1,1) both' : 'projFlipOutReverse 400ms cubic-bezier(.4,0,1,1) both'),
                        }}
                      >
                        <div className="proj-detail-back">
                          <button className="proj-back-btn" onClick={() => { setSelectedProject(null); setTimeout(()=>{ if(rightScrollRef.current) rightScrollRef.current.scrollTop=0 },50) }}>
                            ← Back to Overview
                          </button>
                          <span className="proj-detail-status">{proj.status}</span>
                        </div>

                        <div className="proj-detail-header">
                          <div style={{display:'flex',alignItems:'center',gap:'.7rem',marginBottom:'.5rem',flexWrap:'wrap'}}>
                            <span className="porto-num" style={{fontSize:'.6rem'}}>{proj.num}</span>
                            <span className="porto-tag">{proj.tag}</span>
                            <span style={{fontFamily:'var(--display)',fontSize:'.38rem',letterSpacing:'.15em',color:'rgba(181,137,15,.5)',textTransform:'uppercase'}}>{proj.year}</span>
                          </div>
                          <h2 className="ch-heading-title" style={{fontSize:'clamp(1.2rem,2.5vw,1.8rem)',marginBottom:'.3rem'}}>{proj.title}</h2>
                          <p style={{fontFamily:'var(--fell)',fontStyle:'italic',fontSize:'.9rem',color:'var(--ink3)',marginBottom:'0'}}>{proj.subtitle}</p>
                        </div>

                        <div className="proj-detail-divider">✦ · · · ✦</div>

                        <div className="proj-detail-body">
                          <div className="proj-detail-section">
                            <div className="proj-detail-section-label">About this Project</div>
                            <p className="book-p" style={{marginBottom:'.6rem'}}>{proj.desc}</p>
                          </div>

                          <div className="proj-detail-section">
                            <div className="proj-detail-section-label">The Story</div>
                            <p className="book-p" style={{fontStyle:'italic',fontFamily:'var(--fell)',borderLeft:'3px solid rgba(181,137,15,.3)',paddingLeft:'1rem',color:'var(--ink2)',lineHeight:'1.85'}}>{proj.story}</p>
                          </div>

                          <div className="proj-detail-section">
                            <div className="proj-detail-section-label">Key Highlights</div>
                            <div className="proj-highlights-list">
                              {proj.highlights.map((h,i) => (
                                <div key={i} className="proj-highlight-item">
                                  <span className="proj-highlight-dot">✦</span>
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="proj-detail-section">
                            <div className="proj-detail-section-label">Technology Stack</div>
                            <div className="porto-tech" style={{gap:'.4rem',flexWrap:'wrap'}}>
                              {proj.tech.map(t => <span key={t} className="porto-pill" style={{padding:'.22rem .65rem',fontSize:'.42rem'}}>{t}</span>)}
                            </div>
                          </div>

                          <div className="proj-detail-section">
                            <div className="proj-detail-section-label">Live Application</div>
                            <div className="proj-detail-links">
                              {proj.links.map(l => (
                                <a key={l.label} href={l.href} target="_blank" rel="noopener"
                                  className="proj-detail-link-btn"
                                  onMouseEnter={e => handleLinkEnter(e, l.href)}
                                  onMouseLeave={handleLinkLeave}
                                >{l.label}</a>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="proj-detail-nav">
                          <button
                            className="proj-nav-btn"
                            onClick={() => navigateProject(selectedProject - 1)}
                            disabled={selectedProject === 0}
                          >← Previous</button>
                          <span style={{fontFamily:'var(--display)',fontSize:'.4rem',letterSpacing:'.2em',color:'rgba(181,137,15,.5)'}}>
                            {selectedProject+1} / {PROJECTS_DATA.length}
                          </span>
                          <button
                            className="proj-nav-btn"
                            onClick={() => navigateProject(selectedProject + 1)}
                            disabled={selectedProject === PROJECTS_DATA.length - 1}
                          >Next →</button>
                        </div>

                        <div className="page-num-right">{pageNums.r}</div>
                      </div>
                    )
                  })()
                )}
              </div>

              {/* ===== SKILLS ===== */}
              <div className={`content-section${current==='skills'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter IV</span>
                  <h2 className="ch-heading-title">Skills <em>&amp; Expertise</em></h2>
                </div>
                <p className="book-p dropcap">A comprehensive catalogue of competencies — developed through years of dedicated practice and diverse professional engagements. These skills form the foundation upon which all achievements recorded herein have been built.</p>
                <div className="sec-break">✦ · · · ✦</div>
                <div className="skill-legend">
                  <div className="skill-legend-item"><div className="skill-legend-dot" style={{background:'#9b1c1c'}}/> Foundational</div>
                  <div className="skill-legend-item"><div className="skill-legend-dot" style={{background:'#c4431a'}}/> Proficient</div>
                  <div className="skill-legend-item"><div className="skill-legend-dot" style={{background:'#b5890f'}}/> Advanced</div>
                  <div className="skill-legend-item"><div className="skill-legend-dot" style={{background:'#d4a820'}}/> Expert</div>
                </div>

                {[
                  { icon: '💼', title: 'Sales & Business',    pct: 80, chips: ['Team Leadership','Sales Strategy','Business Development','Client Relations','Negotiation'] },
                  { icon: '🗂️', title: 'Administration & Tax', pct: 82, chips: ['Tax Management','Administrative Reports','Receivables','Bookkeeping','Budget Planning'] },
                  { icon: '📊', title: 'Data & Analytics',    pct: 85, chips: ['Data Analysis','Sales Analytics','Reporting','WordPress','Optimisation'] },
                  { icon: '💻', title: 'Technical Tools',     pct: 75, chips: ['MS Excel','MS Word','PowerPoint','Outlook','MS Office Suite'] },
                  { icon: '🎯', title: 'Management',          pct: 80, chips: ['Team Management','Strategic Planning','Time Management','Problem Solving','Decision Making'] },
                  { icon: '🤝', title: 'Soft Skills',         pct: 78, chips: ['Communication','Teamwork','Fast Learner','Adaptable','Resilient'] },
                ].map((s, idx) => (
                  <div key={s.title} className="skill-entry stagger-entry" style={{animationDelay:`${idx * 0.08}s`}}>
                    <div className="skill-entry-title"><span>{s.icon}</span> {s.title}</div>
                    <div className="skill-ink-bar-wrap">
                      <div className="skill-ink-bar" style={{ width: `${s.pct}%` }} />
                      <span className="skill-ink-pct">{s.pct}%</span>
                    </div>
                    <div className="skill-chips">{s.chips.map(c => <span key={c} className="skill-chip">{c}</span>)}</div>
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== SOCIAL ===== */}
              <div className={`content-section${current==='social'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter V</span>
                  <h2 className="ch-heading-title">Social <em>Experience</em></h2>
                </div>
                <p className="book-p dropcap">Beyond the professional realm, the author has dedicated considerable time and energy to the service of community and the welfare of others — a record of charitable undertakings that reflects both character and conviction.</p>
                <div className="sec-break">✦ · · · ✦</div>
                {[
                  {num:'I',  cat:'Community Service',  date:'November 2018', title:'Cleaning Places of Worship', desc:'Participated in regular cleaning and maintenance of local places of worship, ensuring clean and welcoming spaces for the community.',       imgSet:1},
                  {num:'II', cat:'Disaster Relief',    date:'2019',          title:'Disaster Relief Assistance', desc:'Supported disaster relief efforts by providing aid to affected communities, assisting with distribution and support coordination.',          imgSet:2},
                  {num:'III',cat:'Child Welfare',      date:'2019 – 2020',   title:'Supporting Orphanages',      desc:'Regular visits and support to orphanages, providing assistance and spending time with underprivileged children to brighten their days.',     imgSet:3},
                  {num:'IV', cat:'Social Welfare',     date:'2018 – 2020',   title:'Community Welfare Programs', desc:'Active participation in social welfare activities including food drives, educational programmes, and community development initiatives.',     imgSet:4},
                  {num:'V',  cat:'Education Support',  date:'2019',          title:'Educational Programmes',     desc:'Contributed to educational initiatives by tutoring underprivileged students and organising learning activities to promote literacy.',          imgSet:5},
                  {num:'VI', cat:'Environmental Care', date:'2018 – 2019',   title:'Environmental Clean-Up',     desc:'Participated in conservation activities including beach clean-ups, tree planting, and awareness campaigns for sustainable living.',             imgSet:6},
                ].map(s => (
                  <div key={s.title} className="social-entry">
                    <div className="social-num">{s.num}</div>
                    <div style={{flex:1}}>
                      <div className="social-cat">{s.cat}</div>
                      <div className="social-date">{s.date}</div>
                      <div className="social-title">{s.title}</div>
                      <p className="social-desc">{s.desc}</p>
                      <div className="social-photo-strip">
                        {SOCIAL_PLACEHOLDER[s.imgSet].map((media, i) => {
                          const isVideo = media.type === 'video'
                          // Untuk video Cloudinary, generate thumbnail otomatis
                          const thumb = media.thumb || (isVideo ? media.src.replace('/video/upload/', '/video/upload/so_0,w_300,h_220,c_fill/').replace(/\.(mp4|mov|avi|webm)$/i, '.jpg') : null)
                          return (
                            <div key={i} className="social-photo-frame" style={{animationDelay:`${i*0.08}s`}}
                              onClick={() => {
                                const items = SOCIAL_PLACEHOLDER[s.imgSet].map(m => ({
                                  src: m.src, type: m.type || 'image', title: s.title, cap: s.cat
                                }))
                                openLB(items, s.title, i)
                              }}
                            >
                              {isVideo ? (
                                <>
                                  <img src={thumb} alt={`${s.title} video ${i+1}`} loading="lazy" decoding="async" onError={e=>{e.target.style.background='#1a1005'}}/>
                                  <div className="video-play-btn">▶</div>
                                </>
                              ) : (
                                <img src={media.src} alt={`${s.title} ${i+1}`} loading="lazy" decoding="async" onError={e=>{if(e.target.closest('.social-photo-frame'))e.target.closest('.social-photo-frame').style.display='none'}}/>
                              )}
                              <div className="social-photo-overlay"><span>{isVideo ? '▶' : '✦'}</span></div>
                            </div>
                          )
                        })}
                      </div>
                      <p className="photo-placeholder-note">* Foto sementara — ganti dengan foto asli di folder /public (social-{s.num.toLowerCase()}-img1.jpg, dst.)</p>
                    </div>
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== TRAVEL GALLERY ===== */}
              <div className={`content-section${current==='travel'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter VI</span>
                  <h2 className="ch-heading-title">Travel <em>Gallery</em></h2>
                </div>
                <p className="book-p dropcap">Beyond the desk and the boardroom, the author finds renewal and perspective in the art of travel — exploring the diverse landscapes, cultures, and wonders that this archipelago and the wider world have to offer.</p>
                <div className="sec-break">✦ · · · ✦</div>

                <div className="travel-grid">
                  {TRAVEL_PHOTOS.map((photo, i) => (
                    <div
                      key={i}
                      className={`travel-card travel-card-${(i % 3)}`}
                      onClick={() => openLB(TRAVEL_PHOTOS.map(p => ({ src: cloudinaryThumb(p.src, 1200, 900), title: p.dest, cap: p.year })), photo.dest, i)}
                    >
                      <div className="travel-card-inner">
                        <img
                          src={cloudinaryThumb(photo.src, 400, 400)}
                          alt={photo.dest}
                          loading="lazy"
                          decoding="async"
                          onLoad={e => e.target.classList.add('loaded')}
                          onError={e => { const card = e.target.closest('.travel-card'); if(card) { card.style.opacity='0'; card.style.pointerEvents='none'; card.style.height='0'; card.style.minHeight='0'; card.style.overflow='hidden'; } }}
                        />
                        <div className="travel-card-footer">
                          <span className="travel-dest">📍 {photo.dest}</span>
                          <span className="travel-year">{photo.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== CONTACT ===== */}
              <div className={`content-section${current==='contact'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter VII</span>
                  <h2 className="ch-heading-title">Correspondence <em>&amp; Contact</em></h2>
                </div>
                <p className="book-p dropcap">Should you wish to discuss a matter of professional collaboration or simply extend a greeting, the author may be reached through the following channels. All enquiries are most warmly welcomed.</p>
                <div className="sec-break">✦ · · · ✦</div>

                <div className="contact-box">
                  {[
                    {label:'By Post',  val:'Bandung, West Java, Indonesia', href:null},
                    {label:'By Wire',  val:'+62 857-7607-7292',             href:'tel:+6285776077292'},
                    {label:'By Email', val:'irvansignora@gmail.com',        href:'mailto:irvansignora@gmail.com'},
                    {label:'WhatsApp', val:'Send a Message →',              href:'https://wa.me/6285776077292',ext:true},
                    {label:'LinkedIn', val:'View Profile →',                href:'https://www.linkedin.com/in/muhamad-irpan-yasin',ext:true},
                  ].map(row => (
                    <div key={row.label} className="contact-row">
                      <span className="contact-label">{row.label}</span>
                      <span className="contact-val">
                        {row.href ? <a href={row.href} target={row.ext?'_blank':undefined} rel="noopener">{row.val}</a> : row.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="social-quick-links">
                  <a href="https://wa.me/6285776077292" target="_blank" rel="noopener" className="sql-btn sql-wa"><span>📱</span>WhatsApp</a>
                  <a href="https://www.linkedin.com/in/muhamad-irpan-yasin" target="_blank" rel="noopener" className="sql-btn sql-li"><span>💼</span>LinkedIn</a>
                  <a href="mailto:irvansignora@gmail.com" className="sql-btn sql-em"><span>✉</span>Email</a>
                </div>

                <div className="book-h3">Compose a Letter</div>
                <div className="wax-seal">
                  <div className="wax-seal-circle">MIY</div>
                  <div className="wax-seal-label">Sealed with honour</div>
                </div>
                <p className="form-note">— Address your missive below and it shall be received with gratitude —</p>
                <form onSubmit={doSubmit}>
                  <div className="qfield"><label className="qlabel">Your Name</label><input className="qinput" type="text" name="name" placeholder="Enter your full name..." required /></div>
                  <div className="qfield"><label className="qlabel">Your Email</label><input className="qinput" type="email" name="email" placeholder="your@email.com" required /></div>
                  <div className="qfield"><label className="qlabel">Subject</label><input className="qinput" type="text" name="subject" placeholder="The nature of your enquiry..." required /></div>
                  <div className="qfield"><label className="qlabel">Your Message</label><textarea className="qtextarea" name="message" placeholder="Compose your letter here..." required /></div>
                  <button className="qsubmit" type="submit" disabled={formSending}
                    style={formSent?{background:'#4a7a3a'}:formError?{background:'#7a2a2a'}:formSending?{opacity:.6,cursor:'wait'}:{}}>
                    {formSending?'⟳ Dispatching…':formSent?'✓ Letter Dispatched!':formError?'✕ Failed — Try Again':'Dispatch Letter →'}
                  </button>
                </form>
                <div className="sec-break" style={{marginTop:'1.5rem'}}>✦ · · · ✦ · · · ✦</div>
                <p className="book-p" style={{fontFamily:'var(--fell)',fontStyle:'italic',textAlign:'center',fontSize:'.85rem',color:'var(--ink3)'}}>
                  © 2026 Muhamad Irpan Yasin — All Rights Reserved
                </p>
                <div className="page-num-right">{pageNums.r}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            <div style={{fontFamily:'var(--fraktur)',fontSize:'2rem',color:'var(--gold)',textAlign:'center',marginBottom:'1rem'}} onClick={handleSecretTap}>MIY</div>
            {/* Secret tap indicator in mobile */}
            {secretTapCount > 0 && (
              <div style={{display:'flex',gap:'.2rem',justifyContent:'center',marginBottom:'.6rem'}}>
                {Array.from({length:7}).map((_,i) => (
                  <div key={i} style={{width:'5px',height:'5px',borderRadius:'50%',background: i < secretTapCount ? 'rgba(212,168,32,.9)' : 'rgba(181,137,15,.2)',transition:'background .15s'}}/>
                ))}
              </div>
            )}
            <div style={{fontFamily:'var(--display)',fontSize:'.42rem',letterSpacing:'.2em',color:'rgba(139,105,20,.6)',textAlign:'center',marginBottom:'1.2rem',textTransform:'uppercase'}}>Table of Contents</div>
            {CHAPTER_ORDER.map((id,i) => (
              <button key={id} className={`mobile-nav-btn${current===id?' active':''}`} onClick={() => gotoChapter(id)}>
                <span className="mobile-nav-num">{['I','II','III','IV','V','VI','VII'][i]}</span>
                <span>{CHAPTERS[id].title}</span>
                {current===id && <span style={{marginLeft:'auto',color:'var(--gold)'}}>◆</span>}
              </button>
            ))}

            {/* Project sub-index — shown when on projects chapter */}
            {current === 'projects' && (
              <div style={{marginTop:'.8rem',borderTop:'1px solid rgba(181,137,15,.2)',paddingTop:'.8rem'}}>
                <div style={{fontFamily:'var(--display)',fontSize:'.38rem',letterSpacing:'.2em',color:'rgba(139,105,20,.5)',textAlign:'center',marginBottom:'.6rem',textTransform:'uppercase'}}>— Projects Index —</div>
                {PROJECTS_DATA.map((p, i) => (
                  <button
                    key={p.num}
                    className={`mobile-nav-btn${selectedProject === i ? ' active' : ''}`}
                    style={{paddingLeft:'1.4rem',fontSize:'.8rem'}}
                    onClick={() => { openProject(i); setMobileMenuOpen(false) }}
                  >
                    <span className="mobile-nav-num" style={{fontSize:'.55rem',color:'var(--red)'}}>{p.num}</span>
                    <span style={{fontSize:'.78rem'}}>{p.title}</span>
                    {selectedProject === i && <span style={{marginLeft:'auto',color:'var(--gold)'}}>◆</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Quick actions — Get CV & LinkedIn inside mobile drawer */}
            <div style={{marginTop:'auto',borderTop:'1px solid rgba(181,137,15,.15)',paddingTop:'.8rem',display:'flex',flexDirection:'column',gap:'.4rem',padding:'1rem 1rem 0'}}>
              <a href="/cv.pdf" download="CV-Muhamad-Irpan-Yasin.pdf"
                style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.5rem .8rem',border:'1px solid rgba(181,137,15,.3)',color:'rgba(181,137,15,.8)',fontFamily:'var(--display)',fontSize:'.4rem',letterSpacing:'.12em',textTransform:'uppercase',textDecoration:'none',background:'rgba(181,137,15,.05)'}}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:'13px',height:'13px',flexShrink:0}}>
                  <path d="M4 1h6l3 3v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/><path d="M9 1v4h3M8 7v5m-2-2 2 2 2-2"/>
                </svg>
                Download CV
              </a>
              <a href="https://www.linkedin.com/in/muhamad-irpan-yasin" target="_blank" rel="noopener"
                style={{display:'flex',alignItems:'center',gap:'.5rem',padding:'.5rem .8rem',border:'1px solid rgba(181,137,15,.3)',color:'rgba(181,137,15,.8)',fontFamily:'var(--display)',fontSize:'.4rem',letterSpacing:'.12em',textTransform:'uppercase',textDecoration:'none',background:'rgba(181,137,15,.05)'}}>
                <svg viewBox="0 0 16 16" fill="currentColor" style={{width:'13px',height:'13px',flexShrink:0}}>
                  <path d="M13 1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM5.5 12H4V6.5h1.5V12zM4.75 5.75a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75zM12 12h-1.5V9.2c0-.7-.56-1.2-1.25-1.2S8 8.5 8 9.2V12H6.5V6.5H8v.72A2.24 2.24 0 0 1 9.75 6.5C11.02 6.5 12 7.48 12 8.75V12z"/>
                </svg>
                LinkedIn
              </a>
              <div style={{display:'flex',gap:'.4rem',marginTop:'.2rem'}}>
                <button
                  onClick={() => { setSoundOn(s=>!s) }}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'.4rem',padding:'.4rem',border:'1px solid rgba(181,137,15,.2)',color:'rgba(181,137,15,.6)',fontFamily:'var(--display)',fontSize:'.38rem',letterSpacing:'.1em',background:'rgba(181,137,15,.04)',cursor:'pointer',textTransform:'uppercase'}}>
                  {soundOn ? '🔊 Sound' : '🔇 Sound'}
                </button>
                <button
                  onClick={() => { const goingDark = !darkMode; setDarkTransition(goingDark ? 'todark' : 'tolight'); setTimeout(() => { setDarkMode(goingDark); setDarkTransition(null) }, 420) }}
                  style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'.4rem',padding:'.4rem',border:'1px solid rgba(181,137,15,.2)',color:'rgba(181,137,15,.6)',fontFamily:'var(--display)',fontSize:'.38rem',letterSpacing:'.1em',background:'rgba(181,137,15,.04)',cursor:'pointer',textTransform:'uppercase'}}>
                  {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(o=>!o)} aria-label="Menu">
        <span/><span/><span/>
      </button>

      {/* Scroll indicator — quill pen style */}
      {current!=='home' && scrollPct<95 && (
        <div style={{
          position:'fixed', bottom:'2.2rem', right:'2.5rem', zIndex:50,
          pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem',
          opacity: scrollPct>80 ? 0 : 0.6, transition:'opacity .6s',
        }}>
          <span style={{
            fontFamily:'var(--display)', fontSize:'.38rem', color:'var(--gold)',
            textTransform:'uppercase',
            writingMode:'vertical-rl', letterSpacing:'.25em',
            animation:'quillBob 2.2s ease-in-out infinite',
          }}>scroll</span>
          <svg width="12" height="24" viewBox="0 0 12 24" fill="none" style={{animation:'quillBob 2.2s ease-in-out infinite .3s'}}>
            <line x1="6" y1="0" x2="6" y2="20" stroke="rgba(181,137,15,.6)" strokeWidth="1"/>
            <polyline points="2,16 6,22 10,16" fill="none" stroke="rgba(181,137,15,.6)" strokeWidth="1.2"/>
          </svg>
        </div>
      )}

      {/* Bookmark — grows with scroll progress, shows chapter number */}
      <div style={{
        position:'fixed', top:0,
        right:'calc(50% - min(550px,48vw) + 10px)',
        width:'20px',
        height:`${32+scrollPct*0.58}px`,
        background:'linear-gradient(180deg,#8b1a1a 0%,#5a0f0f 100%)',
        zIndex:30, pointerEvents:'none',
        boxShadow:'1px 0 8px rgba(0,0,0,.4), inset -1px 0 0 rgba(255,150,100,.1)',
        transition:'height .4s cubic-bezier(.16,1,.3,1)',
        clipPath:'polygon(0 0,100% 0,100% calc(100% - 8px),50% 100%,0 calc(100% - 8px))',
      }}>
        <div style={{
          position:'absolute', top:'8px', left:'50%', transform:'translateX(-50%)',
          color:'rgba(244,234,213,.5)', fontSize:'.48rem',
          writingMode:'vertical-rl', fontFamily:'var(--fraktur)',
          letterSpacing:'.1em', userSelect:'none',
        }}>
          {['I','II','III','IV','V','VI','VII'][[
            'home','portfolio','projects','skills','social','travel','contact'
          ].indexOf(current)] ?? '✦'}
        </div>
      </div>

      {/* Toolbar — collapsible floating panel */}
      <div className="toolbar-panel">
        <div className={`toolbar-items${toolbarOpen?' open':''}`}>
          <button onClick={() => setSoundOn(s=>!s)} className={`toolbar-btn${soundOn?' active':''}`}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              {soundOn
                ? <><path d="M1 5.5h3l4-3v11l-4-3H1z"/><path d="M11 4a5 5 0 0 1 0 8M13 2a8 8 0 0 1 0 12"/></>
                : <><path d="M1 5.5h3l4-3v11l-4-3H1z"/><path d="M13 5l-4 4m0-4l4 4"/></>
              }
            </svg>
            {soundOn ? 'Sound On' : 'Sound Off'}
          </button>
          <button onClick={() => {
            const goingDark = !darkMode
            setDarkTransition(goingDark ? 'todark' : 'tolight')
            setTimeout(() => { setDarkMode(goingDark); setDarkTransition(null) }, 420)
          }} className={`toolbar-btn${darkMode?' active':''}`}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              {darkMode
                ? <path d="M8 3V1m0 14v-2m5-5h2M1 8h2m7.07-4.07 1.42-1.42M4.51 11.49l-1.42 1.42m0-8.49L4.51 4.51m7.07 7.07-1.42-1.42M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                : <path d="M12 10.5A5 5 0 0 1 6.5 2a6 6 0 1 0 7.46 9.15c-.65.22-1.34.35-1.96.35z"/>
              }
            </svg>
            {darkMode ? 'Night Ink' : 'Day Parchment'}
          </button>
          <a href="/cv.pdf" download="CV-Muhamad-Irpan-Yasin.pdf" className="toolbar-btn" style={{textDecoration:'none'}}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 1h6l3 3v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/><path d="M9 1v4h3M8 7v5m-2-2 2 2 2-2"/>
            </svg>
            Get CV
          </a>
          <a href="https://www.linkedin.com/in/muhamad-irpan-yasin" target="_blank" rel="noopener" className="toolbar-btn" style={{textDecoration:'none'}}>
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M13 1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM5.5 12H4V6.5h1.5V12zM4.75 5.75a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75zM12 12h-1.5V9.2c0-.7-.56-1.2-1.25-1.2S8 8.5 8 9.2V12H6.5V6.5H8v.72A2.24 2.24 0 0 1 9.75 6.5C11.02 6.5 12 7.48 12 8.75V12z"/>
            </svg>
            LinkedIn
          </a>
        </div>
        <button
          className={`toolbar-toggle${toolbarOpen?' open':''}`}
          onClick={() => setToolbarOpen(o=>!o)}
          aria-label="Toggle toolbar"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 2v12M2 8h12" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Flip quote — ornamental manuscript style */}
      {showQuote && (
        <div className="flip-quote-wrap">
          <div className="flip-quote-inner">
            <div className="flip-quote-ornament">✦ · · · ✦</div>
            <p className="flip-quote-text">{flipQuote}</p>
            <div className="flip-quote-ornament">✦ · · · ✦</div>
          </div>
        </div>
      )}

      {/* Lightbox — premium ornamental frame */}
      {lbOpen && (
        <div id="lb" className="open"
          onTouchStart={e => { const t = e.touches[0]; e.currentTarget._tx = t.clientX }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - (e.currentTarget._tx||0)
            if (Math.abs(dx) > 50) dx < 0 ? setLbIdx(i=>(i+1)%lbImgs.length) : setLbIdx(i=>(i-1+lbImgs.length)%lbImgs.length)
          }}
        >
          <button className="lb-x" onClick={() => setLbOpen(false)}>Close</button>
          {lbImgs[lbIdx] && (
            <>
              {lbImgs[lbIdx].type === 'video' ? (
                <div className="lb-frame">
                  <div className="lb-corner-bl" /><div className="lb-corner-tr" />
                  <video key={lbImgs[lbIdx].src} id="lb-img" src={lbImgs[lbIdx].src} controls autoPlay
                    style={{maxWidth:'min(85vw,900px)',maxHeight:'62vh'}} />
                </div>
              ) : (
                <div className="lb-frame">
                  <div className="lb-corner-bl" /><div className="lb-corner-tr" />
                  <img id="lb-img" src={lbImgs[lbIdx].src} alt={lbImgs[lbIdx].title} />
                </div>
              )}
              <div className="lb-meta">
                <div className="lb-title">{lbImgs[lbIdx].title}</div>
                {lbImgs[lbIdx].cap && <div className="lb-cap">{lbImgs[lbIdx].cap}</div>}
              </div>
            </>
          )}
          <div className="lb-ctrl">
            <button className="lb-b" onClick={() => setLbIdx(i=>(i-1+lbImgs.length)%lbImgs.length)}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1 3 5l4 4"/></svg>
              Prev
            </button>
            <span className="lb-cnt">{lbIdx+1} / {lbImgs.length}</span>
            <button className="lb-b" onClick={() => setLbIdx(i=>(i+1)%lbImgs.length)}>
              Next
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1 7 5 3 9"/></svg>
            </button>
          </div>
        </div>
      )}
      {/* Konami Easter Egg — EPIC VERSION */}
      {konamiActive && (
        <>
          {/* Particle canvas layer */}
          <canvas ref={konamiCanvasRef} style={{
            position:'fixed', inset:0, zIndex:99985,
            pointerEvents:'none',
            width:'100vw', height:'100vh',
          }}/>

          {/* Ink splatter flash */}
          {konamiPhase >= 1 && (
            <div style={{
              position:'fixed', inset:0, zIndex:99986,
              background:'radial-gradient(ellipse at 50% 50%, rgba(212,168,32,.18) 0%, rgba(155,28,28,.12) 40%, transparent 70%)',
              pointerEvents:'none',
              animation:'konamiFlash .3s ease-out forwards',
            }}/>
          )}

          {/* Main overlay */}
          {konamiPhase >= 2 && (
            <div style={{
              position:'fixed', inset:0, zIndex:99990,
              display:'flex', alignItems:'center', justifyContent:'center',
              pointerEvents:'none', flexDirection:'column', gap:'1rem',
              background:'radial-gradient(ellipse at 50% 50%, rgba(5,2,0,.88) 0%, rgba(5,2,0,.82) 60%, rgba(5,2,0,.6) 100%)',
              animation:'konamiReveal .4s cubic-bezier(.16,1,.3,1) both',
            }}>
              {/* Decorative border */}
              <div style={{
                position:'absolute', inset:'5%',
                border:'1px solid rgba(212,168,32,.2)',
                pointerEvents:'none',
              }}/>
              <div style={{
                position:'absolute', inset:'5.5%',
                border:'1px solid rgba(212,168,32,.1)',
                pointerEvents:'none',
              }}/>

              {/* Corner ornaments */}
              {['topleft','topright','bottomleft','bottomright'].map(pos => (
                <div key={pos} style={{
                  position:'absolute',
                  top: pos.includes('top') ? '5.5%' : 'auto',
                  bottom: pos.includes('bottom') ? '5.5%' : 'auto',
                  left: pos.includes('left') ? '5.5%' : 'auto',
                  right: pos.includes('right') ? '5.5%' : 'auto',
                  fontFamily:'var(--fraktur)', fontSize:'1.2rem',
                  color:'rgba(212,168,32,.4)',
                  lineHeight:1,
                }}>✦</div>
              ))}

              {/* Key sequence display */}
              <div style={{
                display:'flex', gap:'.4rem', marginBottom:'.5rem',
                animation:'konamiText .5s cubic-bezier(.16,1,.3,1) .05s both',
              }}>
                {['↑','↑','↓','↓','←','→','←','→','B','A'].map((k,i) => (
                  <span key={i} style={{
                    fontFamily:'var(--display)', fontSize:'.52rem',
                    color:'rgba(212,168,32,.7)',
                    border:'1px solid rgba(212,168,32,.3)',
                    background:'rgba(212,168,32,.06)',
                    padding:'.2rem .38rem',
                    letterSpacing:'.05em',
                    animation:`konamiKeyReveal .1s ease ${i*0.06}s both`,
                  }}>{k}</span>
                ))}
              </div>

              {/* Main title */}
              <div style={{
                fontFamily:'var(--fraktur)', fontSize:'clamp(2.5rem,8vw,5.5rem)',
                color:'var(--gold2)', textAlign:'center', lineHeight:1.1,
                textShadow:'0 0 40px rgba(212,168,32,.9), 0 0 80px rgba(212,168,32,.5), 0 0 140px rgba(212,168,32,.2)',
                animation:'konamiText .6s cubic-bezier(.16,1,.3,1) .15s both',
              }}>✦ Cheat Activated ✦</div>

              {/* Subtitle */}
              <div style={{
                fontFamily:'var(--display)', fontSize:'.55rem', letterSpacing:'.4em',
                color:'rgba(212,168,32,.65)', textTransform:'uppercase',
                animation:'konamiText .5s cubic-bezier(.16,1,.3,1) .25s both',
              }}>Ancient Manuscript Unlocked</div>

              {/* Badge */}
              {konamiPhase >= 3 && (
                <div style={{
                  marginTop:'1rem',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:'.6rem',
                  animation:'konamiBadge .7s cubic-bezier(.34,1.56,.64,1) .1s both',
                }}>
                  {/* Wax seal badge */}
                  <div style={{
                    width:'90px', height:'90px', borderRadius:'50%',
                    background:'radial-gradient(ellipse at 35% 35%, #c4431a 0%, #7a1a08 60%, #4a0e05 100%)',
                    border:'3px solid rgba(212,168,32,.7)',
                    boxShadow:'0 0 0 6px rgba(212,168,32,.15), 0 0 30px rgba(212,168,32,.4), 0 0 60px rgba(155,28,28,.3), inset 0 2px 4px rgba(255,200,100,.2)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexDirection:'column', gap:'.1rem',
                    position:'relative',
                  }}>
                    <div style={{fontFamily:'var(--fraktur)', fontSize:'1.8rem', color:'rgba(244,234,213,.95)', lineHeight:1, textShadow:'0 1px 3px rgba(0,0,0,.5)'}}>MIY</div>
                    <div style={{fontFamily:'var(--display)', fontSize:'.28rem', letterSpacing:'.15em', color:'rgba(244,234,213,.6)', textTransform:'uppercase'}}>Secret</div>
                    {/* Seal ring text */}
                    <div style={{
                      position:'absolute', inset:0, borderRadius:'50%',
                      border:'1px solid rgba(212,168,32,.3)',
                    }}/>
                  </div>
                  {/* Achievement label */}
                  <div style={{
                    fontFamily:'var(--display)', fontSize:'.48rem', letterSpacing:'.25em',
                    color:'rgba(212,168,32,.8)', textTransform:'uppercase',
                    textAlign:'center',
                    textShadow:'0 0 12px rgba(212,168,32,.4)',
                  }}>🏆 Secret Achievement Unlocked</div>
                  <div style={{
                    fontFamily:'var(--fell)', fontSize:'.82rem', fontStyle:'italic',
                    color:'rgba(244,234,213,.45)', textAlign:'center', maxWidth:'380px',
                    lineHeight:1.7,
                  }}>"Thou hast discovered what few dare seek — the hidden seal of the manuscript."</div>
                </div>
              )}

              {/* Fade-out hint */}
              <div style={{
                position:'absolute', bottom:'8%',
                fontFamily:'var(--display)', fontSize:'.38rem', letterSpacing:'.2em',
                color:'rgba(212,168,32,.3)', textTransform:'uppercase',
                animation:'otwPulse 1.5s ease-in-out infinite',
              }}>— Fading in a moment —</div>
            </div>
          )}
        </>
      )}
    </>
  )
}
