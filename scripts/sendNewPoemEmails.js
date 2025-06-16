#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

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
      console.log(`Notify ${sub.email} about new poem "${poem.title}"`)
      // Integrate your email service here
    }
    if (poem.id > lastId) {
      lastId = poem.id
    }
  }

  fs.writeFileSync(statePath, String(lastId))
}

main()
