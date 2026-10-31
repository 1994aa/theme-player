import './style.css';
import { THEMES } from './scenes.js';
import { YT_PLAYLISTS } from './playlists.js';

const $ = id => document.getElementById(id);
const audio = new Audio();
audio.volume = 0.9;

// Songs grouped by theme, plus `all`; the list can show this theme's songs or all of them
let songs = { all: [] };
let showAll = false, current = null;
let theme = null, idx = 0, shuffle = false;
let ctx, analyser, bins;

// 'local' plays songs/ through the dev server; 'yt' (the live site) plays each theme's
// YouTube playlist from playlists.js. In 'yt' the list holds video ids and titles come from oEmbed.
let mode = 'local';
let yt, ytReady = false, ytState = -1, ytTheme = null;
const titles = {};
const isPaused = () => (mode === 'yt' ? ytState !== 1 : audio.paused);
const name = f => (mode === 'yt' ? titles[f] || '…' : pretty(f));

// "01_-_Paani_Wala_Dance(MyMp3Song.Com).mp3" -> "Paani Wala Dance"
const pretty = f => f
  .replace(/%20/g, ' ')
  .replace(/\.[^.]+$/, '')
  .replace(/_/g, ' ')
  .replace(/\[[^\]]*\]/g, '')
  .replace(/\(?-?\s*\d{2,3}\s?kbps\)?/gi, '')
  .replace(/\s*-\s*copy\b|\(\d+\)/gi, '')
  .replace(/\((?:[^)]*\.(?:com|in|se)|wapking|djhungama)[^)]*\)?/gi, '')
  .replace(/\s*-\s*[\w.]*downloadming[\w.]*/gi, '')
  .replace(/^\s*\d+\s*[.\-]?\s*(?:-\s*)?/, '')
  .replace(/\s+/g, ' ')
  .replace(/[\s-]+$/, '')
  .trim();
const time = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
const list = () => (showAll ? songs.all : songs[theme]) || [];

// ---------- theme picker ----------
$('cards').innerHTML = Object.entries(THEMES).map(([key, t]) => `
  <a class="card" href="#${key}" data-theme="${key}">
    <div class="thumb">${t.svg}</div>
    <div class="info"><span class="emoji">${t.emoji}</span><span class="eyebrow">${t.time}</span><h3>${t.name}</h3><p>${t.desc}</p><span class="go">Gaana chalao →</span></div>
  </a>`).join('');
$('tabs').innerHTML = Object.entries(THEMES).map(([key, t]) => `<a href="#${key}" data-key="${key}">${t.emoji} <span>${t.name}</span></a>`).join('');
$('eq').innerHTML = '<i></i>'.repeat(24);

function route() {
  const key = location.hash.slice(1);
  if (!THEMES[key]) {
    theme = null;
    document.body.dataset.theme = '';
    $('home').hidden = false;
    $('stage').hidden = true;
  } else if (key !== theme) {
    theme = key;
    document.body.dataset.theme = key;
    $('home').hidden = true;
    $('stage').hidden = false;
    // The home cards hold the same SVGs; prefix ids so gradients don't resolve to a hidden copy
    $('scene').innerHTML = THEMES[key].svg.replace(/id="(\w+)"/g, 'id="s-$1"').replace(/url\(#(\w+)\)/g, 'url(#s-$1)');
    $('themeTime').textContent = `${THEMES[key].emoji} ${THEMES[key].name} · ${THEMES[key].time}`;
    // Each theme plays its own songs: if the current song isn't in this theme, switch to one that is
    if (mode === 'yt') loadYTTheme(!isPaused());
    const l = list();
    idx = l.indexOf(current);
    if (idx < 0 && mode === 'local') {
      idx = 0;
      if (!audio.paused && l.length) play(Math.floor(Math.random() * l.length));
    }
    renderList();
    renderNow();
  }
  document.body.classList.toggle('stage-on', !!theme);
  document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.key === theme));
  scrollTo(0, 0);
}
addEventListener('hashchange', route);

