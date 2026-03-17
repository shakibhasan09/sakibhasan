# sakibhasan.dev

My personal portfolio and blog, built with [Astro 6](https://astro.build) and deployed to [Cloudflare Workers](https://workers.cloudflare.com).

## Tech Stack

- **Framework** — Astro 6 (hybrid rendering)
- **Styling** — Tailwind CSS v4 + shadcn/ui
- **Interactive UI** — React 19
- **Content** — MDX via Astro Content Collections
- **Deployment** — Cloudflare Workers
- **Contact form** — Cloudflare Email Workers (via `mimetext`)

## Getting Started

### Prerequisites

- Node.js >= 22.12.0
- [pnpm](https://pnpm.io)

### Install & Run

```bash
pnpm install
pnpm dev
```

### Build & Preview

```bash
pnpm build      # Build for production
pnpm preview    # Build and preview locally
```

### Deploy

```bash
pnpm deploy     # Build and deploy to Cloudflare Workers
```

## Project Structure

```
src/
├── components/       # Astro & React components
│   └── ui/           # shadcn/ui components
├── content/
│   ├── blog/         # Blog posts (MDX)
│   └── projects/     # Project entries (MDX)
├── layouts/          # Page layouts
├── pages/
│   ├── api/          # Server-side API routes
│   ├── blog/         # Blog pages
│   ├── projects/     # Project pages
│   ├── contact.astro
│   └── index.astro
└── styles/           # Global CSS & Tailwind config
```

## License

MIT
