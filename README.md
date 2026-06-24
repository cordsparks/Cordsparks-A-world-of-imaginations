# CordSparks Website

A futuristic cyber-tech website for CordSparks Technology Company.

## Files

```
cordsparks/
├── index.html      ← Main HTML (all sections)
├── style.css       ← Full stylesheet (dark theme, animations, responsive)
├── script.js       ← Three.js 3D scenes + UI interactions
└── assets/         ← Place any images/icons here
```

## Running

1. Open the `cordsparks/` folder in VS Code
2. Install the **Live Server** extension (if not already)
3. Right-click `index.html` → **Open with Live Server**

The site loads Three.js from CDN — an internet connection is required for the 3D scenes and Google Fonts.

## Sections

- **Hero** — Three.js particle field, animated rings, icosahedron wireframe
- **About** — Rotating 3D cube cluster scene
- **Services** — 6 hover-animated glowing cards
- **Projects** — 4 project cards (Smart Cycling, Recipe It, 3D Portfolio, Future AI)
- **Skills** — Animated progress bars with dot-grid canvas background
- **Founder** — Elsie Muniu profile with glowing avatar ring
- **Contact** — Form with validation feedback + social links

## Customisation

- Colors: edit `--cyan`, `--violet`, `--green` in `:root` inside `style.css`
- Fonts: swap `Orbitron` / `Space Grotesk` in the `<head>` of `index.html`
- Contact email: update `hello@cordsparks.dev` in `index.html`
- Social links: replace `href="#"` with real URLs in the Founder and Contact sections
