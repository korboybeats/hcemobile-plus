# HCEMobile self-hosted fork (site)

Static copy of https://hcemobile.com suitable for GitHub Pages / Cloudflare Pages,
with online API traffic pointed at **your** Cloudflare Worker relay.

Game data (maps / ISO) is **not** included — you still load your own Xbox disc
image in the app, same as the official site.

## What was changed

| File | Change |
|------|--------|
| `api-config.js` | **New.** Set `window.HCE_API_BASE` to your Worker URL (PWA-persistent). |
| `account.js` | `HaloAccount.base()` / `function r()` now resolves: `?api=` → `window.HCE_API_BASE` → official URL. |
| `index.html` | Loads `api-config.js` before `account.js`; links `custom-controls.css`. |
| `sw.js` | Adds `api-config.js` and `custom-controls.css` to the cached SHELL list (COOP/COEP unchanged). |
| `custom-controls.css` | **New stub** for touch-button restyling (next iteration). |
| `manifest.webmanifest` | Renamed to “HCEMobile+” so the home-screen icon is distinguishable. |

Exact `account.js` patch (single expression inside `function r()`):

```js
// before
(new URLSearchParams(location.search).get("api")||"https://halo-ce-mobile.hce-mobile.workers.dev")

// after
(new URLSearchParams(location.search).get("api")||window.HCE_API_BASE||"https://halo-ce-mobile.hce-mobile.workers.dev")
```

## Before hosting

1. Deploy the Worker in `../relay` and copy its `https://….workers.dev` URL.
2. Edit `api-config.js` and replace `https://REPLACE_WITH_YOUR_WORKER.workers.dev`.

## Host on GitHub Pages

```bash
# from a new empty repo you create (your GitHub account)
cd site
git init
git add .
git commit -m "HCEMobile custom-controls fork"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Then: GitHub → Settings → Pages → Deploy from branch `main` / `/ (root)`.

Site URL will be `https://YOUR_USER.github.io/YOUR_REPO/`.

Install to iPhone: open that URL in **Safari** → Share → **Add to Home Screen**.
The service worker (`sw.js`) injects COOP/COEP the same way the official site does
(GitHub Pages itself does not send those headers).

### Optional: Cloudflare Pages

Same `site/` folder; connect the repo in the Cloudflare dashboard (Static /
no build command, output directory `.` or `/`). You can also add a `_headers`
file later if you want COOP/COEP on the first navigation before the SW activates.

## Keeping up with upstream

The official server can return HTTP `426` with `code: "update"` when
`X-Halo-Build` (from `version.json`) is too old. Re-download shell assets from
hcemobile.com into this folder (keep your patched `account.js`, `api-config.js`,
`custom-controls.css`, and the `index.html` / `sw.js` edits), bump as needed.

## Touch controls

- **Positions / sizes / opacity:** in-game **Edit layout** (already built in).
- **Look / colors:** edit `custom-controls.css`.
