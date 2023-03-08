# HoloCure Build Maker

Tech Stack:
- Framework - [SvelteKit](https://kit.svelte.dev/)
- Database - [Redis](https://redis.io/)
- Deployment - [Vercel](https://vercel.com/)

## Development

Install dependencies:
```bash
npm install
```

Start server:
```bash
npm run dev
```

## Production

Create production build:
```bash
npm run build
```

Run production build locally:
```bash
npm run preview
```

### Notes

Stores with a quotation mark don't seem to be reactive compared to ones without, so I removed it from Ina's name.