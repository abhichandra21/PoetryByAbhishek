# Poetry by Abhishek

Personal site for publishing bilingual (Devanagari + Roman) poetry with inline word lookups powered by Wiktionary and a curated fallback dictionary.

## Dictionary Workflow

- After editing `src/data/poems.json`, run `npm run check:dictionary`. If the script warns that the poems changed more recently than the cache, refresh the cache with `npm run generate:dictionary` before committing.
- All builds (`npm run build`) regenerate the static cache automatically, but keeping the cache fresh locally lets you verify meanings during development.
- To debug which source resolved a tooltip while running the dev server, drop this snippet inside `fetchWordMeaning` **only while debugging**:

  ```ts
  if (import.meta.env.DEV) {
    console.debug(`[dictionary] ${cleaned} → ${(meaning?.source ?? 'unknown').toLowerCase()}`);
  }
  ```

  Remember to remove the log before deploying if you prefer a quiet console.

Words always resolve in this order: runtime cache → static cache → Wiktionary → dictionaryapi.dev → manual translations.

## Subscribing to New Poems

To let readers receive updates when a new poem is added, a simple subscription system is included.

1. Create a `subscribers` table in Supabase with at least an `email` column.
2. Deploy the site with your Supabase credentials in `.env.local`.
3. Visitors can sign up on the `/subscribe` page.
4. After adding new poems to `src/data/poems.json`, run `node scripts/sendNewPoemEmails.js` to send email notifications.

## Google Analytics

Set your measurement ID in `.env.local`:

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The site and analytics utilities read this environment variable at runtime.

## Sending Email Notifications

`sendNewPoemEmails.js` uses `nodemailer` for SMTP delivery. Provide the following variables in `.env.local`:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_password
MAIL_FROM="Poetry Bot <bot@example.com>"
```
