# Google sign-in — setup

The code is **finished and wired in**. It needs three values and two provider
settings that only you can supply. Until then the control renders disabled and
the site behaves exactly as before.

Project: `fytzfjkiuuitcndkagln` · region `ap-southeast-2` · status when last checked: booting after a restore

---

## Why it's not live yet

1. **The Supabase project was paused.** I restored it (`INACTIVE` → `COMING_UP`),
   which is why the endpoints now answer — but the management API still reports
   it as not-yet-healthy, and it refuses to mint API keys in that state:
   `422 Project must be healthy to create new API keys`.
2. **The Google provider is off.** Confirmed via the auth config:
   `external_google_enabled: false`, `external_google_client_id: null`.
3. **No Google OAuth credentials exist yet.** These can only be created in a
   Google Cloud project you own.

---

## Step 1 — Google Cloud (5 min)

1. <https://console.cloud.google.com> → create or pick a project.
2. **APIs & Services → OAuth consent screen** → External → fill in app name
   (`Suchi Spices`), support email, developer email. Add your own Google account
   under **Test users** while the app is in *Testing*.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Suchi Spices — local`
   - **Authorised JavaScript origin:** `http://localhost:5173`
   - **Authorised redirect URI** (this one is Supabase's, not the site's):
     ```
     https://fytzfjkiuuitcndkagln.supabase.co/auth/v1/callback
     ```
4. Copy the **Client ID** and **Client secret**.

> Testing mode is fine for a portfolio demo, but only accounts listed as test
> users can complete sign-in. Publish the app if you want anyone to use it.

## Step 2 — Supabase dashboard (2 min)

**Authentication → Providers → Google**

- Enable it
- Paste the Client ID and Client secret from step 1
- Save

**Authentication → URL Configuration**

- Site URL: `http://localhost:5173`
- Redirect URLs: add `http://localhost:5173`, `http://localhost:4173`,
  and your production URL later (e.g. `https://<you>.github.io/suchi-spices`)

I could not set these for you — the auth-config endpoint returns
`400 Project is paused` while the project is still coming up. Retry once it is
`ACTIVE`, or just use the dashboard.

## Step 3 — Local env (1 min)

**Project Settings → API** → copy the project URL and the **publishable / anon**
key (never the `service_role` key).

```bash
cd suchi-spices/site
cp .env.example .env.local
```

Fill in:

```
VITE_SUPABASE_URL=https://fytzfjkiuuitcndkagln.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable / anon key>
```

Restart the dev server (`npm run dev`). The control turns from disabled grey to
an active **Sign in with Google** button.

---

## How it works

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

## Verification status

Verified in headless Chromium against the dev server **without** credentials:

- Chip renders in the header and inside the mobile menu
- Correctly reports the disabled state and explains why (title attribute)
- No console errors or page errors introduced
- `tsc` clean, production build clean

**Not verified:** an actual Google round-trip. That needs steps 1–3 completed;
until then there is no client ID for Google to accept.
