# Linking Supabase to This Project

You can link your Supabase project **before** building the Expo app. The link is just config.

## 1. Add credentials to `.env`

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Settings → API**.
3. Copy **Project URL** and **anon (public) key**.
4. Put them in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

Use **anon key**, not the project database password. The password is for DB/CLI only.

## 2. Optional: Supabase CLI link

If you use the Supabase CLI for migrations:

```bash
npx supabase link --project-ref your-project-ref
```

`your-project-ref` is the ID in your URL (`https://<project-ref>.supabase.co`). You’ll be prompted to log in or use an access token.

## 3. Supabase client

The app uses a shared Supabase client in `lib/supabase.ts`. It reads `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `.env` and uses AsyncStorage for auth session persistence.

**Install deps** (run from project root):

```bash
npm install
```

If you use Expo, prefer Expo‑compatible versions:

```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

**Usage:**

```ts
import { supabase } from "@/lib/supabase";

const { data } = await supabase.from("rooms").select("*");
```

## 4. When to use what

- **Now**: Add URL + anon key to `.env`, run `npm install`. Client is in `lib/supabase.ts`.
- **When you build the app**: Import `supabase` from `lib/supabase` and use it for auth, DB, etc.
- **Schema**: Create tables in the Dashboard SQL editor, or via CLI migrations. Doesn’t depend on Expo.

## 5. Security note

If you ever put your **project password** in code or shared it, rotate it in **Settings → Database → Reset database password**.
