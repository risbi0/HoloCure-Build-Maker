# HoloCure Build Maker

Made in [SvelteKit](https://kit.svelte.dev/) and deployed in [Vercel](https://vercel.com/).

Technologies used:
- [Svelte](https://svelte.dev/) - front-end framework
- [Vite](https://vitejs.dev/) - build tool
- [Redis](https://redis.io/) - database for storing build strings

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