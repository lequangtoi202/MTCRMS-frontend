# MTCRMS Frontend

Base frontend setup with Next.js App Router, TypeScript, Tailwind CSS, ESLint, and Prettier.

## Commands

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `docker build --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 -t mtcrms-frontend .`
- `docker run --rm -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 mtcrms-frontend`

## Environment

- Copy `.env.example` to `.env.local`
- Set `NEXT_PUBLIC_API_BASE_URL` to the backend base URL
- Set `NEXT_PUBLIC_APP_NAME` if the deployed app name differs from `MTCRMS`

When building a Docker image, pass `NEXT_PUBLIC_API_BASE_URL` as a build arg because `NEXT_PUBLIC_*` values are compiled into the frontend bundle.

## Structure

- `src/app`: app router entry, layouts, global styles
- `src/features`: feature-scoped UI and logic
- `src/components`: shared presentational components
- `src/providers`: application-level providers
- `src/services`: API and external service integration
- `src/shared`: config, constants, lib, types, utilities

## Docker

Production image uses Next.js `standalone` output with a multi-stage build.

Example:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  --build-arg NEXT_PUBLIC_APP_NAME=MTCRMS \
  -t mtcrms-frontend .

docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -e NEXT_PUBLIC_APP_NAME=MTCRMS \
  mtcrms-frontend
```
