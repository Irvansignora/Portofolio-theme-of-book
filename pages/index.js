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

// Placeholder travel photos — ganti dengan URL Cloudinary lu
const TRAVEL_PHOTOS = [
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772681838/Dieng_4_msizry.jpg', dest:'Dieng, Indonesia',    year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772681775/Puncak_3000Mdpl_zum_ersten_f%C3%BCr_mein_familie..._merbabu_gunung_jqg3jj.webp', dest:'Merbabu Mount, Indonesia',  year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772681861/Dieng_1_m1a2rp.jpg',  dest:'Dieng, Indonesia',     year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772681856/gn_gede_ttv1dd.jpg', dest:'Gede Mount, Indonesia', year:'2024' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772683058/20230911_071846_hvd7oc.jpg', dest:'Prau Mount, Indonesia', year:'2023' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772683172/20230911_083458_djtaiy.jpg', dest:'Prau Mount, Indonesia', year:'2023' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772682267/20250607_114807_uyhff4.jpg', dest:'Pangradinan Mount, Indonesia',  year:'2025' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772682397/IMG_20230219_075958_n5lumv.jpg', dest:'Pari Island, Indonesia',     year:'2023' },
  { src:'https://res.cloudinary.com/dyhvx9wit/image/upload/v1772682547/20240505_091651_okt1ey.jpg', dest:'Dufan, Indonesia',      year:'2023' },
]

