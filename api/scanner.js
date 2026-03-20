const cheerio = require('cheerio')
const fetch = require('node-fetch')
const https = require('https')

const TIMEOUT = 15000
const agent = new https.Agent({ rejectUnauthorized: false })

async function fetchPage(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      agent: url.startsWith('https') ? agent : undefined,
      headers: {
        'User-Agent': 'AISM-Scanner/1.0 (https://aism.dk)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'da,en;q=0.9',
      },
      redirect: 'follow',
    })
    const html = await res.text()
    return { html, status: res.status, headers: res.headers }
  } finally {
    clearTimeout(timer)
  }
}

async function scanSite(url) {
  const { html, status, headers } = await fetchPage(url)
  const $ = cheerio.load(html)
  const startTime = Date.now()

  const checks = {
    title: checkTitle($),
    metaDescription: checkMetaDescription($),
    headings: checkHeadings($),
    content: checkContent($),
    images: checkImages($),
    links: checkLinks($),
    structuredData: checkStructuredData($, html),
    openGraph: checkOpenGraph($),
    canonical: checkCanonical($, url),
    language: checkLanguage($),
    mobile: checkMobile($),
    robots: checkRobots($, headers),
    performance: checkPerformance(html),
    security: checkSecurity(url, headers),
    accessibility: checkAccessibility($),
    aiReadiness: checkAIReadiness($, html),
  }

  // Calculate category scores
  const categories = buildCategories(checks)
  const totalMaxScore = categories.reduce((sum, c) => sum + c.maxScore, 0)
  const totalRaw = categories.reduce((sum, c) => sum + c.score, 0)
  const totalScore = Math.round((totalRaw / totalMaxScore) * 100)

  // Collect issues and recommendations
  const issues = collectIssues(checks)
  const recommendations = collectRecommendations(checks, totalScore)

  // Summary
  const summary = buildSummary(totalScore, url, checks)

  return {
    url,
    score: Math.min(100, Math.max(0, totalScore)),
    summary,
    categories,
    issues: issues.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    scannedAt: new Date().toISOString(),
  }
}

// === CHECK FUNCTIONS ===

function checkTitle($) {
  const title = $('title').first().text().trim()
  const len = title.length
  return {
    value: title,
    score: !title ? 0 : len < 10 ? 5 : len > 70 ? 8 : len >= 30 && len <= 60 ? 15 : 12,
    maxScore: 15,
    issues: !title
      ? [{ severity: 'critical', title: 'Manglende sidetitel', description: 'Siden har ingen <title> tag. Det er kritisk for synlighed i søgemaskiner og AI.', category: 'AI-parathed' }]
      : len < 10
        ? [{ severity: 'warning', title: 'For kort sidetitel', description: `Titlen er kun ${len} tegn. En god titel er 30-60 tegn.`, category: 'Indhold' }]
        : len > 70
          ? [{ severity: 'warning', title: 'For lang sidetitel', description: `Titlen er ${len} tegn og bliver afkortet i søgeresultater.`, category: 'Indhold' }]
          : [],
  }
}

function checkMetaDescription($) {
  const desc = $('meta[name="description"]').attr('content')?.trim() || ''
  const len = desc.length
  return {
    value: desc,
    score: !desc ? 0 : len < 50 ? 5 : len > 160 ? 8 : len >= 80 && len <= 155 ? 15 : 10,
    maxScore: 15,
    issues: !desc
      ? [{ severity: 'critical', title: 'Manglende meta description', description: 'Siden har ingen meta description. AI-modeller bruger dette til at forstå sidens indhold.', category: 'AI-parathed' }]
      : len < 50
        ? [{ severity: 'warning', title: 'For kort meta description', description: `Meta description er kun ${len} tegn. Anbefalet: 80-155 tegn.`, category: 'Indhold' }]
        : [],
  }
}

