# MTCRMS Frontend

Base frontend setup with Next.js App Router, TypeScript, Tailwind CSS, ESLint, and Prettier.

## Commands

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Environment

- Copy `.env.example` to `.env.local`
- Set `NEXT_PUBLIC_API_BASE_URL` to the backend base URL
- Set `NEXT_PUBLIC_APP_NAME` if the deployed app name differs from `MTCRMS`

## Structure

- `src/app`: app router entry, layouts, global styles
- `src/features`: feature-scoped UI and logic
- `src/components`: shared presentational components
- `src/providers`: application-level providers
- `src/services`: API and external service integration
- `src/shared`: config, constants, lib, types, utilities
