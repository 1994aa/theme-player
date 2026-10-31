# theme-player (dhun.)

A music player where every theme is its own animated scene that moves with the beat:
Truck (driver's seat on the highway), Kitchen, Taaron ki Raat, Pahadon ki Chai and Saloon Shop.
Built with Vite; the scenes are SVG + CSS driven by a Web Audio analyser.

## Run

```
npm install
npm run dev
```

## Songs

Put audio files (`.mp3`, `.m4a`, `.ogg`, `.wav`, `.flac`) in `songs/`. They are not in this repository.
`songs/themes.json` says which theme each song belongs to; songs missing from it get a theme from
keywords in their file name (see `vite.config.js`). Songs are served only by the dev server, so
they never end up in `dist/` or on a deployed site.

## Keys

`Space` play/pause · `←` `→` previous/next · `/` search · `Esc` close the song list