// Media untuk social section — support foto & video Cloudinary
// Format: { type:'image'|'video', src:'url', thumb:'url-thumbnail-opsional' }
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
  const [visitCount, setVisitCount]       = useState(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [previewUrl, setPreviewUrl]       = useState(null)
  const [previewPos, setPreviewPos]       = useState({ x: 0, y: 0 })

  const rightScrollRef = useRef(null)
  const leafRef        = useRef(null)
  const flipping       = useRef(false)
  const audioCtx       = useRef(null)
  const canvasRef      = useRef(null)
  const particlesRef   = useRef([])

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
    try {
      const key = 'miy_visits'
      const v = parseInt(localStorage.getItem(key) || '0') + 1
      localStorage.setItem(key, v)
      setVisitCount(v)
    } catch(e) {}
  }, [])

  useEffect(() => {
    setSectionVisible(false)
    const t = setTimeout(() => setSectionVisible(true), 80)
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
    }, 550)
    setTimeout(() => { setIsFlipping(false); flipping.current = false }, 1150)
  }, [current, trigCounters, playFlipSound])

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

  // Particle dust effect
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

    // Init particles
    const COUNT = 55
    particlesRef.current = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 1.4 + 0.3,
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    -(Math.random() * 0.25 + 0.08),
      alpha: Math.random() * 0.45 + 0.05,
      life:  Math.random(),
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach(p => {
        p.x    += p.vx
        p.y    += p.vy
        p.life += 0.003
        if (p.life > 1 || p.y < -10) {
          p.x    = Math.random() * canvas.width
          p.y    = canvas.height + 5
          p.life = 0
          p.alpha = Math.random() * 0.45 + 0.05
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
    }
  }, [])

  useEffect(() => { trigCounters() }, [trigCounters])

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
    try {
      const res = await fetch('https://formspree.io/f/xpwzgknd', { method:'POST', body:data, headers:{ Accept:'application/json' } })
      if (res.ok) { setFormSent(true); e.target.reset(); setTimeout(() => setFormSent(false), 5000) }
      else { setFormError(true); setTimeout(() => setFormError(false), 4000) }
    } catch { setFormError(true); setTimeout(() => setFormError(false), 4000) }
    setFormSending(false)
  }

  const flipStyle = isFlipping ? { animation: `${flipDir==='forward'?'flipForward':'flipBackward'} 1.1s cubic-bezier(0.25,0.1,0.25,1) forwards` } : {}

  return (
    <>
      <Head>
        <title>Muhamad Irpan Yasin — Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Muhamad Irpan Yasin — 15+ years expertise in Sales Management, Finance, Data Analysis & Tax. Bandung, West Java, Indonesia." />
        <meta property="og:title" content="Muhamad Irpan Yasin — Portfolio" />
        <meta property="og:description" content="15+ years expertise in Sales, Finance, Data Analysis & Tax Management. Open for collaboration." />
        <meta property="og:image" content="/irvan.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <style>{`
          @keyframes flipForward {
            0%   { transform:perspective(1600px) rotateY(0deg); box-shadow:4px 0 20px rgba(0,0,0,.12); }
            15%  { transform:perspective(1600px) rotateY(-22deg); box-shadow:14px 0 45px rgba(0,0,0,.28); }
            45%  { transform:perspective(1600px) rotateY(-75deg); box-shadow:22px 0 65px rgba(0,0,0,.38); }
            50%  { transform:perspective(1600px) rotateY(-90deg); box-shadow:26px 0 75px rgba(0,0,0,.42); }
            55%  { transform:perspective(1600px) rotateY(-105deg); box-shadow:22px 0 65px rgba(0,0,0,.38); }
            82%  { transform:perspective(1600px) rotateY(-158deg); box-shadow:8px 0 28px rgba(0,0,0,.18); opacity:.7; }
            100% { transform:perspective(1600px) rotateY(-180deg); box-shadow:none; opacity:0; }
          }
          @keyframes flipBackward {
            0%   { transform:perspective(1600px) rotateY(-180deg); box-shadow:none; opacity:0; }
            18%  { transform:perspective(1600px) rotateY(-158deg); box-shadow:8px 0 28px rgba(0,0,0,.18); opacity:.7; }
            45%  { transform:perspective(1600px) rotateY(-105deg); box-shadow:22px 0 65px rgba(0,0,0,.38); opacity:1; }
            50%  { transform:perspective(1600px) rotateY(-90deg); box-shadow:26px 0 75px rgba(0,0,0,.42); }
            55%  { transform:perspective(1600px) rotateY(-75deg); box-shadow:22px 0 65px rgba(0,0,0,.38); }
            85%  { transform:perspective(1600px) rotateY(-22deg); box-shadow:14px 0 45px rgba(0,0,0,.28); }
            100% { transform:perspective(1600px) rotateY(0deg); box-shadow:4px 0 20px rgba(0,0,0,.12); }
          }
          .flip-leaf {
            position:absolute; top:0; left:0; right:0; bottom:0;
            transform-origin:left center; transform-style:preserve-3d;
            pointer-events:none; z-index:40;
            background:linear-gradient(108deg,#e8d5b0 0%,#f4ead5 38%,#ede0c4 65%,#e2cfa0 100%);
            will-change:transform,box-shadow;
          }
          .flip-leaf::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,rgba(0,0,0,.24) 0%,rgba(0,0,0,.07) 16%,rgba(255,248,230,.18) 32%,transparent 48%,rgba(0,0,0,.03) 72%,rgba(0,0,0,.12) 100%); pointer-events:none; z-index:1; }
          .flip-leaf::after  { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='.055'/%3E%3C/svg%3E"); opacity:.5; pointer-events:none; z-index:0; }
          @keyframes quillBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
          @keyframes quoteFlash { 0%{opacity:0;transform:scale(.96)} 20%{opacity:1;transform:scale(1)} 75%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(1.02)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          @keyframes otwPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        `}</style>
      </Head>

      <div id="book-scene" className={darkMode ? 'dark-mode' : ''}>

      {/* Particle dust canvas */}
      <canvas ref={canvasRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}} />

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

          <div id="spine" />

          {/* LEFT PAGE */}
          <div id="page-left">
            <div className="left-inner">
              <div className="book-monogram">MIY</div>
              <div className="book-author-name">M. Irpan Yasin</div>
              <div className="ornament">— ✦ —</div>
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
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div id="page-right" style={{position:'relative'}}>
            {isFlipping && <div className="flip-leaf" ref={leafRef} style={flipStyle} />}

            {/* Chapter progress bar */}
            <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'rgba(139,105,20,.1)',zIndex:5,pointerEvents:'none'}}>
              <div style={{height:'100%',width:`${((CHAPTER_ORDER.indexOf(current)+1)/CHAPTER_ORDER.length)*100}%`,background:'linear-gradient(90deg,var(--red),var(--gold))',transition:'width .6s cubic-bezier(.16,1,.3,1)'}}/>
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
                      <div className="stat-box"><div className="sn" data-target="8" data-suf="+">0</div><div className="sl">Positions Held</div></div>
                      <div className="stat-box"><div className="sn" data-target="4">0</div><div className="sl">Tongues Spoken</div></div>
                    </div>
                    <div className="book-h3">Languages of Correspondence</div>
                    <div className="lang-row">
                      {[['id','Indonesian','Native'],['gb','English','Elementary'],['de','German','Elementary'],['jp','Japanese','Elementary']].map(([flag,lang,lvl]) => (
                        <div key={flag} className="lang-pill">
                          <img src={`https://flagcdn.com/w80/${flag}.png`} alt={lang} />
                          <span>{lang}</span><span className="lv">— {lvl}</span>
                        </div>
                      ))}
                    </div>
                    <div className="open-to-work">
                      <span className="otw-dot"/>
                      <span className="otw-text">Open to Opportunities</span>
                      <span className="otw-sub"> · Full-time · Freelance · Consulting</span>
                    </div>
                    <div className="sec-break">✦ · · · ✦ · · · ✦</div>
                    <p className="book-p" style={{fontStyle:'italic',fontFamily:'var(--fell)',fontSize:'.88rem',textAlign:'center',color:'var(--ink3)'}}>
                      &ldquo;A versatile professional whose experience is matched only by his dedication to excellence in every endeavour.&rdquo;
                    </p>
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
                {[
                  {num:'§ I',  tag:'Data Analysis',        title:'Sales Analytics Dashboard',    desc:'Developed a comprehensive sales tracking system using WordPress, enabling real-time monitoring of team performance and revenue trends across multiple territories.',      tech:['WordPress','Data Analysis','Reporting'],       links:[{href:'/sales-dashboard.html',label:'→ View Live Dashboard',ext:true}]},
                  {num:'§ II', tag:'Tax Management',        title:'Tax Performance & Compliance', desc:'Managing VAT, income tax, and multi-branch reporting across corporate entities with data-driven accuracy — ensuring full regulatory compliance at all times.',              tech:['Tax Reporting','Compliance','Reconciliation'],  links:[{href:'/tax-dashboard.html',label:'→ View Live Dashboard',ext:true}]},
                  {num:'§ III',tag:'Sales Leadership',      title:'Sales Team Development',       desc:'Successfully supervised and trained multiple sales teams, consistently achieving and exceeding quarterly targets through effective coaching and strategic planning.',         tech:['Team Training','Sales Strategy','Performance'],  links:[],onGallery:true,galleryImgs:['porto-3-1.jpg','porto-3-2.jpg','porto-3-3.jpg'],galleryTitle:'Sales Team Development'},
                  {num:'§ IV', tag:'Professional Development',title:'Credentials & Recognition', desc:'A distinguished portfolio of credentials — from Japanese and German language certificates to awards of excellence recognising outstanding contribution to commerce.',       tech:['Certifications','Awards','Achievement'],         links:[],onCerts:true},
                  {num:'§ V',  tag:'Business Development',  title:'Partner Network Expansion',    desc:'Built and maintained strategic relationships with sales partners, expanding market reach and increasing revenue streams across regions through effective networking.',      tech:['Partnership','Networking','Growth'],             links:[],onGallery:true,galleryImgs:['porto-6-1.jpg','porto-6-2.jpg','porto-6-3.jpg'],galleryTitle:'Partner Network'},
                ].map(item => (
                  <div key={item.title} className="porto-entry">
                    <div className="porto-entry-header"><span className="porto-num">{item.num}</span><span className="porto-tag">{item.tag}</span></div>
                    <div className="porto-title">{item.title}</div>
                    <p className="porto-desc">{item.desc}</p>
                    <div className="porto-tech">{item.tech.map(t => <span key={t} className="porto-pill">{t}</span>)}</div>
                    {(item.links.length>0||item.onCerts||item.onGallery) && (
                      <div className="porto-links">
                        {item.links.map(l => <a key={l.label} className="porto-link" href={l.href} target={l.ext?'_blank':undefined} rel="noopener">{l.label}</a>)}
                        {item.onCerts && <button className="porto-link" onClick={() => openLB([{src:'nihongo.jpg',title:'Japanese Language',caption:'JLPT Certificate'},{src:'deutsch.jpg',title:'German Language',caption:'Deutsch Zertifikat'},{src:'hlc1.jpg',title:'HLC Award',caption:'Excellence Recognition'},{src:'hlc-2.jpg',title:'HLC Award 2',caption:'Excellence Recognition'},{src:'msexcel1.jpg',title:'MS Excel Cert',caption:'Advanced Excel'},{src:'msExcel2.jpg',title:'MS Excel Advanced',caption:'Expert Excel'}],'Credentials')}>→ View Certificates</button>}
                        {item.onGallery && <button className="porto-link" onClick={() => openLB(item.galleryImgs,item.galleryTitle)}>→ View Gallery</button>}
                      </div>
                    )}
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== PROJECTS ===== */}
              <div className={`content-section${current==='projects'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter III</span>
                  <h2 className="ch-heading-title">Web Projects <em>— Live &amp; Deployed</em></h2>
                </div>
                <p className="book-p dropcap">A collection of digital undertakings — real-world applications conceived, constructed, and launched into the world. Each endeavour addresses a genuine need, from personal finance management to community-focused applications.</p>
                <div className="sec-break">✦ · · · ✦</div>
                {[
                  {num:'§ I',  tag:'Finance Tool',      title:'Finance Manager',                desc:'A smart personal finance manager — track income, expenses, and cash flow in real-time. Built for clarity, speed, and everyday use.',                                                                tech:['Firebase','React','Realtime DB'],        links:[{href:'https://monflow-v2.web.app/',label:'→ Visit Application'}]},
                  {num:'§ II', tag:'Lifestyle App',     title:'Ramadhan Planner',               desc:'Plan your most meaningful month with purpose. Track ibadah, set daily goals, and stay consistent throughout Ramadhan — all in one beautiful application.',                                          tech:['Next.js','Vercel','LocalStorage'],       links:[{href:'https://ramadhan-planner2.vercel.app/',label:'→ Visit Application'}]},
                  {num:'§ III',tag:'School Website',    title:'Early Childhood School Website', desc:"A clean, welcoming website for an early childhood school. Built to help parents learn about the school's programmes and how to enrol their little ones.",                                           tech:['Next.js','Tailwind','Vercel'],           links:[{href:'https://paud-fajar-pagi.vercel.app/',label:'→ Visit Application'}]},
                  {num:'§ IV', tag:'Personal Portfolio',title:'Portfolio Sites',                desc:'Custom-built portfolio websites for real clients — designed to make strong first impressions and showcase their unique skills to prospective employers and collaborators.',                           tech:['Next.js','CSS','Vercel'],                links:[{href:'https://m-nazar.vercel.app/',label:'→ Nazar Portfolio'},{href:'https://portofolio-anisa.vercel.app/',label:'→ Anisa Portfolio'}]},
                  {num:'§ V',  tag:'Machine Learning',  title:'Sales ML Analytics',             desc:'An AI-powered analytics platform using machine learning to uncover sales patterns, forecast trends, and deliver actionable business insights in real-time.',                                         tech:['Python','Streamlit','ML'],               links:[{href:'https://sales-ml-analytics.streamlit.app/',label:'→ Visit Application'}]},
                  {num:'§ VI', tag:'E-Commerce & POS',  title:'Online Store & POS System',      desc:'Full-featured digital commerce solutions — from a fresh grocery e-commerce store with cart & checkout, to a coffee shop POS system with real-time transaction flow.',                               tech:['Next.js','Tailwind','Vercel'],           links:[{href:'https://ecommerce-freshmarket.vercel.app/',label:'→ FreshMarket Store'},{href:'https://demo-coffee-shop-v2.vercel.app/',label:'→ Coffee Shop POS'}]},
                ].map(item => (
                  <div key={item.title} className="porto-entry">
                    <div className="porto-entry-header"><span className="porto-num">{item.num}</span><span className="porto-tag">{item.tag}</span></div>
                    <div className="porto-title">{item.title}</div>
                    <p className="porto-desc">{item.desc}</p>
                    <div className="porto-tech">{item.tech.map(t => <span key={t} className="porto-pill">{t}</span>)}</div>
                    <div className="porto-links">{item.links.map(l => (
                      <a key={l.label} className="porto-link" href={l.href} target="_blank" rel="noopener"
                        onMouseEnter={e => handleLinkEnter(e, l.href)}
                        onMouseLeave={handleLinkLeave}
                      >{l.label}</a>
                    ))}</div>
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== SKILLS ===== */}
              <div className={`content-section${current==='skills'?' active':''}`}>
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter IV</span>
                  <h2 className="ch-heading-title">Skills <em>&amp; Expertise</em></h2>
                </div>
                <p className="book-p dropcap">A comprehensive catalogue of competencies — developed through years of dedicated practice and diverse professional engagements. These skills form the foundation upon which all achievements recorded herein have been built.</p>
                <div className="sec-break">✦ · · · ✦</div>

                {[
                  { icon: '💼', title: 'Sales & Business',    pct: 82, chips: ['Team Leadership','Sales Strategy','Business Development','Client Relations','Negotiation'] },
                  { icon: '🗂️', title: 'Administration & Tax', pct: 80, chips: ['Tax Management','Administrative Reports','Receivables','Bookkeeping','Budget Planning'] },
                  { icon: '📊', title: 'Data & Analytics',    pct: 72, chips: ['Data Analysis','Sales Analytics','Reporting','WordPress','Optimisation'] },
                  { icon: '💻', title: 'Technical Tools',     pct: 75, chips: ['MS Excel','MS Word','PowerPoint','Outlook','MS Office Suite'] },
                  { icon: '🎯', title: 'Management',          pct: 80, chips: ['Team Management','Strategic Planning','Time Management','Problem Solving','Decision Making'] },
                  { icon: '🤝', title: 'Soft Skills',         pct: 85, chips: ['Communication','Teamwork','Fast Learner','Adaptable','Resilient'] },
                ].map(s => (
                  <div key={s.title} className="skill-entry">
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
                                  <img src={thumb} alt={`${s.title} video ${i+1}`} onError={e=>{e.target.style.background='#1a1005'}}/>
                                  <div className="video-play-btn">▶</div>
                                </>
                              ) : (
                                <img src={media.src} alt={`${s.title} ${i+1}`} onError={e=>{if(e.target.closest('.social-photo-frame'))e.target.closest('.social-photo-frame').style.display='none'}}/>
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
                      onClick={() => openLB(TRAVEL_PHOTOS.map(p => ({ src: p.src, title: p.dest, cap: p.year })), photo.dest, i)}
                    >
                      <div className="travel-card-inner">
                        <img src={photo.src} alt={photo.dest} onError={e => e.target.closest('.travel-card').style.display='none'} />
                        <div className="travel-card-footer">
                          <span className="travel-dest">📍 {photo.dest}</span>
                          <span className="travel-year">{photo.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="photo-placeholder-note" style={{textAlign:'center',marginTop:'1rem'}}>
                  * Foto placeholder — ganti src di TRAVEL_PHOTOS dengan URL Cloudinary lu
                </p>
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
                  © MMXXV Muhamad Irpan Yasin — All Rights Reserved
                </p>
                {visitCount && (
                  <p style={{fontFamily:'var(--display)',fontSize:'.42rem',letterSpacing:'.15em',textTransform:'uppercase',color:'var(--ink3)',textAlign:'center',marginTop:'.6rem',opacity:.6}}>
                    This tome has been opened {visitCount.toLocaleString()} {visitCount===1?'time':'times'}
                  </p>
                )}
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
            <div style={{fontFamily:'var(--fraktur)',fontSize:'2rem',color:'var(--gold)',textAlign:'center',marginBottom:'1rem'}}>MIY</div>
            <div style={{fontFamily:'var(--display)',fontSize:'.42rem',letterSpacing:'.2em',color:'rgba(139,105,20,.6)',textAlign:'center',marginBottom:'1.2rem',textTransform:'uppercase'}}>Table of Contents</div>
            {CHAPTER_ORDER.map((id,i) => (
              <button key={id} className={`mobile-nav-btn${current===id?' active':''}`} onClick={() => gotoChapter(id)}>
                <span className="mobile-nav-num">{['I','II','III','IV','V','VI','VII'][i]}</span>
                <span>{CHAPTERS[id].title}</span>
                {current===id && <span style={{marginLeft:'auto',color:'var(--gold)'}}>◆</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(o=>!o)} aria-label="Menu">
        <span/><span/><span/>
      </button>

      {/* Scroll indicator */}
      {current!=='home' && scrollPct<95 && (
        <div style={{position:'fixed',bottom:'2.2rem',right:'2.5rem',zIndex:50,pointerEvents:'none',display:'flex',flexDirection:'column',alignItems:'center',gap:'.2rem',opacity:scrollPct>80?0:0.55,transition:'opacity .6s',animation:'quillBob 2.2s ease-in-out infinite'}}>
          <span style={{fontFamily:'var(--fell)',fontSize:'.62rem',color:'var(--gold)',fontStyle:'italic',letterSpacing:'.06em'}}>scroll</span>
          <span style={{color:'var(--gold)',fontSize:'.9rem',lineHeight:1}}>↓</span>
        </div>
      )}

      {/* Bookmark */}
      <div style={{position:'fixed',top:0,right:'calc(50% - min(550px,48vw) + 10px)',width:'18px',height:`${28+scrollPct*0.55}px`,background:'linear-gradient(180deg,var(--red) 0%,#5a0f0f 100%)',zIndex:30,pointerEvents:'none',boxShadow:'1px 0 6px rgba(0,0,0,.3)',transition:'height .3s cubic-bezier(.16,1,.3,1)',clipPath:'polygon(0 0,100% 0,100% calc(100% - 7px),50% 100%,0 calc(100% - 7px))'}}>
        <div style={{position:'absolute',top:'6px',left:'50%',transform:'translateX(-50%)',color:'rgba(244,234,213,.55)',fontSize:'.55rem',writingMode:'vertical-rl',fontFamily:'var(--display)',letterSpacing:'.15em',userSelect:'none'}}>✦</div>
      </div>

      {/* Toolbar */}
      <div style={{position:'fixed',bottom:'1.8rem',left:'1.8rem',zIndex:50,display:'flex',gap:'.4rem',flexDirection:'column',alignItems:'flex-start'}}>
        <button onClick={() => setSoundOn(s=>!s)} className={`toolbar-btn${soundOn?' active':''}`}>
          <span style={{fontSize:'.8rem'}}>{soundOn?'🔔':'🔕'}</span>{soundOn?'Sound On':'Sound Off'}
        </button>
        <button onClick={() => setDarkMode(d=>!d)} className={`toolbar-btn${darkMode?' active':''}`}>
          <span style={{fontSize:'.8rem'}}>{darkMode?'🌙':'☀️'}</span>{darkMode?'Night Ink':'Day Parchment'}
        </button>
        <a href="/cv.pdf" download="CV-Muhamad-Irpan-Yasin.pdf" className="toolbar-btn" style={{textDecoration:'none'}}>
          <span style={{fontSize:'.8rem'}}>📄</span>Get CV
        </a>
        <a href="https://www.linkedin.com/in/muhamad-irpan-yasin" target="_blank" rel="noopener" className="toolbar-btn" style={{textDecoration:'none'}}>
          <span style={{fontSize:'.8rem'}}>💼</span>LinkedIn
        </a>
      </div>

      {/* Flip quote */}
      {showQuote && (
        <div style={{position:'fixed',inset:0,zIndex:45,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
          <p style={{fontFamily:'var(--fell)',fontStyle:'italic',fontSize:'clamp(.9rem,2vw,1.1rem)',color:'rgba(244,234,213,.82)',textAlign:'center',maxWidth:'340px',letterSpacing:'.02em',lineHeight:1.6,textShadow:'0 2px 16px rgba(0,0,0,.8)',animation:'quoteFlash .9s ease forwards'}}>{flipQuote}</p>
        </div>
      )}

      {/* Lightbox */}
      {lbOpen && (
        <div id="lb" className="open">
          <button className="lb-x" onClick={() => setLbOpen(false)}>Close ✕</button>
          {lbImgs[lbIdx] && (
            <>
              {lbImgs[lbIdx].type === 'video' ? (
                <video
                  key={lbImgs[lbIdx].src}
                  id="lb-img"
                  src={lbImgs[lbIdx].src}
                  controls autoPlay
                  style={{maxWidth:'100%', maxHeight:'65vh', border:'2px solid rgba(139,105,20,.5)', boxShadow:'0 0 60px rgba(139,105,20,.3)'}}
                />
              ) : (
                <img id="lb-img" src={lbImgs[lbIdx].src} alt={lbImgs[lbIdx].title} />
              )}
              <div className="lb-title">{lbImgs[lbIdx].title}</div>
              {lbImgs[lbIdx].cap && <div className="lb-cap">{lbImgs[lbIdx].cap}</div>}
            </>
          )}
          <div className="lb-ctrl">
            <button className="lb-b" onClick={() => setLbIdx(i=>(i-1+lbImgs.length)%lbImgs.length)}>← Prev</button>
            <span className="lb-cnt">{lbIdx+1} / {lbImgs.length}</span>
            <button className="lb-b" onClick={() => setLbIdx(i=>(i+1)%lbImgs.length)}>Next →</button>
          </div>
        </div>
      )}
    </>
  )
}