function checkHeadings($) {
  const h1s = $('h1')
  const h2s = $('h2')
  const h3s = $('h3')
  const h1Count = h1s.length
  const h2Count = h2s.length

  let score = 0
  const issues = []

  if (h1Count === 1) score += 5
  else if (h1Count === 0) {
    issues.push({ severity: 'critical', title: 'Manglende H1-overskrift', description: 'Siden har ingen H1. AI-modeller bruger overskrifter til at forstå sidens hovedemne.', category: 'Indholdsstruktur' })
  } else {
    score += 2
    issues.push({ severity: 'warning', title: 'Flere H1-overskrifter', description: `Siden har ${h1Count} H1-tags. Brug kun én H1 per side.`, category: 'Indholdsstruktur' })
  }

  if (h2Count >= 2) score += 5
  else if (h2Count === 1) score += 3
  else issues.push({ severity: 'info', title: 'Få underoverskrifter', description: 'Tilføj H2/H3 overskrifter for bedre struktur og AI-forståelse.', category: 'Indholdsstruktur' })

  if (h3s.length > 0) score += 2

  return { h1Count, h2Count, h3Count: h3s.length, score, maxScore: 12, issues }
}

function checkContent($) {
  // Remove scripts, styles, etc.
  const textContent = $('body').clone().find('script,style,noscript').remove().end().text()
  const wordCount = textContent.split(/\s+/).filter(w => w.length > 1).length
  const paragraphs = $('p').length
  const lists = $('ul, ol').length

  let score = 0
  const issues = []

  if (wordCount >= 300) score += 8
  else if (wordCount >= 100) score += 4
  else {
    score += 1
    issues.push({ severity: 'warning', title: 'Begrænset indhold', description: `Siden har ca. ${wordCount} ord. Sider med under 300 ord scorer lavere i AI-systemer.`, category: 'Indhold' })
  }

  if (paragraphs >= 3) score += 3
  if (lists >= 1) score += 2

  return { wordCount, paragraphs, lists, score, maxScore: 13, issues }
}

function checkImages($) {
  const imgs = $('img')
  let withAlt = 0
  let withoutAlt = 0

  imgs.each((_, el) => {
    const alt = $(el).attr('alt')
    if (alt && alt.trim()) withAlt++
    else withoutAlt++
  })

  const total = imgs.length
  let score = 0
  const issues = []

  if (total === 0) {
    score = 3
  } else {
    const ratio = withAlt / total
    score = Math.round(ratio * 5)
    if (withoutAlt > 0) {
      issues.push({
        severity: withoutAlt > 2 ? 'warning' : 'info',
        title: `${withoutAlt} billede(r) uden alt-tekst`,
        description: 'Alt-tekst hjælper AI med at forstå billedindhold. Tilføj beskrivende alt-tekst til alle billeder.',
        category: 'Tilgængelighed'
      })
    }
  }

  return { total, withAlt, withoutAlt, score, maxScore: 5, issues }
}

function checkLinks($) {
  const internal = $('a[href^="/"], a[href^="' + '"]').length
  const external = $('a[href^="http"]').length
  const total = $('a').length

  return {
    internal, external, total,
    score: total > 0 ? (internal >= 3 ? 5 : 3) : 1,
    maxScore: 5,
    issues: total === 0
      ? [{ severity: 'info', title: 'Ingen links fundet', description: 'Interne og eksterne links styrker konteksten for AI-systemer.', category: 'Indholdsstruktur' }]
      : [],
  }
}

function checkStructuredData($, html) {
  const jsonLd = $('script[type="application/ld+json"]')
  let hasSchema = jsonLd.length > 0
  let schemaTypes = []

  jsonLd.each((_, el) => {
    try {
      const data = JSON.parse($(el).html())
      if (data['@type']) schemaTypes.push(data['@type'])
      if (Array.isArray(data['@graph'])) {
        data['@graph'].forEach(item => { if (item['@type']) schemaTypes.push(item['@type']) })
      }
    } catch {}
  })

  // Also check microdata
  if ($('[itemtype]').length > 0) hasSchema = true

  return {
    hasSchema, schemaTypes,
    score: hasSchema ? (schemaTypes.length >= 2 ? 10 : 7) : 0,
    maxScore: 10,
    issues: !hasSchema
      ? [{ severity: 'warning', title: 'Ingen struktureret data', description: 'Structured data (JSON-LD) hjælper AI-systemer med at forstå dit indhold præcist. Tilføj schema markup.', category: 'AI-parathed' }]
      : [],
  }
}

