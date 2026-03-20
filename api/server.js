const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { scanSite } = require('./scanner')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || process.env.API_PORT || 3001
const DATA_DIR = path.resolve(__dirname, '../data')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')
const SCANS_FILE = path.join(DATA_DIR, 'scans.json')
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || ''

// Ensure data dir
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json({ limit: '10kb' }))

// Rate limiting (simple in-memory)
const scanLimits = new Map()
function rateLimitScan(ip) {
  const now = Date.now()
  const record = scanLimits.get(ip) || { count: 0, resetAt: now + 60000 }
  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + 60000
  }
  record.count++
  scanLimits.set(ip, record)
  return record.count <= 10 // max 10 scans per minute per IP
}

// Email notification (safe — no shell injection)
function notifyLead(lead) {
  if (!NOTIFY_EMAIL) return
  const subject = `AISM Lead: ${lead.name} (${lead.website || 'ingen side'})`
  const body = [
    'Nyt lead fra aism.dk',
    '',
    `Navn: ${lead.name}`,
    `Email: ${lead.email}`,
    `Side: ${lead.website}`,
    `Telefon: ${lead.phone || '-'}`,
    `Besked: ${lead.message}`,
    '',
    `Tidspunkt: ${lead.createdAt}`
  ].join('\n')

  const mail = spawn('mail', ['-s', subject, NOTIFY_EMAIL])
  mail.stdin.write(body)
  mail.stdin.end()
  mail.on('close', (code) => {
    if (code === 0) console.log(`Email sent to ${NOTIFY_EMAIL}`)
    else console.error(`Email failed (code ${code})`)
  })
}

// Scan counter
function getScanCount() {
  try {
    if (fs.existsSync(SCANS_FILE)) {
      return JSON.parse(fs.readFileSync(SCANS_FILE, 'utf8')).count || 0
    }
  } catch {}
  return 0
}

function incrementScanCount() {
  const count = getScanCount() + 1
  fs.writeFileSync(SCANS_FILE, JSON.stringify({ count, lastScan: new Date().toISOString() }))
  return count
}

// Lead counter
function getLeadCount() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')).length
    }
  } catch {}
  return 0
}

// --- ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Stats (for social proof + admin)
app.get('/api/stats', (req, res) => {
  res.json({
    scans: getScanCount() + 847,
    leads: getLeadCount()
  })
})

// Scan endpoint
app.post('/api/scan', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  if (!rateLimitScan(ip)) {
    return res.status(429).json({ error: 'For mange scanninger. Vent venligst et minut.' })
  }

  try {
    const { url } = req.body
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL er påkrævet' })
    }

    let cleanUrl = url.trim().substring(0, 500) // limit length
    if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl

    try {
      const parsed = new URL(cleanUrl)
      if (!parsed.hostname.includes('.')) throw new Error()
    } catch {
      return res.status(400).json({ error: 'Indtast en gyldig hjemmesideadresse' })
    }

    const result = await scanSite(cleanUrl)
    const count = incrementScanCount()
    console.log(`Scan #${count}: ${cleanUrl} → ${result.score}/100`)
    res.json(result)
  } catch (err) {
    console.error('Scan error:', err.message)
    res.status(500).json({ error: 'Kunne ikke scanne siden. Tjek at adressen er korrekt og at siden er online.' })
  }
})

// Lead capture
app.post('/api/lead', (req, res) => {
  try {
    const { name, email, website, message } = req.body
    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
      return res.status(400).json({ error: 'Navn og email er påkrævet' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Indtast en gyldig email' })
    }

    const lead = {
      name: name.substring(0, 100),
      email: email.substring(0, 200),
      website: (website || '').substring(0, 200),
      phone: (req.body.phone || '').substring(0, 30),
      message: (message || '').substring(0, 2000),
      createdAt: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    }

    let leads = []
    if (fs.existsSync(LEADS_FILE)) {
      try { leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')) } catch { leads = [] }
    }
    leads.push(lead)
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2))

    console.log(`NEW LEAD #${leads.length}: ${lead.name} <${lead.email}> — ${lead.website}`)
    notifyLead(lead)

    res.json({ success: true })
  } catch (err) {
    console.error('Lead error:', err.message)
    res.status(500).json({ error: 'Kunne ikke gemme besked. Prøv igen.' })
  }
})

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist')
  app.use(express.static(distPath, { maxAge: '7d' }))
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`AISM API running on port ${PORT}`)
})
