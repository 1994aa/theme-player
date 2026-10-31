# theme-player (dhun.)

A music player where every theme is its own animated scene that moves with the beat:
Horn OK Please (truck, driver's seat on the highway), Rasoi ki Dhun (kitchen), Taaron ki Raat, Pahadon ki Chai and Kainchi ki Taal (saloon).
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

## YouTube matches for the live site

`tools/find-youtube.mjs` matches songs listed in `tools/picks/<theme>.txt` to official YouTube
videos and writes `src/yt-songs.json`, which the site plays per theme. It needs a free YouTube Data
API key in `.env.local` (`YT_API_KEY=...`, never committed) and can look up about 99 songs a day,
continuing where it stopped. Run it once a day, by hand or from cron:

```
cd /var/www/theme-player && node tools/find-youtube.mjs kitchen pahad saloon truck night
```
