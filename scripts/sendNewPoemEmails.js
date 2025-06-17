#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config({ path: '.env.local' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const poemsPath = path.join(__dirname, '../src/data/poems.json')
const poems = JSON.parse(fs.readFileSync(poemsPath, 'utf8'))

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const statePath = path.join(__dirname, 'last_poem_id.txt')
let lastId = 0
if (fs.existsSync(statePath)) {
  lastId = parseInt(fs.readFileSync(statePath, 'utf8'), 10) || 0
}

const newPoems = poems.filter(p => p.id > lastId)

async function main() {
  if (newPoems.length === 0) {
    console.log('No new poems found')
    return
  }

  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('email')

  if (error) {
    console.error('Failed to retrieve subscribers:', error)
    return
  }

  for (const poem of newPoems) {
    for (const sub of subscribers) {
      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: sub.email,
        subject: `New Poem: ${poem.title}`,
        text: `A new poem titled "${poem.title}" has been added.`
      })
      console.log(`Sent notification to ${sub.email} for poem "${poem.title}"`)
    }
    if (poem.id > lastId) {
      lastId = poem.id
    }
  }

  fs.writeFileSync(statePath, String(lastId))
}

main()
