# Wondercraft
A warm, tactile crafting sandbox inspired by combination games, with an original visual identity. The desk is static. A small local server remembers new pairs and asks Gemma 4 the first time anyone tries one.

## Play locally
From this folder, run `npm start` and open http://localhost:3000.

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/apikey) to turn on Gemma 4 (`gemma-4-26b-a4b-it`). Optional: `OPENROUTER_API_KEY` is used only when Gemma’s free quota runs out (`meta-llama/llama-3.3-70b-instruct:free`).

The four starters and 152 handcrafted recipes work with no key. Unknown pairs then use the local word mixer. With a key, the server asks the model once per new pair, saves that result, and serves it to every later player.

Opening `dist/index.html` directly, or `python -m http.server`, still plays the static game without the shared generator.

Drag collection tiles onto the desk and drop one onto another. Or select a workspace tile and tap/click another workspace or collection tile. Tab/Enter supports the same interaction. Right-click an item or select a field note to favorite it. Sounds are optional and synthesized locally.

## Deploy on Vercel
1. Extract this archive and push its contents to your own GitHub repository.
2. Import the repository on Vercel.
3. Use Framework Preset **Other**, Build Command `npm run build`, Output Directory `dist`. The included vercel.json sets these for you.
4. Deploy. That host serves the static desk only. Shared Gemma discoveries need `npm start` and the keys in `.env`.

## Deploy on GitHub Pages
Push to the `main` branch, then choose Settings → Pages → Source → GitHub Actions. The included workflow publishes `dist`. All asset paths are relative, so repository subpaths work. You can also manually host the contents of dist on any static host.

## Files
- dist/index.html — interface and semantic layout
- dist/style.css — responsive design and animations
- dist/app.js — pointer interactions, collection, journal, saves, daily goals, sound
- dist/recipes.js — curated recipes, local mixer, and the call to `/api/pair`
- server/index.cjs — local site and pair API
- server/craft.cjs — Gemma, Llama fallback, and the saved pair cache
- vercel.json — static deployment settings
- .github/workflows/pages.yml — GitHub Pages deployment

## Shared generator
`npm start` serves `dist/` and `POST /api/pair`. Curated recipes are answered from `dist/recipes.js`. Any other pair of known elements is looked up in `server/data/pairs.json`. A miss calls Gemma, and calls Llama only after a quota response. The reply is checked for a short plain name and one emoji before it is saved. The browser keeps model discoveries in its journal (`source: "model"`) and renders those names as text. With no key, or if both models fail, the browser uses the local word mixer and does not write that pair into the shared cache.

## Progress and daily quests
LocalStorage keeps discoveries, favorite items, recipe history, sound preference and daily stamps on this browser. Workspace layout is temporary. Undo restores the workspace only: earned discoveries remain. Export/import in Field notes backs up progress. Daily targets use the device's local calendar date, repeat through a finite target catalogue, and are not server-verified. Existing target items must be crafted again to earn today's stamp.

## Scope and verification
Every valid pair produces a result. The 152 handcrafted recipes answer first. A new pair is asked of Gemma once, saved in `server/data/pairs.json`, and reused for every later player on this server. Llama is called only after Gemma returns a quota error. With no key, the local word mixer fills in and that result is not written to the shared cache. Model names are length-checked and rendered as text. Repeated pairs stay consistent. Layout adapts for desktop and touch screens, with reduced-motion support.

## Version 2 changes
- Every pair resolves, including generated items and self-combinations.
- Larger drop tolerance checks both the pointer and tile overlap.
- Explicit rediscovery feedback, recent recipe display and release-to-discover cue.
- Generated names wrap, and progress remains compatible with version 1 saves.