// ---------- player ----------
function renderList() {
  const l = list();
  const t = THEMES[theme];
  $('scope').hidden = mode === 'yt';
  $('scope').innerHTML = `<button data-scope="theme" class="${showAll ? '' : 'on'}">${t ? t.emoji : ''} Is theme ke (${(songs[theme] || []).length})</button><button data-scope="all" class="${showAll ? 'on' : ''}">Sab gaane (${songs.all.length})</button>`;
  // Search: every typed word must appear in the song's name or file name
  const words = $('search').value.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = l.map((f, i) => [f, i]).filter(([f]) => {
    const text = `${name(f)} ${f}`.toLowerCase();
    return words.every(w => text.includes(w));
  });
  const esc = s => s.replace(/[&<>"]/g, c => `&#${c.charCodeAt(0)};`);
  $('list').innerHTML = hits.length
    ? hits.map(([f, i]) => `<li><button data-i="${i}" class="${f === current ? 'on' : ''}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(name(f))}</button></li>`).join('')
    : words.length
      ? `<li class="empty">"${esc($('search').value.trim())}" se koi gaana nahi mila.${showAll ? '' : '<br><button class="link" data-scope="all">Sab gaane mein dhoondo →</button>'}</li>`
      : mode === 'yt'
        ? `<li class="empty">${YT_PLAYLISTS[theme] ? 'Playlist load ho rahi hai…' : 'Is theme ki YouTube playlist abhi set nahi hai.'}</li>`
        : `<li class="empty">Is theme mein abhi koi gaana nahi.<br>Gaane <code>songs/</code> folder mein daalo aur page refresh karo.</li>`;
}
function renderNow() {
  const l = list();
  const pos = l.indexOf(current);
  $('count').textContent = l.length ? `${pos < 0 ? '–' : pos + 1} / ${l.length}` : '0 gaane';
  $('title').textContent = current ? name(current) : l.length ? '▶ dabao aur shuru karo' : 'Koi gaana nahi';
  $('play').textContent = isPaused() ? '▶' : '⏸';
  document.body.classList.toggle('playing', !isPaused());
  document.querySelectorAll('#list button[data-i]').forEach(b => b.classList.toggle('on', l[+b.dataset.i] === current));
}

function ensureGraph() {
  if (ctx) return;
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.75;
  bins = new Uint8Array(analyser.frequencyBinCount);
  ctx.createMediaElementSource(audio).connect(analyser).connect(ctx.destination);
}

function play(i) {
  const l = list();
  if (!l.length) return;
  if (mode === 'yt') { if (ytReady) yt.playVideoAt((i + l.length) % l.length); return; }
  ensureGraph();
  ctx.resume();
  idx = (i + l.length) % l.length;
  current = l[idx];
  audio.src = `/song?f=${encodeURIComponent(current)}`;
  audio.play().catch(() => {});
  renderNow();
}
function step(dir) {
  if (mode === 'yt') { if (ytReady) (dir > 0 ? yt.nextVideo() : yt.previousVideo()); return; }
  const l = list();
  if (l.indexOf(current) >= 0) idx = l.indexOf(current);
  if (shuffle && l.length > 1) {
    let n;
    do n = Math.floor(Math.random() * l.length); while (n === idx);
    play(n);
  } else play(idx + dir);
}
function toggle() {
  if (mode === 'yt') {
    if (!ytReady) return;
    if (ytState === 1) yt.pauseVideo(); else if (current) yt.playVideo(); else play(0);
    return;
  }
  if (!audio.src) return play(idx);
  if (audio.paused) { ctx.resume(); audio.play(); } else audio.pause();
}

$('play').onclick = toggle;
$('prev').onclick = () => {
  const t = mode === 'yt' ? (ytReady ? yt.getCurrentTime() : 0) : audio.currentTime;
  if (t > 3) mode === 'yt' ? yt.seekTo(0, true) : (audio.currentTime = 0);
  else step(-1);
};
$('next').onclick = () => step(1);
$('shuffle').onclick = () => {
  shuffle = !shuffle;
  $('shuffle').classList.toggle('on', shuffle);
  $('shuffle').setAttribute('aria-pressed', shuffle);
  if (mode === 'yt' && ytReady) yt.setShuffle(shuffle);
};
$('vol').oninput = e => { audio.volume = +e.target.value; if (ytReady) yt.setVolume(e.target.value * 100); };
$('seek').oninput = e => {
  if (mode === 'yt') { if (ytReady && yt.getDuration()) yt.seekTo(e.target.value / 1000 * yt.getDuration(), true); }
  else if (audio.duration) audio.currentTime = e.target.value / 1000 * audio.duration;
};
$('listBox').onclick = e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.scope) {
    showAll = b.dataset.scope === 'all';
    renderList();
    renderNow();
    $('list').querySelector('button.on[data-i]')?.scrollIntoView({ block: 'center' });
  } else if (b.dataset.i) play(+b.dataset.i);
};
$('search').oninput = renderList;
$('search').onkeydown = e => {
  if (e.key !== 'Enter') return;
  const first = $('list').querySelector('button[data-i]');
  if (first) play(+first.dataset.i);
};

