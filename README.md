# HoloCure Build Maker

Made in [SvelteKit](https://kit.svelte.dev/).

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

Deploy to gh-pages branch:
```bash
npm run deploy
```

### Notes

The empty `.nojekyll` is for telling GitHub Pages to not build the site with Jekyll, since it discards files and directories that start with `_`, and SvelteKit's build structure has such a directory (`_app`).

Stores with a quotation mark don't seem to be reactive compared to ones without, so I removed it from Ina's name.