# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pigpen CipherLab is a visual learning tool for the Pigpen cipher (ピッグペン暗号), a historical substitution cipher used by the Freemasons in the 18th century. The project is part of the "100 Security Tools with Generative AI" initiative (生成AIで作るセキュリティツール100).

## Architecture

This is a static web application with no build process or dependencies:
- `index.html` - Main HTML file with three tabs and help modal
- `script.js` - JavaScript handling tab switching, cipher operations, and UI state
- `style.css` - Styling with responsive design and animations
- `assets/glyphs/{1,2,3}/` - Three glyph sets, each containing `A.svg` through `Z.svg` and `key_mapping.svg`

## Key Implementation Details

**Tab System**: Three tabs with synchronized glyph set selection across tabs:
- Encryption tab: Real-time text-to-glyph conversion with character highlighting
- Decryption tab: Click glyphs to build decoded text
- Learning tab: Educational content with interactive key mapping display

**Global State** (in `script.js`):
- `currentGlyphSet`: "1", "2", or "3" - synced across all tab selectors
- `spaceMode`: "ignore" or "preserve" - controls whitespace handling in encryption

**Glyph File Structure**: SVG files are loaded dynamically via `assets/glyphs/${currentGlyphSet}/${letter}.svg`

**UI Features**: Help modal (❓ button), ESC key to close modal, toast notifications for clipboard copy

## Development

Open `index.html` directly in a browser or use any static file server. No npm/yarn required.

## Deployment

GitHub Pages at: https://ipusiron.github.io/pigpen-cipherlab/ (`.nojekyll` file present)