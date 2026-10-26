# Kuon (九怨) — Tribute Website

A dark, atmospheric tribute website for FromSoftware's 2004 survival horror masterpiece **Kuon** (九怨), built with vanilla HTML/CSS/JS.

## Features

- **Authentic Kuon Aesthetic**: Deep ink blacks, blood reds, aged paper textures — inspired by Kyosuke Chinai's haunting promotional artwork
- **Responsive Design**: Mobile-first, works beautifully from 320px to 4K
- **Accessibility First**: Semantic HTML, ARIA labels, focus management, reduced-motion support, skip links
- **Interactive Elements**:
  - Cursor-following glow effect (desktop)
  - Lightbox gallery for artwork/covers
  - Smooth scroll navigation
  - Scroll-triggered animations (IntersectionObserver)
  - Parallax hero background
  - Mobile hamburger menu
- **Zero Dependencies**: Vanilla ES6 modules, no build step required
- **Performance**: Throttled scroll handlers, passive listeners, CSS-first animations

## Sections

1. **Hero** — Animated kanji calligraphy, atmospheric background layers
2. **Overview** — Setting, gameplay mechanics, the Kuon spell
3. **Characters** — Utsuki, Sakuya, Abe no Seimei + supporting cast
4. **Development** — Timeline, key staff credits
5. **Artwork** — Chinai's paintings, regional cover variants, concept art categories
6. **Promotional** — Novel Edition, magazine ads, posters, demo discs, soundtrack
7. **Legacy** — Cult following, FromSoftware DNA, preservation efforts

## Quick Start

```bash
# Clone and serve locally
git clone https://github.com/YOUR_USERNAME/kuon-tribute.git
cd kuon-tribute

# Serve with any static server
npx serve .
# or
python3 -m http.server 8000
# or
php -S localhost:8000
```

Open `http://localhost:8000` — no build step needed.

## Deploy to GitHub Pages

1. Push to a repository named `kuon-tribute` (or any name)
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → `main` / `root`
4. Your site lives at `https://YOUR_USERNAME.github.io/kuon-tribute/`

> **Note**: If using a custom domain, add a `CNAME` file to the root.

## Project Structure

```
kuon-tribute/
├── index.html      # Semantic HTML5 structure
├── styles.css      # Custom properties, responsive layout, animations
├── script.js       # Vanilla JS interactions (IIFE module pattern)
└── README.md       # This file
```

## Design References

- **Kyosuke Chinai** — Promotional artist (cover art, title screen, posters)
- **Nozomu Iwai** — Art director
- **Kojo Takashi & Fuwa Tomoko** — Character designers
- **Murakami Kanna** — Extra character designer (Abe no Seimei)
- **Heian-period aesthetics** — *Shinden-zukuri* architecture, *sumi-e* brush strokes, *washi* paper textures

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile Safari/Chrome current versions

Graceful degradation: core content accessible without JS; animations respect `prefers-reduced-motion`.

## License

This is an **unofficial fan tribute**. All Kuon assets, characters, and artwork © FromSoftware, Inc. and respective artists (Kyosuke Chinai, Nozomu Iwai, Kojo Takashi, Fuwa Tomoko, Murakami Kanna). This site claims no ownership.

Code (HTML/CSS/JS) released under **MIT License** — feel free to adapt for your own tribute projects.

## Credits

- Fonts: **Noto Serif JP** & **Kaisei HarunoUmi** (Google Fonts, SIL OFL)
- Research sources: Wikipedia, Video Game History Foundation Digital Archive, Internet Archive, FromSoftware official product page
- Inspired by the haunting atmosphere of *Kuon* (2004)

---

**「九怨」 — Nine Grudges. Eternity. The spell that binds the living to the dead.**