// The song list stays hidden until the list button (or the song title) is clicked
function setListOpen(open) {
  $('listBox').hidden = !open;
  $('listBtn').classList.toggle('on', open);
  $('listBtn').setAttribute('aria-expanded', open);
  if (!open) return;
  $('list').querySelector('button.on[data-i]')?.scrollIntoView({ block: 'center' });
  // Jump straight into search on desktop; on phones it would pop the keyboard up every time
  if (matchMedia('(pointer: fine)').matches) $('search').focus();
}
$('listBtn').onclick = $('title').onclick = () => setListOpen($('listBox').hidden);
// composedPath() still holds the player even if the clicked button was re-rendered away
document.addEventListener('click', e => { if (!e.composedPath().some(el => el.classList?.contains('player'))) setListOpen(false); });
audio.addEventListener('ended', () => step(1));
audio.addEventListener('play', renderNow);
audio.addEventListener('pause', renderNow);
audio.addEventListener('timeupdate', () => {
  $('cur').textContent = time(audio.currentTime);
  $('dur').textContent = time(audio.duration);
  if (audio.duration) $('seek').value = audio.currentTime / audio.duration * 1000;
});
addEventListener('keydown', e => {
  if (e.code === 'Escape') setListOpen(false);
  if (!theme || e.target.tagName === 'INPUT') return;
  if (e.key === '/') { e.preventDefault(); setListOpen(true); $('search').focus(); }
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  if (e.code === 'ArrowRight') step(1);
  if (e.code === 'ArrowLeft') step(-1);
});

// ---------- beat: feeds --beat and the equalizer bars ----------
let beat = 0;
const eqBars = $('eq').children;
function frame() {
  if (analyser && !audio.paused) {
    analyser.getByteFrequencyData(bins);
    const bass = (bins[1] + bins[2] + bins[3]) / 765;
    beat = Math.max(bass * bass * 1.4, beat * 0.88);
    for (let i = 0; i < eqBars.length; i++) eqBars[i].style.height = `${8 + bins[i % bins.length] / 255 * 92}%`;
    document.querySelectorAll('#scene .eq-bar').forEach((b, i) => {
      const h = 4 + bins[i * 2 + 1] / 255 * 26;
      b.setAttribute('height', h);
      b.setAttribute('y', 38 - h);
    });
  } else if (mode === 'yt' && ytState === 1) {
    // A YouTube player's audio can't be analysed, so the scene follows a steady 120 BPM pulse
    const t = performance.now() / 1000;
    beat = Math.max((1 - (t * 2) % 1) ** 3, beat * 0.9);
    for (let i = 0; i < eqBars.length; i++) eqBars[i].style.height = `${8 + (0.5 + 0.5 * Math.sin(t * 5 + i * 1.7)) * (40 + beat * 50)}%`;
    document.querySelectorAll('#scene .eq-bar').forEach((b, i) => {
      const h = 4 + (0.5 + 0.5 * Math.sin(t * 6 + i * 2.1)) * 26 * (0.4 + beat * 0.6);
      b.setAttribute('height', h);
      b.setAttribute('y', 38 - h);
    });
  } else beat *= 0.9;
  document.documentElement.style.setProperty('--beat', Math.min(beat, 1).toFixed(3));
  requestAnimationFrame(frame);
}
frame();

