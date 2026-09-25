# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pigpen CipherLab is a visual learning tool for the Pigpen cipher (ピッグペン暗号), a historical substitution cipher used by the Freemasons in the 18th century. The project is part of the "100 Security Tools with Generative AI" initiative (生成AIで作るセキュリティツール100).

## Architecture

This is a static web application with no build process or dependencies. Classic scripts allow both HTTP and file:// use:
- `index.html` - Main HTML file with three tabs and help modal
- `script.js` - JavaScript handling tab switching, cipher operations, and UI state
- `js/pigpen-core.js` - Pure model and cipher operations; also exported through conditional CommonJS
- `js/i18n.js` - Japanese/English dictionaries and language selection
- `style.css` - Styling with responsive design and animations
- `assets/glyphs/{1,2,3}/` - Three glyph sets, each containing `A.svg` through `Z.svg` and `key_mapping.svg`

## Key Implementation Details

**Tab System**: Three tabs with synchronized glyph set selection across tabs:
- Encryption tab: Real-time text-to-glyph conversion with character highlighting
- Decryption tab: Click glyphs to build decoded text
- Learning tab: Educational content with interactive key mapping display

**Cipher State** (in `script.js`): one object with `variant`, `spaceMode`, `text` and `decodeItems`.
All three key selectors share one change handler. `render()` derives the selectors, reference, ciphertext,
warnings, decoding keys and reading, and learning diagram from that state. Do not add independent per-tab mapping state.
Decoding stores shape IDs, not letters. Switching a mapping rereads those same symbols and uses `?` for missing shapes.

**Glyph File Structure**: per-letter paths must be validated through the core. Encryption uses core tokens;
the entered decoding sequence uses `glyphSource`. Existing SVG elements must not be redrawn or changed.

**Symbol Model**: `g:<walls>:<dots>` uses walls ordered T, R, B, L. `x:<region>:<dots>` uses top T,
left L, right R, bottom B. Sets 1 and 2 share the same 26 symbols; set 3 shares nine symbols with set 1.
Each set has 26 distinct symbols. The tests compare the lines and dots of all 78 glyph SVGs against this model.
The core reference implementation is independent of the DOM, storage, window and dictionaries.

**Normalization**: NFKD, remove combining marks, then uppercase. Only A–Z are letters. Preserve mode keeps
LF as a line break and other whitespace as spaces; ignore mode drops whitespace. Other characters are counted and discarded.
HELLO WORLD entered with set 1 reads HEPPS WSVPD with set 2 and ??GGP ?PYG? with set 3.

**Language**: all visible and accessible text belongs in matching `ja` and `en` dictionary keys.
Use `data-i18n` and attribute-specific bindings; never insert translated HTML. UI/core scripts have no Japanese literals
outside comments. Language priority is `?lang=ja|en`, localStorage `pigpen-language`, then navigator.language.
Storage access is guarded. Only language is stored; tab, plaintext, key mapping and symbol sequence are retained in memory.

**Security**: keep strict same-origin script/style CSP without unsafe-inline or unsafe-eval. No inline handlers,
style attributes, element.style assignments, innerHTML, external requests or dependencies. Use textContent and DOM methods.
GitHub Pages cannot enforce frame-ancestors through a meta tag, so do not add that directive to meta CSP.

**UI Features**: Help modal (❓ button), ESC key to close modal, toast notifications for clipboard copy

## Development

Open `index.html` directly in a browser or use any static file server. No package installation is required.
Run `npm test` with Node.js 22 (node --test). GitHub Actions runs the same command on push and pull_request.

| Test file | Purpose |
|---|---|
| core.test.js | Known answers for all mappings, normalization, encryption, rereading and 78 SVG shapes |
| html.test.js | CSP, accessibility markup and prohibited rendering patterns |
| i18n.test.js | Matching dictionary keys/placeholders and no Japanese literals in UI/core code |
| contrast.test.js | Eight CSS-variable pairs must reach 4.5:1 |
| format.test.js | JS/CSS/test lines <=160; HTML <=250; readable source line-count floors |
| readme.test.js | Recompute four known-answer rows, compare 15 sections, trees, image references and YAML |

Minimum line counts: style.css 600, index.html 250, script.js 250, pigpen-core.js 60, i18n.js 200.
The i18n.js minimum was enabled only after the stage-4 full dictionary migration, as explicitly approved.
Keep tests and known answers intact; extend counts only for specified additions.

Screenshots use external Python Playwright tooling: 1280×1000 (up to 1200 high), DPR 1, reduced motion,
fresh storage, local HTTP, 500ms stabilization, viewport capture. Archive old images outside this repository.

## Deployment

GitHub Pages at: https://ipusiron.github.io/pigpen-cipherlab/ (`.nojekyll` file present)
