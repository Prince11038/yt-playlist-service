# Playlist Length

This project uses React, Vite, and Tailwind CSS v4.

## Local development

```bash
npm install
npm run dev
```

## GitHub Pages deployment

This repo is configured for:

`https://prince11038.github.io/yt-playlist-service/`

Important details:

- `vite.config.js` uses `base: "/yt-playlist-service/"`, which must match the repository name.
- `npm run deploy` now builds first and then publishes the `dist` folder.
- In GitHub, open `Settings -> Pages`.
- Set `Source` to `Deploy from a branch`.
- Select branch `gh-pages` and folder `/ (root)`.

If Pages is serving from `main` instead of `gh-pages`, the hosted site can load without the correct built assets and look different from the local version.

## Deploy

```bash
npm run deploy
```