// Songs come from songs/ while running `npm run dev` (see vite.config.js).
fetch('/songs.json')
  .then(r => (r.ok ? r.json() : null))
  .catch(() => null)
  .then(data => {
    if (Array.isArray(data)) songs = { all: data, ...Object.fromEntries(Object.keys(THEMES).map(k => [k, data])) };
    else if (data && data.all) songs = data;
    if (!songs.all.length) startYT();
    route();
    if (theme) { renderList(); renderNow(); }
  });

// ---------- YouTube mode (live site) ----------
function startYT() {
  mode = 'yt';
  document.body.classList.add('yt');
  window.onYouTubeIframeAPIReady = () => {
    yt = new YT.Player('ytPlayer', {
      width: 200, height: 200,
      playerVars: { playsinline: 1, rel: 0 },
      events: {
        onReady: () => { ytReady = true; yt.setVolume($('vol').value * 100); if (theme) loadYTTheme(false); },
        onStateChange: e => {
          ytState = e.data;
          // A single jukebox video loops when it ends
          if (e.data === 0 && (songs[ytTheme] || []).length === 1) yt.playVideo();
          const ids = yt.getPlaylist() || [];
          if (ytTheme && ids.length && songs[ytTheme] !== ids) { songs[ytTheme] = ids; fetchTitles(ids); renderList(); }
          const id = yt.getVideoData()?.video_id;
          if (id) { current = id; if (yt.getVideoData().title) titles[id] = yt.getVideoData().title; }
          renderNow();
        },
      },
    });
  };
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  setInterval(() => {
    if (!ytReady || ytState < 1) return;
    const t = yt.getCurrentTime(), d = yt.getDuration();
    $('cur').textContent = time(t);
    $('dur').textContent = time(d);
    if (d) $('seek').value = t / d * 1000;
  }, 500);
}

function loadYTTheme(autoplay) {
  if (!ytReady || ytTheme === theme) return;
  ytTheme = theme;
  current = null;
  const list = YT_PLAYLISTS[theme];
  if (!list) { yt.stopVideo(); songs[theme] = []; renderList(); renderNow(); return; }
  // A video ID is 11 characters; anything else is treated as a playlist ID
  if (/^[\w-]{11}$/.test(list)) {
    songs[theme] = [list];
    fetchTitles([list]);
    if (autoplay) yt.loadVideoById(list); else yt.cueVideoById(list);
  } else {
    const opts = { list, listType: 'playlist', index: 0 };
    if (autoplay) yt.loadPlaylist(opts); else yt.cuePlaylist(opts);
    yt.setShuffle(shuffle);
  }
}

// Song titles for the list, a few requests at a time
async function fetchTitles(ids) {
  const todo = ids.filter(id => !titles[id]);
  const worker = async () => {
    for (let id; (id = todo.shift()); ) {
      try {
        const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`);
        titles[id] = r.ok ? (await r.json()).title : 'Gaana';
      } catch { titles[id] = 'Gaana'; }
      if (todo.length % 10 === 0) renderList();
    }
  };
  await Promise.all([1, 2, 3, 4, 5, 6].map(worker));
  renderList();
  renderNow();
}
