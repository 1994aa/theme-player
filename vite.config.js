import { createReadStream, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { defineConfig } from 'vite';

const AUDIO = /\.(mp3|m4a|aac|ogg|opus|wav|flac)$/i;
const TYPES = { '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.ogg': 'audio/ogg', '.opus': 'audio/ogg', '.wav': 'audio/wav', '.flac': 'audio/flac' };
const SONGS = join(import.meta.dirname, 'songs');

// Songs not listed in songs/themes.json get a theme from keywords in their name;
// anything that matches nothing goes to the night theme.
const GUESS = [
  ['truck', /honey ?singh|badshah|raftaar|diljit|punjab|mastjatt|remix|mashup|\bdj\b|party|bhangra|jatt|gabru|kudi/i],
  ['saloon', /kumar sanu|alka|udit|himesh|kishore|rafi|lata|asha|90s|retro/i],
  ['pahad', /sufi|qawwal|unplugged|acoustic|instrumental|maula|khuda|rabb|musafir|shiv|hanuman|bhajan|aarti|reprise/i],
  ['kitchen', /title (song|track)|comedy|nach|chicken|golmaal/i],
];
function songsByTheme() {
  const all = existsSync(SONGS) ? readdirSync(SONGS).filter(f => AUDIO.test(f)).sort() : [];
  const file = join(SONGS, 'themes.json');
  const saved = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  const themeOf = new Map(Object.entries(saved).flatMap(([t, names]) => names.map(n => [n, t])));
  const out = { all, truck: [], kitchen: [], night: [], pahad: [], saloon: [] };
  for (const f of all) {
    const t = themeOf.get(f) || GUESS.find(([, re]) => re.test(f))?.[0] || 'night';
    (out[t] || out.night).push(f);
  }
  return out;
}

// Dev only: lists the songs in songs/, grouped by theme (see songsByTheme).
// The song files are never copied into dist/, so they stay off the live site.
const songList = {
  name: 'song-list',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/songs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(songsByTheme()));
    });
    // Streams one song (/song?f=<file name>) with range support for seeking. Vite's own
    // static serving trips over names containing characters like "&", so songs go through here.
    server.middlewares.use('/song', (req, res) => {
      const name = new URL(req.url, 'http://local').searchParams.get('f') || '';
      const file = join(SONGS, name);
      if (!AUDIO.test(name) || basename(name) !== name || !existsSync(file)) {
        res.statusCode = 404;
        return res.end();
      }
      const size = statSync(file).size;
      const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
      const start = m && m[1] ? +m[1] : 0;
      const end = m && m[2] ? Math.min(+m[2], size - 1) : size - 1;
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Type', TYPES[extname(name).toLowerCase()] || 'application/octet-stream');
      res.setHeader('Content-Length', end - start + 1);
      if (m) {
        res.statusCode = 206;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
      }
      createReadStream(file, { start, end }).pipe(res);
    });
  },
};

export default defineConfig({
  plugins: [songList],
  base: './',
});
