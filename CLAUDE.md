# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog site for sakibhasan.dev. Built with Astro 6, deployed to Cloudflare Workers via the `@astrojs/cloudflare` adapter.

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Build for production (outputs to `dist/`)
- `pnpm preview` — Build then preview locally
- `pnpm deploy` — Build and deploy to Cloudflare Workers via Wrangler
- `pnpm generate-types` — Regenerate Cloudflare Worker types (`worker-configuration.d.ts`)

## Architecture

- **Framework**: Astro 6 with hybrid rendering — pages are static by default, server-rendered pages use `export const prerender = false`
- **Adapter**: Cloudflare Workers (`wrangler.jsonc` config). Bindings available: `EMAIL` (send_email), `SESSION` (KV namespace)
- **Styling**: Tailwind CSS v4 via Vite plugin, shadcn/ui (radix-nova style), CSS variables defined in `src/styles/global.css`
- **UI components**: shadcn/ui components live in `src/components/ui/`. Interactive components use React (`@astrojs/react` integration). Path alias `@/*` maps to `src/*`
- **Content**: Astro Content Collections with MDX. Two collections defined in `src/content.config.ts`: `blog` and `projects`, loaded from `src/content/blog/` and `src/content/projects/`
- **API routes**: `src/pages/api/` — server-side endpoints (e.g., contact form sends email via Cloudflare Email Workers using `mimetext`)
- **Fonts**: Inter (body) and JetBrains Mono (code) loaded from Google Fonts; Geist Variable via `@fontsource-variable/geist`

## Conventions

- 4-space indentation, LF line endings (see `.editorconfig`)
- TypeScript strict mode (`astro/tsconfigs/strict`)
- Package manager: pnpm
- Node >= 22.12.0
