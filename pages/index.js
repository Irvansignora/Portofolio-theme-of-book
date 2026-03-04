import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'

const CHAPTERS = {
  home:      { pageL: '— i —',        pageR: '— 1 —',  numRoman: 'I',   title: 'Preface',          page: 1 },
  portfolio: { pageL: '— vii —',      pageR: '— 7 —',  numRoman: 'II',  title: 'Portfolio',        page: 7 },
  projects:  { pageL: '— xiv —',      pageR: '— 14 —', numRoman: 'III', title: 'Projects',         page: 14 },
  skills:    { pageL: '— xxi —',      pageR: '— 21 —', numRoman: 'IV',  title: 'Skills & Expertise', page: 21 },
  social:    { pageL: '— xxviii —',   pageR: '— 28 —', numRoman: 'V',   title: 'Social Experience', page: 28 },
  contact:   { pageL: '— xxxv —',     pageR: '— 35 —', numRoman: 'VI',  title: 'Correspondence',   page: 35 },
}
const CHAPTER_ORDER = ['home','portfolio','projects','skills','social','contact']

export default function BookPortfolio() {
  const [current, setCurrent] = useState('home')
  const [pageNums, setPageNums] = useState({ l: '— i —', r: '— 1 —' })
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDir, setFlipDir] = useState('forward') // forward | backward
  const [lbOpen, setLbOpen] = useState(false)
  const [lbImgs, setLbImgs] = useState([])
  const [lbIdx, setLbIdx] = useState(0)
  const [formSent, setFormSent] = useState(false)

  const rightScrollRef = useRef(null)
  const leafRef = useRef(null)
  const flipping = useRef(false)
  const pendingChapter = useRef(null)

  // Counter animation
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

  // Page flip logic
  const gotoChapter = useCallback((id) => {
    if (id === current || flipping.current) return
    flipping.current = true
    setIsFlipping(true)

    const curIdx = CHAPTER_ORDER.indexOf(current)
    const newIdx = CHAPTER_ORDER.indexOf(id)
    const dir = newIdx > curIdx ? 'forward' : 'backward'
    setFlipDir(dir)

    // After half flip (when page is edge-on), switch content
    setTimeout(() => {
      setCurrent(id)
      setPageNums({ l: CHAPTERS[id].pageL, r: CHAPTERS[id].pageR })
      if (rightScrollRef.current) rightScrollRef.current.scrollTop = 0
      if (id === 'home') trigCounters()
    }, 400)

    // End flip
    setTimeout(() => {
      setIsFlipping(false)
      flipping.current = false
    }, 850)
  }, [current, trigCounters])

  // Keyboard lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (!lbOpen) return
      if (e.key === 'Escape') setLbOpen(false)
      if (e.key === 'ArrowLeft') setLbIdx(i => (i - 1 + lbImgs.length) % lbImgs.length)
      if (e.key === 'ArrowRight') setLbIdx(i => (i + 1) % lbImgs.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lbOpen, lbImgs.length])

  // Initial counters
  useEffect(() => { trigCounters() }, [trigCounters])

  const openLB = (imgs, title) => {
    const normalized = imgs.map(i => {
      if (typeof i === 'object') {
        const src = i.src.startsWith('http') || i.src.startsWith('/') ? i.src : '/' + i.src
        return { src, title: i.title || title, cap: i.caption || '' }
      }
      const src = i.startsWith('http') || i.startsWith('/') ? i : '/' + i
      return { src, title, cap: '' }
    })
    setLbImgs(normalized)
    setLbIdx(0)
    setLbOpen(true)
  }

  const doSubmit = (e) => {
    e.preventDefault()
    setFormSent(true)
    setTimeout(() => { setFormSent(false); e.target.reset() }, 3000)
  }

  const flipStyle = isFlipping ? {
    animation: `${flipDir === 'forward' ? 'flipForward' : 'flipBackward'} 0.85s cubic-bezier(0.45,0,0.55,1) forwards`
  } : {}

  return (
    <>
      <Head>
        <title>Muhamad Irpan Yasin — Portfolio</title>
        <style>{`
          @keyframes flipForward {
            0%   { transform: perspective(2400px) rotateY(0deg); box-shadow: none; }
            25%  { transform: perspective(2400px) rotateY(-45deg); }
            50%  { transform: perspective(2400px) rotateY(-90deg); }
            75%  { transform: perspective(2400px) rotateY(-135deg); }
            100% { transform: perspective(2400px) rotateY(-180deg); opacity: 0; }
          }
          @keyframes flipBackward {
            0%   { transform: perspective(2400px) rotateY(-180deg); opacity: 0; }
            25%  { transform: perspective(2400px) rotateY(-135deg); opacity: 1; }
            50%  { transform: perspective(2400px) rotateY(-90deg); }
            75%  { transform: perspective(2400px) rotateY(-45deg); }
            100% { transform: perspective(2400px) rotateY(0deg); }
          }
          .flip-leaf {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            transform-origin: left center;
            transform-style: preserve-3d;
            pointer-events: none;
            z-index: 40;
            background: linear-gradient(180deg, #f4ead5 0%, #ede0c4 60%, #e8d5b0 100%);
            box-shadow: 8px 0 30px rgba(0,0,0,0.3);
          }
          .flip-leaf::before {
            content: '';
            position: absolute; inset: 0;
            background: linear-gradient(90deg, rgba(0,0,0,0.18) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.08) 100%);
            pointer-events: none; z-index: 1;
          }
          .flip-leaf::after {
            content: '';
            position: absolute; inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");
            opacity: .5; pointer-events: none; z-index: 0;
          }
        `}</style>
      </Head>

      <div id="book-scene">
        <div id="book">

          {/* Spine */}
          <div id="spine" />

          {/* Left Page — TOC */}
          <div id="page-left">
            <div className="left-inner">
              <div className="book-monogram">MIY</div>
              <div className="book-author-name">M. Irpan Yasin</div>
              <div className="ornament">— ✦ —</div>
              <div className="toc-label">Table of Contents</div>
              <div className="ornament" style={{ fontSize: '.65rem', marginBottom: '.6rem' }}>· · · · · · · · · ·</div>

              <nav className="chapter-list">
                {[
                  { id: 'home',      num: 'I',   title: 'Preface',           page: 1  },
                  { id: 'portfolio', num: 'II',  title: 'Portfolio',         page: 7  },
                  { id: 'projects',  num: 'III', title: 'Projects',          page: 14 },
                  { id: 'skills',    num: 'IV',  title: 'Skills & Expertise', page: 21 },
                  { id: 'social',    num: 'V',   title: 'Social Experience', page: 28 },
                  { id: 'contact',   num: 'VI',  title: 'Correspondence',    page: 35 },
                ].map(ch => (
                  <button
                    key={ch.id}
                    className={`chapter-btn${current === ch.id ? ' active' : ''}`}
                    onClick={() => gotoChapter(ch.id)}
                  >
                    <span className="ch-num">{ch.num}</span>
                    <span className="ch-title">{ch.title}</span>
                    <span className="ch-dots" />
                    <span className="ch-page">{ch.page}</span>
                  </button>
                ))}
              </nav>

              <div className="left-footer">
                <div className="ornament" style={{ fontSize: '.65rem' }}>· · · · · · · · · ·</div>
                <div className="page-num-left">{pageNums.l}</div>
              </div>
            </div>
          </div>

          {/* Right Page — Content */}
          <div id="page-right" style={{ position: 'relative' }}>
            {/* Page flip overlay */}
            {isFlipping && (
              <div className="flip-leaf" ref={leafRef} style={flipStyle} />
            )}

            <div className="right-inner" id="right-scroll" ref={rightScrollRef}>

              {/* ===== CHAPTER I: HOME ===== */}
              <div className={`content-section${current === 'home' ? ' active' : ''}`} id="sec-home">
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter I</span>
                  <h1 className="ch-heading-title">Preface <em>&amp; Introduction</em></h1>
                </div>
                <div className="home-spread">
                  <div>
                    <p className="book-p dropcap">
                      <strong>Muhamad Irpan Yasin</strong> is a versatile and accomplished professional hailing from Bandung, West Java, Indonesia — a man of many disciplines, whose career has traversed the varied landscapes of Sales Management, Financial Administration, Data Analysis, and Tax Management.
                    </p>
                    <p className="book-p">
                      With more than <strong>fifteen years</strong> of comprehensive professional experience, he has cultivated a rare breadth of expertise that spans diverse industries and functions. His proven track record speaks of results delivered, teams led with purpose, and excellence achieved across every undertaking he has embraced.
                    </p>
                    <div className="book-h3">Vital Statistics</div>
                    <div className="stats-row">
                      <div className="stat-box"><div className="sn" data-target="15" data-suf="+">0</div><div className="sl">Years of Service</div></div>
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
                    <div className="sec-break">✦ · · · ✦ · · · ✦</div>
                    <p className="book-p" style={{ fontStyle: 'italic', fontFamily: 'var(--fell)', fontSize: '.88rem', textAlign: 'center', color: 'var(--ink3)' }}>
                      &ldquo;A versatile professional whose experience is matched only by his dedication to excellence in every endeavour he undertakes.&rdquo;
                    </p>
                  </div>
                  <div className="profile-portrait">
                    <img src="/irvan.jpg" alt="Muhamad Irpan Yasin" onError={e => e.target.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=260&fit=crop&q=80&grayscale'} />
                    <div className="portrait-caption">Muhamad Irpan Yasin<br />Bandung, West Java<br /><em>Indonesia</em></div>
                  </div>
                </div>
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== CHAPTER II: PORTFOLIO ===== */}
              <div className={`content-section${current === 'portfolio' ? ' active' : ''}`} id="sec-portfolio">
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter II</span>
                  <h2 className="ch-heading-title">Portfolio <em>of Works</em></h2>
                </div>
                <p className="book-p dropcap">Herein are recorded the principal achievements and key undertakings of the author&apos;s career — selected works that demonstrate mastery across multiple domains, from the sciences of commerce and finance to the analytical arts.</p>
                <div className="sec-break">✦ · · · ✦</div>

                {[
                  { num: '§ I', tag: 'Data Analysis', title: 'Sales Analytics Dashboard', desc: 'Developed comprehensive sales tracking and analysis system using WordPress, enabling real-time monitoring of team performance and revenue trends across multiple periods and territories.', tech: ['WordPress','Data Analysis','Reporting'], links: [{ href: '/sales-dashboard.html', label: '→ View Live Dashboard', ext: true }] },
                  { num: '§ II', tag: 'Tax Management', title: 'Tax Performance & Compliance', desc: 'Managing VAT, income tax, and multi-branch reporting across multiple corporate entities with data-driven accuracy and operational efficiency — ensuring full regulatory compliance at all times.', tech: ['Tax Reporting','Compliance','Reconciliation'], links: [{ href: '/tax-dashboard.html', label: '→ View Live Dashboard', ext: true }] },
                  { num: '§ III', tag: 'Sales Leadership', title: 'Sales Team Development', desc: 'Successfully supervised and trained multiple sales teams, consistently achieving and exceeding quarterly sales targets through effective coaching and strategic planning methodologies.', tech: ['Team Training','Sales Strategy','Performance'], links: [], onGallery: true, galleryImgs: ['porto-3-1.jpg','porto-3-2.jpg','porto-3-3.jpg','porto-3-4.jpg','porto-3-5.jpg','porto-3-6.jpg'], galleryTitle: 'Sales Team Development' },
                  { num: '§ IV', tag: 'Professional Development', title: 'Credentials & Recognition', desc: 'A distinguished portfolio of credentials and recognitions — from language proficiency certificates in Japanese and German to awards of excellence recognising outstanding contribution.', tech: ['Certifications','Awards','Community Service'], links: [], onCerts: true },
                  { num: '§ V', tag: 'Business Development', title: 'Partner Network Expansion', desc: 'Built and maintained strategic relationships with sales partners, expanding market reach and increasing revenue streams across regions through effective networking and relationship cultivation.', tech: ['Partnership','Networking','Growth'], links: [], onGallery: true, galleryImgs: ['porto-6-1.jpg','porto-6-2.jpg','porto-6-3.jpg','porto-6-4.jpg','porto-6-5.jpg','porto-6-6.jpg'], galleryTitle: 'Partner Network Expansion' },
                ].map(item => (
                  <div key={item.title} className="porto-entry">
                    <div className="porto-entry-header"><span className="porto-num">{item.num}</span><span className="porto-tag">{item.tag}</span></div>
                    <div className="porto-title">{item.title}</div>
                    <p className="porto-desc">{item.desc}</p>
                    <div className="porto-tech">{item.tech.map(t => <span key={t} className="porto-pill">{t}</span>)}</div>
                    {(item.links.length > 0 || item.onCerts || item.onGallery) && (
                      <div className="porto-links">
                        {item.links.map(l => <a key={l.label} className="porto-link" href={l.href} target={l.ext ? '_blank' : undefined} rel="noopener">{l.label}</a>)}
                        {item.onCerts && (
                          <button className="porto-link" onClick={() => openLB([
                            {src:'nihongo.jpg',title:'Japanese Language Proficiency',caption:'JLPT Certification'},
                            {src:'deutsch.jpg',title:'German Language Certificate',caption:'Deutsch Zertifikat'},
                            {src:'hlc1.jpg',title:'HLC Award 1',caption:'Recognition of excellence'},
                            {src:'hlc-2.jpg',title:'HLC Award 2',caption:'Recognition of excellence'},
                            {src:'msexcel1.jpg',title:'Microsoft Excel Certification',caption:'Advanced spreadsheet proficiency'},
                            {src:'msExcel2.jpg',title:'Microsoft Excel Advanced',caption:'Expert-level Excel skills'},
                          ], 'Credentials')}>→ View Certificates</button>
                        )}
                        {item.onGallery && (
                          <button className="porto-link" onClick={() => openLB(item.galleryImgs, item.galleryTitle)}>→ View Gallery</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== CHAPTER III: PROJECTS ===== */}
              <div className={`content-section${current === 'projects' ? ' active' : ''}`} id="sec-projects">
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter III</span>
                  <h2 className="ch-heading-title">Web Projects <em>— Live &amp; Deployed</em></h2>
                </div>
                <p className="book-p dropcap">A collection of digital undertakings — real-world applications conceived, constructed, and launched into the world. Each endeavour addresses a genuine need, from the stewardship of personal finances to the celebration of the holy month of Ramadhan.</p>
                <div className="sec-break">✦ · · · ✦</div>

                {[
                  { num: '§ I',   tag: 'Finance Tool',      title: 'Finance Manager',           desc: 'A smart personal finance manager — track income, expenses, and cash flow in real-time. Built for clarity, speed, and everyday use.',                                                                 tech: ['Firebase','React','Realtime DB'],         links: [{ href: 'https://monflow-v2.web.app/', label: '→ Visit Application' }] },
                  { num: '§ II',  tag: 'Lifestyle App',     title: 'Ramadhan Planner',          desc: 'Plan your most meaningful month with purpose. Track ibadah, set daily goals, and stay consistent throughout Ramadhan — all in one beautiful application.',                                         tech: ['Next.js','Vercel','LocalStorage'],        links: [{ href: 'https://ramadhan-planner2.vercel.app/', label: '→ Visit Application' }] },
                  { num: '§ III', tag: 'School Website',    title: 'Early Childhood School Website', desc: "A clean, welcoming website for an early childhood school. Built to help parents learn about the school's programmes and how to enrol their little ones.",                                        tech: ['Next.js','Tailwind','Vercel'],            links: [{ href: 'https://paud-fajar-pagi.vercel.app/', label: '→ Visit Application' }] },
                  { num: '§ IV',  tag: 'Personal Portfolio',title: 'Portfolio Sites',            desc: 'Custom-built portfolio websites for real clients — designed to make strong first impressions and showcase their unique skills to prospective employers.',                                           tech: ['Next.js','CSS','Vercel'],                links: [{ href: 'https://m-nazar.vercel.app/', label: '→ Nazar Portfolio' }, { href: 'https://portofolio-anisa.vercel.app/', label: '→ Anisa Portfolio' }] },
                  { num: '§ V',   tag: 'Machine Learning',  title: 'Sales ML Analytics',        desc: 'An AI-powered analytics platform using machine learning to uncover sales patterns, forecast trends, and deliver actionable business insights in real-time.',                                        tech: ['Python','Streamlit','ML'],               links: [{ href: 'https://sales-ml-analytics.streamlit.app/', label: '→ Visit Application' }] },
                  { num: '§ VI',  tag: 'E-Commerce',        title: 'FreshMarket Online Store',  desc: 'A fully functional e-commerce store for fresh groceries — complete with product catalogue, cart system, and a smooth, intuitive checkout experience.',                                              tech: ['Next.js','Tailwind','Vercel'],            links: [{ href: 'https://ecommerce-freshmarket.vercel.app/', label: '→ Visit Application' }] },
                ].map(item => (
                  <div key={item.title} className="porto-entry">
                    <div className="porto-entry-header"><span className="porto-num">{item.num}</span><span className="porto-tag">{item.tag}</span></div>
                    <div className="porto-title">{item.title}</div>
                    <p className="porto-desc">{item.desc}</p>
                    <div className="porto-tech">{item.tech.map(t => <span key={t} className="porto-pill">{t}</span>)}</div>
                    <div className="porto-links">{item.links.map(l => <a key={l.label} className="porto-link" href={l.href} target="_blank" rel="noopener">{l.label}</a>)}</div>
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== CHAPTER IV: SKILLS ===== */}
              <div className={`content-section${current === 'skills' ? ' active' : ''}`} id="sec-skills">
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter IV</span>
                  <h2 className="ch-heading-title">Skills <em>&amp; Expertise</em></h2>
                </div>
                <p className="book-p dropcap">A comprehensive catalogue of competencies — developed through years of dedicated practice and diverse professional engagements. These skills, both technical and interpersonal, form the foundation upon which all achievements herein recorded have been built.</p>
                <div className="sec-break">✦ · · · ✦</div>

                {[
                  { icon: '💼', title: 'Sales & Business',    chips: ['Team Leadership','Sales Strategy','Business Development','Client Relations','Negotiation'] },
                  { icon: '💰', title: 'Finance & Tax',       chips: ['Tax Management','Financial Reports','Receivables','Bookkeeping','Budget Planning'] },
                  { icon: '📊', title: 'Data & Analytics',    chips: ['Data Analysis','Sales Analytics','Reporting','WordPress','Optimisation'] },
                  { icon: '💻', title: 'Technical Tools',     chips: ['MS Office Suite','Microsoft Excel','Microsoft Word','PowerPoint','Outlook'] },
                  { icon: '🎯', title: 'Management',          chips: ['Team Management','Planning','Time Management','Problem Solving','Decision Making'] },
                  { icon: '🤝', title: 'Soft Skills',         chips: ['Communication','Teamwork','Fast Learner','Motivated','Adaptable','Resilient'] },
                ].map(s => (
                  <div key={s.title} className="skill-entry">
                    <div className="skill-entry-title"><span>{s.icon}</span> {s.title}</div>
                    <div className="skill-chips">{s.chips.map(c => <span key={c} className="skill-chip">{c}</span>)}</div>
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== CHAPTER V: SOCIAL ===== */}
              <div className={`content-section${current === 'social' ? ' active' : ''}`} id="sec-social">
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter V</span>
                  <h2 className="ch-heading-title">Social <em>Experience</em></h2>
                </div>
                <p className="book-p dropcap">Beyond the professional realm, the author has dedicated considerable time and energy to the service of community and the welfare of others — a record of charitable undertakings and civic engagement that reflects both character and conviction.</p>
                <div className="sec-break">✦ · · · ✦</div>

                {[
                  { num: 'I',   cat: 'Community Service', date: 'November 2018', title: 'Cleaning Places of Worship',    desc: 'Participated in regular cleaning and maintenance activities at local places of worship, ensuring clean and welcoming spaces for the community.' },
                  { num: 'II',  cat: 'Disaster Relief',   date: '2019',          title: 'Disaster Relief Assistance',    desc: 'Supported disaster relief efforts by providing aid to communities affected by natural disasters, assisting with distribution and support coordination.' },
                  { num: 'III', cat: 'Child Welfare',     date: '2019 – 2020',   title: 'Supporting Orphanages',         desc: 'Regular visits and support to orphanages, providing assistance and spending time with underprivileged children to brighten their days.' },
                  { num: 'IV',  cat: 'Social Welfare',    date: '2018 – 2020',   title: 'Community Welfare Programs',    desc: 'Active participation in various social welfare activities including food drives, educational programmes, and community development initiatives.' },
                  { num: 'V',   cat: 'Education Support', date: '2019',          title: 'Educational Programmes',        desc: 'Contributed to educational initiatives by tutoring underprivileged students and organising learning activities to promote literacy and skill development.' },
                  { num: 'VI',  cat: 'Environmental Care',date: '2018 – 2019',   title: 'Environmental Clean-Up',        desc: 'Participated in environmental conservation activities including beach clean-ups, tree planting, and awareness campaigns for sustainable living practices.' },
                ].map(s => (
                  <div key={s.title} className="social-entry">
                    <div className="social-num">{s.num}</div>
                    <div>
                      <div className="social-cat">{s.cat}</div>
                      <div className="social-date">{s.date}</div>
                      <div className="social-title">{s.title}</div>
                      <p className="social-desc">{s.desc}</p>
                    </div>
                  </div>
                ))}
                <div className="page-num-right">{pageNums.r}</div>
              </div>

              {/* ===== CHAPTER VI: CONTACT ===== */}
              <div className={`content-section${current === 'contact' ? ' active' : ''}`} id="sec-contact">
                <div className="ch-heading">
                  <span className="ch-heading-num">Chapter VI</span>
                  <h2 className="ch-heading-title">Correspondence <em>&amp; Contact</em></h2>
                </div>
                <p className="book-p dropcap">Should you wish to enter into correspondence, discuss a matter of professional collaboration, or simply extend a greeting, the author may be reached through the following channels. All enquiries are most warmly welcomed.</p>
                <div className="sec-break">✦ · · · ✦</div>

                <div className="contact-box">
                  <div className="contact-row"><span className="contact-label">By Post</span><span className="contact-val">Bandung, West Java, Indonesia</span></div>
                  <div className="contact-row"><span className="contact-label">By Wire</span><span className="contact-val"><a href="tel:+6285776077292">+62 857-7607-7292</a></span></div>
                  <div className="contact-row"><span className="contact-label">By Email</span><span className="contact-val"><a href="mailto:irvansignora@gmail.com">irvansignora@gmail.com</a></span></div>
                  <div className="contact-row"><span className="contact-label">WhatsApp</span><span className="contact-val"><a href="https://wa.me/6285776077292" target="_blank" rel="noopener">Send a Message</a></span></div>
                </div>

                <div className="book-h3">Compose a Letter</div>
                <p className="form-note">— Address your missive below and it shall be received with gratitude —</p>

                <form onSubmit={doSubmit}>
                  <div className="qfield"><label className="qlabel">Your Name</label><input className="qinput" type="text" placeholder="Enter your full name..." required /></div>
                  <div className="qfield"><label className="qlabel">Your Email</label><input className="qinput" type="email" placeholder="your@email.com" required /></div>
                  <div className="qfield"><label className="qlabel">Subject</label><input className="qinput" type="text" placeholder="The nature of your enquiry..." required /></div>
                  <div className="qfield"><label className="qlabel">Your Message</label><textarea className="qtextarea" placeholder="Compose your letter here..." required /></div>
                  <button className="qsubmit" type="submit" style={formSent ? { background: '#4a7a3a' } : {}}>
                    {formSent ? '✓ Letter Dispatched' : 'Dispatch Letter →'}
                  </button>
                </form>

                <div className="sec-break" style={{ marginTop: '1.5rem' }}>✦ · · · ✦ · · · ✦</div>
                <p className="book-p" style={{ fontFamily: 'var(--fell)', fontStyle: 'italic', textAlign: 'center', fontSize: '.85rem', color: 'var(--ink3)' }}>
                  © MMXXV Muhamad Irpan Yasin — All Rights Reserved
                </p>
                <div className="page-num-right">{pageNums.r}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lbOpen && (
        <div id="lb" className="open">
          <button className="lb-x" onClick={() => setLbOpen(false)}>Close ✕</button>
          {lbImgs[lbIdx] && (
            <>
              <img id="lb-img" src={lbImgs[lbIdx].src} alt={lbImgs[lbIdx].title} />
              <div className="lb-title">{lbImgs[lbIdx].title}</div>
              {lbImgs[lbIdx].cap && <div className="lb-cap">{lbImgs[lbIdx].cap}</div>}
            </>
          )}
          <div className="lb-ctrl">
            <button className="lb-b" onClick={() => setLbIdx(i => (i - 1 + lbImgs.length) % lbImgs.length)}>← Prev</button>
            <span className="lb-cnt">{lbIdx + 1} / {lbImgs.length}</span>
            <button className="lb-b" onClick={() => setLbIdx(i => (i + 1) % lbImgs.length)}>Next →</button>
          </div>
        </div>
      )}
    </>
  )
}
