# Automata

This repository is a Finite Automata Simulator.

## Key features

- React 18 + TypeScript
- Vite for fast dev server and builds
- shadcn/ui for headless/primitive components
- Tailwind CSS (optional, commonly used with shadcn/ui)
- Opinionated project layout that is easy to extend

---

## Prerequisites

- Node.js 18+ (or your project's chosen LTS)
- npm, yarn, or pnpm (examples use `npm`)

---

## Quickstart

1. Clone the repo and install dependencies
   npm install

   Or with yarn:
   yarn

   Or with pnpm:
   pnpm install

2. Start development server
   npm run dev

3. Open the local URL printed by Vite (usually `http://localhost:5173/`)

---

## Scripts

Typical scripts you should have in `package.json`. Adjust names/commands to match your project.

- `dev` — Start Vite dev server with HMR
  npm run dev

- `build` — Create a production build (outputs to `dist`)
  npm run build

- `preview` — Preview the production build locally
  npm run preview

- `lint` — Run ESLint (if configured)
  npm run lint

- `format` — Run Prettier or other formatter (if configured)
  npm run format

- `test` — Run tests (Vitest / Jest / other; if configured)
  npm run test

If you use `yarn` or `pnpm`, replace `npm run` with the corresponding package manager.

---

## Project layout (high level)

- `index.html` — Vite HTML entry
- `src/` — Application source
  - `main.tsx` — App bootstrap
  - `App.tsx` — Root component
  - `components/` — Reusable components, often where shadcn components live
  - `styles/` — Global styles, Tailwind entry
- `public/` — Static assets
- `vite.config.ts` — Vite configuration
- `tsconfig.json` — TypeScript configuration
- `package.json` — Scripts and dependencies

Adapt this layout to your needs as the project grows.

---

## Using shadcn/ui

shadcn/ui provides composable UI primitives that you integrate into your app. The typical setup when using Tailwind:

1. Install the package(s)
   npm install @shadcn/ui

   Note: shadcn/ui may be used as a collection of component templates rather than a single published package depending on how you scaffold it. Follow the official shadcn/ui guidance for the most up-to-date setup.

2. If you use Tailwind CSS, ensure Tailwind is installed and configured:
   - Install tailwindcss and its peer deps
     npm install -D tailwindcss postcss autoprefixer
     npx tailwindcss init -p

   - Update `tailwind.config.cjs` (or `tailwind.config.ts`) `content` to include all files that use classes, for example:
     ./index.html
     ./src/\*_/_.{ts,tsx,js,jsx}

   - Add the Tailwind directives to your CSS entry (e.g. `src/styles/tailwind.css`):
     @tailwind base;
     @tailwind components;
     @tailwind utilities;

3. Add shadcn components to your project
   - shadcn provides a set of design-component templates and/or a CLI helper workflow (see official docs).
   - Compose the primitives into your components and wire up any CSS tokens or utilities you need.

4. Purge/content paths
   Ensure Tailwind's `content` (or purge) setting includes all files where classes appear (including generated component files) so classes aren't removed in production builds.

---

## Environment variables

- Use `.env` / `.env.local` for local env vars.
- Vite exposes client-safe variables that begin with `VITE_`.
  Example:
  VITE_API_URL=https://api.example.com

Access in client code with `import.meta.env.VITE_API_URL`.

---

## Building & deploying

1. Build:
   npm run build

2. Preview locally:
   npm run preview

3. Deploy the contents of `dist/` to static hosts (Vercel, Netlify, S3, Cloudflare Pages, etc.)

Host-specific notes:

- Vercel: build command `npm run build`, output directory `dist`.
- Netlify: build command `npm run build`, publish directory `dist`.

---

## Linting, formatting & pre-commit hooks

- Add ESLint and Prettier if you want consistent code style and linting.
- Consider Husky + lint-staged to run format/lint on staged files before commit.

Example dev dependencies:

- eslint, eslint-config, typescript-eslint
- prettier
- husky, lint-staged

---

## Testing

- Use Vitest or Jest + React Testing Library for unit/component tests.
- Add `test` and `test:watch` scripts in `package.json`.

---

## Troubleshooting

- Dev server errors: make sure Node version matches the project and `npm install` completed successfully.
- Missing styles in production: verify Tailwind `content` includes all component and page file paths.
- shadcn component issues: confirm styles and tokens are registered and that components are imported from the correct paths.

---

## Contributing

- Create issues for bugs or feature requests
- Open PRs with descriptive titles and linked issues (if applicable)
- Run lint/tests and update types and docs with changes

---

## License

Add a `LICENSE` file (e.g. MIT) and set the `license` field in `package.json`.

---

If you want, I can:

- Customize this README with actual scripts present in your `package.json`.
- Add a short usage example showing where to import and use a specific shadcn component.
- Generate a suggested `tailwind.config.*` snippet and a basic `src/styles/tailwind.css` file.
