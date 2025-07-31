# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pigpen CipherLab is a visual learning tool for the Pigpen cipher (ピッグペン暗号), a historical substitution cipher used by the Freemasons in the 18th century. The project is part of the "100 Security Tools with Generative AI" initiative (生成AIで作るセキュリティツール100).

## Architecture

This is a static web application with a simple structure:
- `index.html` - Main HTML file with three tabs (encryption, decryption, learning)
- `script.js` - JavaScript handling tab switching and cipher operations
- `style.css` - Styling for the application
- `assets/glyphs/` - Directory containing SVG images for each letter's Pigpen cipher symbol

## Key Implementation Details

1. **Tab System**: Three tabs implemented with vanilla JavaScript:
   - 🔐 Encryption tab: Converts English text to Pigpen cipher symbols
   - 🔓 Decryption tab: Click cipher symbols to decode to text
   - 📘 Learning tab: Educational content about Pigpen cipher

2. **Cipher Mapping**: The application expects SVG files in `assets/glyphs/` named `A.svg` through `Z.svg` for each letter's corresponding Pigpen symbol.

3. **Text Processing**: Input text is converted to uppercase and non-alphabetic characters are stripped before encryption.

## Development Commands

This is a static web application with no build process or dependencies:
- To run: Open `index.html` directly in a web browser or serve with any static file server
- No npm/yarn commands required
- No testing framework currently in place
- No linting configuration

## GitHub Pages Deployment

The project includes a `.nojekyll` file, indicating it's designed for GitHub Pages deployment. The demo is available at: https://ipusiron.github.io/pigpen-cipherlab/