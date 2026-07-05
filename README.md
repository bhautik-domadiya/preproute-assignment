# Test Creation Portal

Admin app for creating and publishing academic tests. You log in, configure test metadata, add MCQ questions, preview the result, and publish when ready.

Flow: **Login → Dashboard → Create Test → Questions → Preview → Publish**

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the staging API base URL (see `.env.example`).

Other scripts:

- `npm run build` — typecheck + production build
- `npm run lint` — ESLint
- `npm run preview` — serve the production build locally

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS 4, React Router 7, React Hook Form + Zod, TanStack Query, TanStack Table, Zustand (auth), Axios, react-select, @heroicons/react, react-hot-toast.

Rich text in the question editor uses `marked` and `turndown` (markdown in, markdown out).

## Project layout

```
src/
├── api/           HTTP clients
├── components/    UI by area (layout, ui, forms, questions, preview, common)
├── features/      Zod schemas
├── hooks/         React Query wrappers
├── layouts/       App shell
├── pages/         Route screens
├── routes/        Router + auth guard
├── store/         Auth session (Zustand + localStorage)
├── types/
└── utils/
```

Design tokens live in `src/index.css`. Shared button and form classes are in `components/ui/buttonStyles.ts` and `formFieldStyles.ts`.

## Routes

| Path | Screen |
|------|--------|
| `/` | Login |
| `/dashboard` | Test list |
| `/tests/new` | Create test |
| `/tests/:id/edit` | Edit draft metadata |
| `/tests/:id/questions` | Question builder |
| `/tests/:id/preview` | Preview and publish |

All routes except `/` require a stored JWT.

## API

Axios client in `src/api/axios.ts` attaches the Bearer token and logs out on 401.

Main endpoints: `POST /auth/login`, `GET/POST/PUT/DELETE /tests`, `POST /questions/bulk`, `POST /questions/fetchBulk`, plus subject/topic/sub-topic lookups for the test form.

## Known limitations

- Schedule date/time and “Live Until” options on the preview page are UI only; publish sends `status: "live"` without scheduling fields.
- Vitest and Testing Library are in devDependencies but there is no test suite or `npm test` script yet.
- Several sidebar nav items are placeholders (no routes wired).
