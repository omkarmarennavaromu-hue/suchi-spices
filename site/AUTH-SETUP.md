# Google sign-in — setup

**Status: working on both local and the live Vercel site.** Clicking the nav chip
on <https://suchi-spices.vercel.app> opens Google's real sign-in screen.

Project `fytzfjkiuuitcndkagln` · region `ap-southeast-2` · production URL
`https://suchi-spices.vercel.app`

---

## Current state — everything already done

| Step | Status |
|---|---|
| Supabase project was **paused** | ✅ Restored (`INACTIVE` → `ACTIVE`). **Re-pause it if you don't want it running.** |
| Auth service reachable | ✅ `GET /auth/v1/settings` → `200` |
| API keys | ✅ Existing `publishable` + `anon` pair reused — no new key minted |
| Google provider enabled in Supabase | ✅ Client ID + secret saved by you in the dashboard |
| `site_url` | ✅ `https://suchi-spices.vercel.app` |
| Redirect allowlist | ✅ localhost `:5173`/`:5174`/`:4173`, `suchi-spices.vercel.app`, both Vercel alias domains, `https://*-omkarmarennavaromu-hues-projects.vercel.app` (previews), `https://omkarmarennavaromu-hue.github.io` |
| Vercel environment variables | ✅ `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` added for production + preview + development |
| Production redeployed | ✅ Fresh build `dpl_AXXpLhdhK6Jiz2vKDzg3T9gCN7m3` promoted to `suchi-spices.vercel.app` |
| Google Cloud redirect URI | ✅ `https://fytzfjkiuuitcndkagln.supabase.co/auth/v1/callback` |

The earlier "not updating" symptom had **two** causes, both now fixed:

1. **The Vercel project had no environment variables at all.** Without
   `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` the client builds itself as
   unconfigured and the chip renders disabled — so tapping it did nothing.
2. **The site had never been rebuilt since the auth code was pushed.** Automatic
   deploys on push are switched off for this project, so the commit containing
   the auth code was in GitHub but not on the live URL. A manual redeploy was
   required.

---

## Verified, end to end, on the live URL

Checked in a real headless Chromium against <https://suchi-spices.vercel.app>:

- The served JS bundle contains the Supabase URL and anon key (so the build
  picked up the env vars).
- Header shows an **enabled** `SIGN IN WITH GOOGLE` chip.
- Clicking it navigates to
  `https://accounts.google.com/v3/signin/identifier?...` — Google's genuine
  sign-in screen, reading *"Sign in — to continue to fytzfjkiuuitcndkagln.supabase.co"*.
- `redirect_uri=https://fytzfjkiuuitcndkagln.supabase.co/auth/v1/callback` and
  `redirect_to=https://suchi-spices.vercel.app/` — both correct.
- Zero console or page errors.

Screenshots: `audit/auth-06-vercel-nav.png`, `audit/auth-07-vercel-google.png`.

**Still unverified:** the trip *back* from Google after entering a password
(Supabase callback → session → avatar chip). That needs a real Google password,
which I don't have. If you sign in and land back on the site without your
avatar appearing, tell me what the URL bar says and I'll fix it.

---

## If you ever need to redo this from scratch

### 1. Google Cloud

1. <https://console.cloud.google.com> → pick the project.
2. **APIs & Services → OAuth consent screen** → External → app name
   `Suchi Spices`, support email, developer email. Add Google accounts under
   **Test users** while the app is in *Testing*.

   > Testing mode only lets listed accounts sign in. Click **Publish app** if you
   > want anyone to be able to use it.

3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorised JavaScript origins** — origins only, no paths, no trailing `/`:
     ```
     http://localhost:5173
     https://suchi-spices.vercel.app
     ```
   - **Authorised redirect URIs** — this is Supabase's URL, *not* the site's:
     ```
     https://fytzfjkiuuitcndkagln.supabase.co/auth/v1/callback
     ```
   - Copy the **Client ID** and **Client secret**.

> **The mistake to avoid:** the `.../auth/v1/callback` URL contains a path, so
> Google rejects it if you paste it into *Authorised JavaScript origins*
> ("Invalid Origin: URIs must not contain a path"). It belongs only in
> *Authorised redirect URIs*. Getting these two boxes mixed up is what causes the
> red `Error 400: redirect_uri_mismatch` screen.

### 2. Supabase dashboard

**Authentication → Providers → Google** → enable, paste Client ID + secret, save.

**Authentication → URL Configuration**

- Site URL: `https://suchi-spices.vercel.app`
- Redirect URLs: add every origin the app can be served from, including
  `http://localhost:5173` for local work.

### 3. Environment variables

Locally, `site/.env.local` (git-ignored):

```
VITE_SUPABASE_URL=https://fytzfjkiuuitcndkagln.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable / anon key — never service_role>
```

On Vercel: **Project → Settings → Environment Variables** → add the same two
names, each ticked for Production, Preview and Development. **Then redeploy** —
Vite bakes env values in at build time, so variables added after a build do
nothing until you rebuild.

---

## How the code works

| File | Role |
|---|---|
| `src/lib/supabase.ts` | Client, PKCE flow, `detectSessionInUrl`, custom storage key. Returns `null` when env is missing, so nothing throws. |
| `src/auth/AuthProvider.tsx` | Session context. Restores on load, subscribes to `onAuthStateChange`, strips `?code=`/`#access_token=` from the URL after the redirect. |
| `src/components/ui/AccountChip.tsx` | The control. Signed out → bordered Google button. Signed in → avatar + first name + dropdown (name, email, sign out). Escape and outside-click close it. Also renders in the mobile menu. |
| `src/components/Navigation.tsx` | Mounts the chip in the header (desktop) and in the mobile menu panel. |

Design notes:

- **Both states are real HTML text**, not images — the name, email and sign-out
  are readable and focusable.
- **Signed out is a valid state.** Nothing is gated; the whole site stays
  browsable. The chip is the only surface that changes.
- **Labelled as concept auth** inside the account dropdown, consistent with the
  rest of the site's disclosures.
- The anon key is designed to be public — Supabase authorises with row-level
  security. No `service_role` key is used or referenced anywhere in the client.
- Only a display name and avatar URL are read from the session. Nothing is
  written to a database; there are no tables and no user records beyond the
  auth entry Supabase creates.

---

## Security follow-ups for you

1. **Rotate the Google client secret.** It was pasted into a chat window, so
   treat it as public. Google Cloud → **Credentials** → your OAuth client →
   **Reset secret** → paste the new value into Supabase → Providers → Google.
   Sign-in keeps working afterwards; nothing else changes.
2. **Revoke the GitHub tokens** used during the push. GitHub → **Settings →
   Developer settings → Personal access tokens** → delete them. Safe to do; the
   repo is already pushed.
3. **Re-pause the Supabase project** if you don't want it running — but note
   that pausing it breaks Google sign-in, because the provider lives there.
