// Finds an embeddable YouTube video for each song in tools/picks/<theme>.txt (one search per
// line, e.g. "Tum Hi Ho Aashiqui 2 Arijit Singh") and writes tools/picks/<theme>.json plus a
// "watch_videos" link that opens them as one playlist to save on YouTube.
//
//   node tools/find-youtube.mjs truck night
//
// Needs YT_API_KEY in .env.local. Each search costs 100 of the 10,000 free daily quota units,
// so about 99 songs can be looked up per day. Songs already in the .json are not searched again,
// so running it once a day (see the crontab line in README.md) works through the whole library.
// After every run, src/yt-songs.json is rebuilt from all tools/picks/*.json for the site to play.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const key = readFileSync(join(root, '.env.local'), 'utf8').match(/^YT_API_KEY=(.+)$/m)?.[1].trim();
if (!key) throw new Error('YT_API_KEY missing from .env.local');

// Official label channels are preferred over re-uploads
const OFFICIAL = /t-series|sony music|zee music|saregama|tips|eros now|yrf|speed records|venus|times music|shemaroo|desi music factory|white hill|geet mp3|jass records|humble music|t-series apna punjab|universal music india|aditya music|ultra bollywood|rajshri/i;
const JUNK = /cover|reverb|slowed|8d|karaoke|lofi|lo-fi|instrumental|ringtone|status|unplugged|reprise|remix|mashup|dance video|reaction/i;

let outOfQuota = false;
for (const theme of process.argv.slice(2)) {
  if (outOfQuota) break;
  const queries = readFileSync(join(root, 'tools/picks', `${theme}.txt`), 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
  const outFile = join(root, 'tools/picks', `${theme}.json`);
  const found = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')).songs : [];
  const done = new Set(found.map(s => s.query));

  for (const q of queries) {
    if (done.has(q)) continue;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=8&q=${encodeURIComponent(q)}&key=${key}`;
    const res = await (await fetch(url)).json();
    if (res.error) {
      console.log(`stopped at "${q}": ${res.error.message}`);
      outOfQuota = true;
      break;
    }
    const items = (res.items || []).filter(v => !JUNK.test(v.snippet.title) || JUNK.test(q));
    const pick = items.find(v => OFFICIAL.test(v.snippet.channelTitle)) || items[0];
    if (pick) {
      found.push({ query: q, id: pick.id.videoId, title: pick.snippet.title, channel: pick.snippet.channelTitle });
      console.log(`${theme}: ${q}  ->  ${pick.snippet.channelTitle}`);
    } else {
      found.push({ query: q, id: null });
      console.log(`${theme}: ${q}  ->  (nothing found)`);
    }
    writeFileSync(outFile, JSON.stringify({ songs: found }, null, 1));
  }

  // One link per 50 videos; opening it while signed in lets you "Save" it as a playlist
  const ids = [...new Set(found.map(s => s.id).filter(Boolean))];
  const links = [];
  for (let i = 0; i < ids.length; i += 50) links.push(`https://www.youtube.com/watch_videos?video_ids=${ids.slice(i, i + 50).join(',')}`);
  writeFileSync(outFile, JSON.stringify({ songs: found, links }, null, 1));
  console.log(`${theme}: ${ids.length} videos\n${links.join('\n')}\n`);
}

// The site's list of videos per theme: { theme: [{ id, title }] }, duplicates removed
const all = {};
for (const f of readdirSync(join(root, 'tools/picks')).filter(f => f.endsWith('.json'))) {
  const seen = new Set();
  all[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(root, 'tools/picks', f), 'utf8')).songs
    .filter(s => s.id && !seen.has(s.id) && seen.add(s.id))
    .map(s => ({ id: s.id, title: s.title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"') }));
}
writeFileSync(join(root, 'src/yt-songs.json'), JSON.stringify(all));
console.log('src/yt-songs.json:', Object.entries(all).map(([t, v]) => `${t} ${v.length}`).join(', '));
