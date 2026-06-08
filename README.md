# GhostWatch — Marine Conservation Tactical Dashboard

A small Next.js + Tailwind CSS dashboard prototype for monitoring marine conservation missions.

## Tech stack

- Next.js
- React
- Tailwind CSS
- Framer Motion

## Quick start

Prerequisites: Node.js (18+ recommended) and npm (or pnpm/yarn).

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm start
```

## Project structure (relevant files)

- `app/page.tsx` — main page that composes the site layout.
- `components/ui/ascii-art.tsx` — the ASCII penguin component.
- `components/ui/navbar.tsx` — navbar where the ASCII penguin is rendered as the logo.
- `components/sections/features-section.tsx` — contains the “Active Operations” label and the `Mission Brief Dashboard` heading.

## Quick tips

- To edit the penguin art, modify `components/ui/ascii-art.tsx` (it uses a `<pre>` with monospace font to preserve spacing).
- To change the navbar logo spacing/size, edit `components/ui/navbar.tsx`.
- The `Mission Brief Dashboard` heading uses Tailwind classes — switch `font-mono` → `font-sans` and add `tracking-tight` for proportional font with tight letter spacing.

## Development notes

- The site uses Tailwind utility classes for styling. Run your editor's Tailwind IntelliSense for class suggestions.
- When running the dev server, Next.js logs the local URL (http://localhost:3000).

If you want, I can add more documentation (design tokens, deployment steps, test commands). Tell me what to include.
