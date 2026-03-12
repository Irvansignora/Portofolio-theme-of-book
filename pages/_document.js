import { Html, Head, Main, NextScript } from 'next/document'


const BASE_URL = 'https://irvansignora.vercel.app/'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Muhamad Irpan Yasin',
  url: BASE_URL,
  image: `${BASE_URL}/irvan.jpg`,
  jobTitle: 'Supervisor & administration Officer',
  description: '15+ years expertise in Sales Management, Administration, Data Analysis & Tax. Based in Bandung, West Java, Indonesia.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bandung',
    addressRegion: 'West Java',
    addressCountry: 'ID',
  },
  sameAs: [
    'https://www.linkedin.com/in/muhamad-irpan-yasin',
  ],
  knowsAbout: ['Sales Management','Tax Management','Data Analysis','Administration','Business Development'],
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ===== PRIMARY META ===== */}
        <meta name="description" content="Muhamad Irpan Yasin — 15+ years expertise in Sales Management, Administration, Data Analysis & Tax. Open for full-time, freelance & consulting roles. Bandung, West Java, Indonesia." />
        <meta name="keywords" content="Muhamad Irpan Yasin, portfolio, sales manager, Administration, tax management, data analysis, Bandung, Indonesia" />
        <meta name="author" content="Muhamad Irpan Yasin" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={BASE_URL} />

        {/* ===== OPEN GRAPH (LinkedIn, WhatsApp, Facebook) ===== */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={BASE_URL} />
        <meta property="og:locale"      content="en_US" />
        <meta property="og:site_name"   content="Muhamad Irpan Yasin — Portfolio" />
        <meta property="og:title"       content="Muhamad Irpan Yasin — Sales · Administration · Data Analysis" />
        <meta property="og:description" content="15+ years expertise in Sales, Administration, Data Analysis & Tax Management. Open for full-time, freelance & consulting roles." />
        <meta property="og:image"       content={`${BASE_URL}/og-banner.jpg`} />
        <meta property="og:image:secure_url" content={`${BASE_URL}/og-banner.jpg`} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt"    content="Muhamad Irpan Yasin Portfolio" />

        {/* ===== TWITTER / X CARD ===== */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Muhamad Irpan Yasin — Sales · Administration · Data Analysis" />
        <meta name="twitter:description" content="15+ years expertise in Sales, Administration, Data Analysis & Tax Management." />
        <meta name="twitter:image"       content={`${BASE_URL}/og-banner.jpg`} />

        {/* ===== FAVICON & THEME ===== */}
        <meta name="theme-color" content="#1a0f05" />
        <link rel="shortcut icon"    href="/logo.png" />
        <link rel="icon"             href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* ===== FONTS ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />

        {/* ===== STRUCTURED DATA (JSON-LD) ===== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
