# The Pocket Chaplain

*Support for those who serve.* A mobile-friendly web app for law enforcement officers, staff, and their families: prayer, encouragement, and quick access to a chaplain, a pastor, or a trusted friend. It assists the chaplain's ministry; it does not replace it.

**Status: working prototype.** Forms work, but storage is a local file and admin sign-in is a single shared password. Don't collect real information until you've done the steps in [LAUNCH.md](LAUNCH.md).

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
cd pocket-chaplain
npm install
npm run dev
```

Open http://localhost:3000. To try it on your phone, connect the phone to the same Wi-Fi and open `http://<your-computer's-IP>:3000`.

**Admin area:** http://localhost:3000/admin. In `npm run dev` with no password configured, the temporary password is `pocket-chaplain-preview` (shown on the sign-in page).

To set your own password (required for `npm run build && npm start` or any shared deployment):

```bash
cp .env.example .env.local   # then edit both values
```

## What's included

| Screen | Path | Notes |
|---|---|---|
| Home | `/` | "Support for those who serve," daily encouragement, three large Reach buttons, Prayer, Pocket Chaplain, Share an Idea |
| Reach a Chaplain | `/reach/chaplain` | Call/Text buttons when an admin has set a number; follow-up request form always available |
| Reach My Pastor / a Friend | `/reach/pastor`, `/reach/friend` | Name + phone saved **only in the officer's browser** (localStorage). Never sent to the server; admins can't see it |
| Pocket Chaplain | `/pocket-chaplain` | Searchable library, filter by situation; **Save** any entry as a favorite (kept on the device; `?topic=saved` shows them) |
| How am I doing? | `/check-in` | Private check-in with suggestions; "Not okay" goes straight to 988/911 and Reach buttons. Answers stay on the device; optional on-device history |
| For families | `/family` | Prayers for spouses and children (library entries tagged "For spouses & families"), family resources, chaplain access |
| Daily reminder | `/reminder` | Optional daily notification of today's encouragement (Web Push, see LAUNCH.md §5) or a calendar reminder built on the device |
| Offline | `public/sw.js` | Installable on the home screen; main pages and contacts work without a signal (production builds only). Never caches `/admin` or `/api` |
| Take a moment | `/pocket-chaplain/take-a-moment` | Guided breathing (4-4-6, four breaths) and optional prayer; respects reduced-motion |
| Prayer | `/prayer` | Anonymous option, "chaplain team only" or "approved prayer group," sensitive-info reminder |
| Share an Idea | `/share-an-idea` | Anonymous option, confirmation on submit |
| Resources | `/resources` | Chaplain, peer, grief, counseling, family, crisis |
| Privacy / About | `/privacy`, `/about` | Plain-language privacy notice; what the app is and isn't |
| Admin | `/admin` | Review/mark/archive/delete submissions; edit chaplain contact, encouragements, library, resources, department name, badge and contact details, prototype banner |

Call and Text use `tel:` and `sms:` links, which open the phone's own dialer or messages app; nothing is dialed or sent automatically. The 911/988 notice appears in the footer of every page.

## Placeholders to replace

Everything in `[square brackets]` is a placeholder and is highlighted on screen. Replace them from the admin area:

- **Settings:** department name, plus an optional department badge (shown beside The Pocket Chaplain logo) and precinct/office address, phone, email and website (shown in a "Your department" box on Home and About)
- **Chaplain contact:** name, call/text numbers, availability
- **Resources:** department chaplain program, peer support team, EAP, local grief group, counselor, family network. COPLINE, 988, and 911 are filled in; verify before launch.
- **Privacy page:** privacy contact and "last updated" date (in `src/app/privacy/page.tsx`)
- **Logo:** your logo is in place (original in `brand/`; web sizes in `public/` and `src/app/icon.png` / `apple-icon.png`).

Starter content lives in `src/lib/seed.ts` and is copied to `data/store.json` on first run. Scripture is KJV (public domain).

## Project layout

```
src/app/            pages, plus actions.ts (public forms) and admin/actions.ts
src/components/     UI pieces; admin/ has the editors
src/lib/store.ts    ALL storage goes through here (swap this for a real database)
src/lib/auth.ts     admin session (swap this for real accounts)
src/lib/seed.ts     starter content
data/store.json     prototype data file (git-ignored, contains submissions)
```
