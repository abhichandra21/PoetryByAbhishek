# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Subscribing to New Poems

To let readers receive updates when a new poem is added, a simple subscription system is included.

1. Create the `subscribers` table in Supabase using the SQL below.

   ```sql
   create table if not exists subscribers (
     id uuid primary key default uuid_generate_v4(),
     email text unique not null,
     created_at timestamp with time zone default now()
   );
   ```

   Enable row level security so anyone can read but only your application can insert.
2. Deploy the site with your Supabase credentials in `.env.local`.
3. Visitors can sign up on the `/subscribe` page.
4. After adding new poems to `src/data/poems.json`, run `node scripts/sendNewPoemEmails.js` to log email notifications (replace the logging with your email service to actually send messages).


## Database Setup for Comments and Likes

To enable reflections and likes in the application create the following tables in Supabase. The easiest way is through the SQL editor in the Supabase dashboard.

### `comments` table
```sql
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  poem_id integer not null,
  author text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### `likes` table
```sql
create table if not exists likes (
  id uuid primary key default uuid_generate_v4(),
  comment_id uuid references comments(id) on delete cascade,
  session_id uuid not null,
  created_at timestamp with time zone default now()
);
```

### `poem_likes` table
```sql
create table if not exists poem_likes (
  id uuid primary key default uuid_generate_v4(),
  poem_id integer not null,
  session_id uuid not null,
  created_at timestamp with time zone default now(),
  unique(poem_id, session_id)
);
```

### Aggregated views
Create helper views so the UI can query like counts efficiently.
```sql
create or replace view poem_like_counts as
select poem_id, count(*) as likes_count
from poem_likes
group by poem_id;

create or replace view comments_with_likes as
select c.*, count(l.id) as likes_count
from comments c
left join likes l on l.comment_id = c.id
group by c.id;
```

Enable row level security on these tables and create policies so anyone can read them but only the application can insert records.

## Sending Email Notifications via GitHub and SMTP

The script `scripts/sendNewPoemEmails.js` is used to notify subscribers when new poems are committed. To actually deliver messages you need to provide SMTP credentials and run the script in CI.

1. Add an SMTP library such as `nodemailer` to the project:
   ```bash
   npm install nodemailer
   ```
   Update `scripts/sendNewPoemEmails.js` to send emails using these credentials.
2. Store your SMTP settings in GitHub repository secrets (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
3. Create a workflow in `.github/workflows/notify.yml` that installs dependencies and runs the notification script. Make sure to pass the SMTP secrets as environment variables.
4. **Using Gmail:** set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465` (or `587` for TLS), `SMTP_USER` to your Gmail address, and `SMTP_PASS` to a Gmail App Password.

With this setup each push that adds new poems can trigger the workflow and emails will be sent via your SMTP server.
