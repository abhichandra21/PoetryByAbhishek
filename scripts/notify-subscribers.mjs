import { execSync } from 'child_process'
import fs from 'fs'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const previousJson = execSync('git show HEAD^:src/data/poems.json', { encoding: 'utf8' })
const previousPoems = JSON.parse(previousJson)
const currentPoems = JSON.parse(fs.readFileSync('src/data/poems.json', 'utf8'))

const previousIds = new Set(previousPoems.map(p => p.id))
const newPoems = currentPoems.filter(p => !previousIds.has(p.id))

if (newPoems.length === 0) {
  console.log('No new poems added, exiting.')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const { data: subscribers, error } = await supabase.from('subscriptions').select('email')

if (error) {
  console.error('Error fetching subscribers', error)
  process.exit(1)
}

if (!subscribers || subscribers.length === 0) {
  console.log('No subscribers to notify.')
  process.exit(0)
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

for (const poem of newPoems) {
  const text = poem.lines.join('\n')
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    bcc: subscribers.map(s => s.email).join(','),
    subject: `New poem published: ${poem.title}`,
    text,
  })
  console.log(`Notified subscribers about poem ${poem.title}`)
}
