# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a Next.js 14.2 marketing website (Martek Group) using TypeScript, Tailwind CSS, and Framer Motion. It is self-contained with no database, no Docker, and no external API dependencies.

### Running the dev server

```bash
npm run dev
# → http://localhost:3000
```

### Linting

```bash
npm run lint
```

**Note:** The codebase has pre-existing `react/no-unescaped-entities` lint errors in several files. These cause `npm run build` to fail (Next.js treats lint errors as build failures by default). The dev server (`npm run dev`) works fine regardless.

### Building

`npm run build` will fail due to pre-existing lint errors. If you need a production build, you would need to either fix the lint errors or set `eslint.ignoreDuringBuilds: true` in `next.config.js`.

### Key caveats

- Node.js >= 18 is required (installed via nodesource apt repo).
- The project uses `npm` as its package manager (has `package-lock.json`).
- There is a secret Version Control Dashboard at `/site-vc` (password: `martek2024!secure`). It executes git commands via a Next.js API route at `/api/git-versions`.
- No environment variables are strictly required; `ADMIN_VC_PASSWORD` has a hardcoded fallback.
- Large `.mp4` video files are gitignored and optional; the site works without them.