function checkOpenGraph($) {
  const ogTitle = $('meta[property="og:title"]').attr('content')
  const ogDesc = $('meta[property="og:description"]').attr('content')
  const ogImage = $('meta[property="og:image"]').attr('content')
  const hasOg = !!(ogTitle || ogDesc || ogImage)

  return {
    ogTitle, ogDesc, ogImage, hasOg,
    score: hasOg ? (ogTitle && ogDesc && ogImage ? 5 : 3) : 0,
    maxScore: 5,
    issues: !hasOg
      ? [{ severity: 'info', title: 'Manglende Open Graph tags', description: 'OG-tags forbedrer deling og AI-forståelse af dit indhold.', category: 'Social / Deling' }]
      : [],
  }
}

function checkCanonical($, url) {
  const canonical = $('link[rel="canonical"]').attr('href')
  return {
    canonical,
    score: canonical ? 5 : 0,
    maxScore: 5,
    issues: !canonical
      ? [{ severity: 'info', title: 'Manglende canonical tag', description: 'Et canonical tag hjælper søgemaskiner med at undgå duplikatindhold.', category: 'Teknisk SEO' }]
      : [],
  }
}

function checkLanguage($) {
  const lang = $('html').attr('lang')
  return {
    lang,
    score: lang ? 3 : 0,
    maxScore: 3,
    issues: !lang
      ? [{ severity: 'warning', title: 'Manglende sprog-attribut', description: 'Angiv lang="da" på <html> tagget så AI ved hvilket sprog indholdet er på.', category: 'Teknisk' }]
      : [],
  }
}

function checkMobile($) {
  const viewport = $('meta[name="viewport"]').attr('content')
  return {
    viewport,
    score: viewport ? 5 : 0,
    maxScore: 5,
    issues: !viewport
      ? [{ severity: 'critical', title: 'Ikke mobilvenlig', description: 'Manglende viewport meta tag. Siden vises dårligt på mobil og AI nedprioriterer ikke-mobilvenlige sider.', category: 'Teknisk' }]
      : [],
  }
}

function checkRobots($, headers) {
  const robotsMeta = $('meta[name="robots"]').attr('content') || ''
  const isNoindex = robotsMeta.toLowerCase().includes('noindex')

  return {
    robotsMeta, isNoindex,
    score: isNoindex ? 0 : 2,
    maxScore: 2,
    issues: isNoindex
      ? [{ severity: 'critical', title: 'Siden blokerer indexering', description: 'noindex er sat — søgemaskiner og AI kan ikke indexere denne side.', category: 'AI-parathed' }]
      : [],
  }
}

function checkPerformance(html) {
  const sizeKb = Math.round(Buffer.byteLength(html) / 1024)
  let score = sizeKb < 100 ? 5 : sizeKb < 300 ? 4 : sizeKb < 500 ? 3 : 1

  return {
    sizeKb, score, maxScore: 5,
    issues: sizeKb > 500
      ? [{ severity: 'warning', title: 'Stor sidestørrelse', description: `HTML-dokumentet er ${sizeKb} KB. Store sider kan være langsomme og svære for AI at parse.`, category: 'Performance' }]
      : [],
  }
}

function checkSecurity(url, headers) {
  const isHttps = url.startsWith('https')
  return {
    isHttps,
    score: isHttps ? 5 : 0,
    maxScore: 5,
    issues: !isHttps
      ? [{ severity: 'critical', title: 'Manglende HTTPS', description: 'Siden bruger ikke HTTPS. Det er en grundlæggende sikkerhedskrav og påvirker troværdighed negativt.', category: 'Sikkerhed' }]
      : [],
  }
}

function checkAccessibility($) {
  const hasSkipLink = $('a[href="#main"], a[href="#content"], .skip-link').length > 0
  const ariaLabels = $('[aria-label]').length
  const roles = $('[role]').length

  let score = 0
  if (ariaLabels > 0) score += 1
  if (roles > 0) score += 1
  if (hasSkipLink) score += 1

  return { hasSkipLink, ariaLabels, roles, score, maxScore: 3, issues: [] }
}

function checkAIReadiness($, html) {
  let score = 0
  const issues = []

  // Check for FAQ section
  const hasFaq = html.includes('FAQPage') || $('*:contains("FAQ")').length > 0 || $('[itemtype*="FAQ"]').length > 0
  if (hasFaq) score += 2

  // Check for clear about/contact info
  const hasContact = $('a[href^="mailto:"]').length > 0 || $('a[href^="tel:"]').length > 0
  if (hasContact) score += 2
  else {
    issues.push({ severity: 'info', title: 'Ingen kontaktinfo synlig', description: 'Tydelige kontaktoplysninger øger troværdighed for AI-systemer.', category: 'AI-parathed' })
  }

  // Check for clean semantic structure
  const hasArticle = $('article').length > 0
  const hasMain = $('main').length > 0
  const hasNav = $('nav').length > 0
  if (hasArticle || hasMain) score += 2
  if (hasNav) score += 1

  if (!hasMain && !hasArticle) {
    issues.push({ severity: 'warning', title: 'Manglende semantisk HTML', description: 'Brug <main>, <article>, <nav> og andre semantiske tags så AI kan forstå sidens struktur.', category: 'AI-parathed' })
  }

  return { hasFaq, hasContact, hasArticle, hasMain, score, maxScore: 7, issues }
}

// === BUILD RESULTS ===

function buildCategories(checks) {
  return [
    {
      name: 'clarity',
      label: 'Klarhed & Struktur',
      score: checks.title.score + checks.headings.score,
      maxScore: checks.title.maxScore + checks.headings.maxScore,
    },
    {
      name: 'trust',
      label: 'Troværdighed',
      score: checks.security.score + checks.openGraph.score,
      maxScore: checks.security.maxScore + checks.openGraph.maxScore,
    },
    {
      name: 'content',
      label: 'Indholdskvalitet',
      score: checks.content.score + checks.metaDescription.score,
      maxScore: checks.content.maxScore + checks.metaDescription.maxScore,
    },
    {
      name: 'aiReady',
      label: 'AI-parathed',
      score: checks.structuredData.score + checks.aiReadiness.score + checks.robots.score,
      maxScore: checks.structuredData.maxScore + checks.aiReadiness.maxScore + checks.robots.maxScore,
    },
    {
      name: 'conversion',
      label: 'Konverteringsparathed',
      score: checks.links.score + checks.images.score + checks.language.score,
      maxScore: checks.links.maxScore + checks.images.maxScore + checks.language.maxScore,
    },
    {
      name: 'technical',
      label: 'Teknisk Grundlag',
      score: checks.mobile.score + checks.canonical.score + checks.performance.score + checks.accessibility.score,
      maxScore: checks.mobile.maxScore + checks.canonical.maxScore + checks.performance.maxScore + checks.accessibility.maxScore,
    },
  ]
}

function collectIssues(checks) {
  const all = []
  for (const check of Object.values(checks)) {
    if (check.issues) all.push(...check.issues)
  }
  // Sort: critical first, then warning, then info
  const order = { critical: 0, warning: 1, info: 2 }
  return all.sort((a, b) => (order[a.severity] || 2) - (order[b.severity] || 2))
}

function collectRecommendations(checks, score) {
  const recs = []

  if (!checks.structuredData.hasSchema) {
    recs.push({
      priority: 'high',
      title: 'Tilføj struktureret data (JSON-LD)',
      description: 'Implementer schema.org markup så AI-systemer kan forstå dit indhold præcist. Start med Organization og WebSite schema.',
      impact: 'Markant bedre AI-synlighed',
    })
  }

  if (checks.metaDescription.score < 10) {
    recs.push({
      priority: 'high',
      title: 'Optimer meta description',
      description: 'Skriv en klar, overbevisende meta description på 80-155 tegn der præcist beskriver sidens indhold.',
      impact: 'Bedre forståelse og visning i AI-svar',
    })
  }

  if (checks.content.wordCount < 300) {
    recs.push({
      priority: 'high',
      title: 'Udvid sidens indhold',
      description: 'Tilføj mere relevant indhold. Sider med mindst 300 ord har markant bedre synlighed i AI-systemer.',
      impact: 'Højere relevans-score i AI-søgning',
    })
  }

  if (!checks.aiReadiness.hasMain && !checks.aiReadiness.hasArticle) {
    recs.push({
      priority: 'medium',
      title: 'Brug semantisk HTML',
      description: 'Wrap dit hovedindhold i <main> og <article> tags. Det gør det meget lettere for AI at identificere dit kerneindhold.',
      impact: 'Bedre indholds-parsing af AI',
    })
  }

  if (!checks.openGraph.hasOg) {
    recs.push({
      priority: 'medium',
      title: 'Tilføj Open Graph meta tags',
      description: 'Tilføj og:title, og:description og og:image for bedre visning når dit indhold deles eller refereres af AI.',
      impact: 'Bedre deling og AI-referencer',
    })
  }

  if (checks.headings.h1Count !== 1) {
    recs.push({
      priority: 'high',
      title: 'Fiks H1-overskriften',
      description: checks.headings.h1Count === 0
        ? 'Tilføj én klar H1-overskrift der beskriver sidens hovedemne.'
        : 'Reducer til én H1 per side. Brug H2/H3 for underoverskrifter.',
      impact: 'Klarere emneforståelse for AI',
    })
  }

  if (!checks.canonical.canonical) {
    recs.push({
      priority: 'low',
      title: 'Tilføj canonical tag',
      description: 'Sæt et canonical link element for at undgå duplikatindhold-problemer.',
      impact: 'Undgår forvirring ved duplikatsider',
    })
  }

  if (checks.images.withoutAlt > 0) {
    recs.push({
      priority: 'medium',
      title: 'Tilføj alt-tekst til billeder',
      description: 'Alle billeder bør have beskrivende alt-tekst. Det er vigtigt for både tilgængelighed og AI-forståelse.',
      impact: 'Bedre indholds-kontekst for AI',
    })
  }

  if (!checks.security.isHttps) {
    recs.push({
      priority: 'high',
      title: 'Skift til HTTPS',
      description: 'HTTPS er grundlæggende for sikkerhed og troværdighed. Det er et krav for top-placeringer.',
      impact: 'Kritisk for troværdighed',
    })
  }

  if (!checks.language.lang) {
    recs.push({
      priority: 'medium',
      title: 'Angiv sidesprog',
      description: 'Tilføj lang="da" til <html> tagget så AI ved at indholdet er dansk.',
      impact: 'Korrekt sprogforståelse',
    })
  }

  // Sort by priority
  const order = { high: 0, medium: 1, low: 2 }
  return recs.sort((a, b) => (order[a.priority] || 2) - (order[b.priority] || 2))
}

function buildSummary(score, url, checks) {
  const domain = new URL(url).hostname

  if (score >= 80) {
    return `${domain} har en stærk AI-parathed. Din side er godt struktureret og klar til at blive fundet af AI-søgemaskiner. Se detaljerne nedenfor for de sidste optimeringer.`
  } else if (score >= 60) {
    return `${domain} har et godt fundament, men der er vigtige forbedringer der kan øge din AI-synlighed markant. Fokuser på de højt prioriterede anbefalinger nedenfor.`
  } else if (score >= 40) {
    return `${domain} har plads til væsentlige forbedringer. Flere vigtige elementer mangler, som AI-systemer bruger til at forstå og anbefale dit indhold. Se de kritiske problemer nedenfor.`
  } else {
    return `${domain} har en lav AI-parathedsscore. Grundlæggende elementer mangler, som gør det svært for AI at finde og forstå dit indhold. Vi anbefaler at prioritere de kritiske forbedringer nu.`
  }
}

module.exports = { scanSite }
