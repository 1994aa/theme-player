// The three themes. Each scene is an inline SVG (viewBox 800x450); classes on its
// parts are animated in style.css, and `--beat` (0..1, from the music) drives the bounce.

const truck = `
<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1f5a"/><stop offset=".7" stop-color="#e2667a"/><stop offset="1" stop-color="#ffb35c"/></linearGradient>
    <radialGradient id="tHaze"><stop offset="0" stop-color="#ffd59a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd59a" stop-opacity="0"/></radialGradient>
    <linearGradient id="tRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a5468"/><stop offset="1" stop-color="#2e2832"/></linearGradient>
    <linearGradient id="tField" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a6a4a"/><stop offset=".3" stop-color="#3f5a3a"/><stop offset="1" stop-color="#26402a"/></linearGradient>
    <linearGradient id="tDash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3442"/><stop offset="1" stop-color="#24161e"/></linearGradient>
  </defs>
  <!-- outside, seen through the windshield -->
  <rect width="800" height="340" fill="url(#tSky)"/>
  <circle cx="470" cy="190" r="140" fill="url(#tHaze)" class="glow"/>
  <circle cx="470" cy="190" r="34" fill="#ffe2a8" class="glow"/>
  <path d="M0 210 L120 160 L230 196 L340 150 L460 200 L580 160 L700 198 L800 170 V215 H0z" fill="#5a2f5e"/>
  <path d="M0 200 L90 178 L200 198 L330 172 L470 196 L600 176 L720 196 L800 184 V215 H0z" fill="#8a4a6a" opacity=".6"/>
  <rect y="205" width="800" height="135" fill="url(#tField)"/>
  <path d="M388 205 H412 L1000 340 H-200z" fill="url(#tRoad)"/>
  <path d="M388 205 L-200 340 H-180 L390 205z M412 205 L1000 340 H980 L410 205z" fill="#e8e0d0"/>
  ${[0, 0.4, 0.8, 1.2].map(d => `<rect class="zoom" style="--d:-${d}s" x="396" y="236" width="8" height="18" rx="2" fill="#ffd36e"/>`).join('')}
  ${[0, 0.8, 1.6].map(d => `<g class="zoom side" style="--d:-${d}s"><rect x="452" y="186" width="4" height="22" fill="#2a1a20"/><circle cx="454" cy="182" r="12" fill="#2f6b3e"/></g><g class="zoom side" style="--d:-${d + 0.4}s"><rect x="342" y="186" width="4" height="22" fill="#2a1a20"/><circle cx="344" cy="182" r="12" fill="#2f6b3e"/></g>`).join('')}
  <g class="bounce"><g class="cabin">
    <!-- cabin frame with the windshield cut out -->
    <path d="M-40 -40 H840 V490 H-40z M96 52 L704 52 L766 338 L34 338z" fill="#2a1e2e" fill-rule="evenodd"/>
    ${[...Array(25)].map((_, i) => { const x = 104 + i * 24.5, y = 58 + Math.sin(i / 24 * Math.PI) * 10; return `<circle cx="${x}" cy="${y.toFixed(1)}" r="7" fill="${i % 2 ? '#ffb020' : '#ff7a1a'}"/>`; }).join('')}
    ${[...Array(12)].map((_, i) => `<path class="tassel" style="--d:${(i * 0.13).toFixed(2)}s" d="M${120 + i * 51} 54 v22 l-7 14 h14 l-7 -14" stroke="#ffd36e" stroke-width="2" fill="${['#ff3d8b', '#31c27a', '#3b9bff', '#9b5cff'][i % 4]}"/>`).join('')}
    <rect x="356" y="52" width="88" height="24" rx="6" fill="#1a141c" stroke="#a8a0b0" stroke-width="3"/>
    <g class="charm">
      <line x1="400" y1="76" x2="400" y2="112" stroke="#f4f0e6" stroke-width="1.5"/>
      <circle cx="400" cy="116" r="7" fill="#f2e84a"/>
      ${[-6, -2, 2, 6].map(x => `<path d="M${400 + x} 123 q${x / 2} 12 ${x / 3} 22" stroke="#3fa83a" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}
    </g>
    <!-- dashboard -->
    <path d="M-40 345 Q400 300 840 345 V490 H-40z" fill="url(#tDash)"/>
    <g transform="translate(250 398)">
      <circle r="32" fill="#141018" stroke="#c9a46a" stroke-width="4"/>
      ${[...Array(9)].map((_, i) => `<line x1="0" y1="-25" x2="0" y2="-19" stroke="#fff3e6" stroke-width="2" transform="rotate(${-120 + i * 30})"/>`).join('')}
      <text y="19" text-anchor="middle" font-family="Outfit, sans-serif" font-size="8" fill="#c9bcd9">km/h</text>
      <line class="needle" x1="0" y1="0" x2="0" y2="-23" stroke="#ff3d3d" stroke-width="3" stroke-linecap="round"/>
      <circle r="4" fill="#ffc23d"/>
    </g>
    <rect x="390" y="352" width="140" height="54" rx="8" fill="#141018" stroke="#5a4a5a" stroke-width="2"/>
    <text x="404" y="372" font-family="Outfit, sans-serif" font-size="11" fill="#7cf0c0">FM 98.3</text>
    <g transform="translate(404 364)">
      ${[...Array(8)].map((_, i) => `<rect class="eq-bar" x="${i * 14}" y="20" width="9" height="18" rx="2" fill="#7cf0c0"/>`).join('')}
    </g>
    <text x="460" y="428" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="15" letter-spacing="2" fill="#ffc23d">HORN OK PLEASE</text>
    <text x="460" y="444" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="11" fill="#ffb3d3">Buri nazar wale tera muh kala</text>
    <!-- steering wheel with the driver's hands; the speedometer shows through it -->
    <g class="steer">
      <circle cx="250" cy="450" r="104" fill="none" stroke="#17111a" stroke-width="20"/>
      <circle cx="250" cy="450" r="104" fill="none" stroke="#3a2a36" stroke-width="3"/>
      ${[-30, 210].map(a => `<rect x="246" y="380" width="8" height="70" fill="#17111a" transform="rotate(${a + 90} 250 450)"/>`).join('')}
      <circle cx="250" cy="450" r="24" fill="#2a1e2e" stroke="#c9a46a" stroke-width="3"/>
      <ellipse cx="164" cy="396" rx="16" ry="12" fill="#a8714a" transform="rotate(-35 164 396)"/>
      <ellipse cx="336" cy="396" rx="16" ry="12" fill="#a8714a" transform="rotate(35 336 396)"/>
    </g>
  </g></g>
</svg>`;

const kitchen = `
<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="kWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d9b8"/><stop offset="1" stop-color="#ecc49a"/></linearGradient>
    <radialGradient id="kLamp"><stop offset="0" stop-color="#fff2c4" stop-opacity=".85"/><stop offset=".5" stop-color="#ffd98a" stop-opacity=".25"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
    <linearGradient id="kSunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4a8c"/><stop offset=".55" stop-color="#f0857a"/><stop offset="1" stop-color="#ffd08a"/></linearGradient>
    <pattern id="kTile" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#f4e6cf"/><path d="M14 2 L26 14 L14 26 L2 14z" fill="#2f8f8a"/><path d="M14 8 L20 14 L14 20 L8 14z" fill="#f4e6cf"/><circle cx="14" cy="14" r="2.4" fill="#d9623b"/><circle cx="0" cy="0" r="3" fill="#d9623b"/><circle cx="28" cy="0" r="3" fill="#d9623b"/><circle cx="0" cy="28" r="3" fill="#d9623b"/><circle cx="28" cy="28" r="3" fill="#d9623b"/></pattern>
    <linearGradient id="kStone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3f4c"/><stop offset="1" stop-color="#2c2430"/></linearGradient>
    <linearGradient id="kWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a4f2c"/><stop offset="1" stop-color="#5e331c"/></linearGradient>
    <linearGradient id="kPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9c5d36"/><stop offset="1" stop-color="#7a4428"/></linearGradient>
    <linearGradient id="kSteel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8d96a3"/><stop offset=".35" stop-color="#eef2f6"/><stop offset=".6" stop-color="#b6bfca"/><stop offset="1" stop-color="#6f7884"/></linearGradient>
    <linearGradient id="kBrass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a6a1e"/><stop offset=".4" stop-color="#f3c96a"/><stop offset="1" stop-color="#a8741f"/></linearGradient>
    <linearGradient id="kCurtain" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8a33c"/><stop offset=".5" stop-color="#ffcf6e"/><stop offset="1" stop-color="#d98c2a"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#kWall)"/>
  <rect y="170" width="800" height="122" fill="url(#kTile)"/>
  <rect y="170" width="800" height="122" fill="#f6d9b8" opacity=".28"/>
  <rect y="168" width="800" height="5" fill="#c98a52"/>
  <!-- arched window with the evening outside -->
  <path d="M50 196 V96 a80 80 0 0 1 160 0 V196z" fill="url(#kSunset)"/>
  <circle cx="150" cy="150" r="20" fill="#fff0c0" class="glow"/>
  <path d="M50 196 V168 l18 -10 l12 6 l14 -18 h10 v10 l16 -4 l10 12 l20 -8 l14 10 l16 -14 l20 12 V196z" fill="#5a3a5e"/>
  <path d="M50 196 V96 a80 80 0 0 1 160 0 V196z" fill="none" stroke="#f4e6cf" stroke-width="12"/>
  <path d="M130 30 V196 M50 130 H210" stroke="#f4e6cf" stroke-width="5"/>
  <path d="M30 22 q24 70 6 182 h28 q-10 -100 8 -182z M230 22 q-24 70 -6 182 h-28 q10 -100 -8 -182z" fill="url(#kCurtain)"/>
  <rect x="20" y="16" width="220" height="8" rx="4" fill="#7a4428"/>
  ${[...Array(11)].map((_, i) => `<circle cx="${34 + i * 19}" cy="${30 + Math.sin(i / 10 * Math.PI) * 14}" r="6" fill="${i % 2 ? '#ff9a1f' : '#ffcf3a'}"/>`).join('')}
  <rect x="42" y="196" width="176" height="10" rx="3" fill="#f4e6cf"/>
  <!-- tulsi on the sill -->
  <path d="M112 196 l4 -22 h28 l4 22z" fill="#c4572e"/>
  ${[[-14, -30], [-6, -42], [4, -48], [12, -38], [18, -28]].map(([x, y]) => `<ellipse cx="${130 + x}" cy="${174 + y / 1.6}" rx="7" ry="4" fill="#3f8a3c" transform="rotate(${x * 2} ${130 + x} ${174 + y / 1.6})"/>`).join('')}
  <!-- pendant lamp -->
  <rect x="419" y="0" width="2" height="40" fill="#3a2a22"/>
  <path d="M396 60 q24 -26 48 0z" fill="url(#kBrass)"/>
  <ellipse cx="420" cy="90" rx="340" ry="240" fill="url(#kLamp)" class="glow"/>
  <!-- shelf: spice jars, brass lota and plates -->
  <rect x="290" y="112" width="250" height="9" rx="2" fill="url(#kWood)"/>
  ${['#d9452f', '#f2b630', '#3f9a5a', '#e0722a', '#8a3a7a'].map((c, i) => `<g class="jar" style="--d:${i * 0.15}s"><rect x="${300 + i * 34}" y="80" width="24" height="32" rx="5" fill="#f9f3ea" opacity=".55"/><rect x="${302 + i * 34}" y="90" width="20" height="20" rx="3" fill="${c}"/><rect x="${300 + i * 34}" y="74" width="24" height="8" rx="2" fill="#7a4428"/></g>`).join('')}
  <path d="M478 112 q-14 -6 -12 -20 q2 -10 12 -12 h6 q10 2 12 12 q2 14 -12 20z" fill="url(#kBrass)"/>
  <rect x="474" y="72" width="14" height="8" rx="2" fill="#c9952e"/>
  <ellipse cx="520" cy="96" rx="4" ry="16" fill="url(#kSteel)"/><ellipse cx="530" cy="96" rx="4" ry="16" fill="url(#kSteel)"/>
  <!-- money plant trailing from the shelf -->
  <path d="M296 112 q-10 30 4 56" stroke="#3f7a3a" stroke-width="2" fill="none"/>
  ${[[292, 126], [300, 146], [298, 164]].map(([x, y], i) => `<path d="M${x} ${y} q${i % 2 ? 12 : -12} -4 ${i % 2 ? 14 : -14} 6 q${i % 2 ? -8 : 8} 6 ${i % 2 ? -14 : 14} -6z" fill="#4f9a45"/>`).join('')}
  <!-- clock -->
  <g transform="translate(650 74)"><circle r="36" fill="url(#kBrass)"/><circle r="29" fill="#fff8ec"/>${[...Array(12)].map((_, i) => `<circle cx="0" cy="-24" r="1.6" fill="#7a4428" transform="rotate(${i * 30})"/>`).join('')}<line class="hand" x1="0" y1="0" x2="0" y2="-21" stroke="#2a1430" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="0" x2="14" y2="0" stroke="#2a1430" stroke-width="4" stroke-linecap="round"/><circle r="3" fill="#c4572e"/></g>
  <!-- hanging brass ladles -->
  <rect x="570" y="140" width="200" height="6" rx="3" fill="#5e331c"/>
  ${[600, 645, 690, 735].map((x, i) => `<g class="sway" style="--d:${i * 0.2}s; transform-origin:${x}px 146px"><line x1="${x}" y1="146" x2="${x}" y2="${196 + i * 6}" stroke="#a8741f" stroke-width="4"/><ellipse cx="${x}" cy="${204 + i * 6}" rx="${10 + i * 2}" ry="8" fill="url(#kBrass)"/></g>`).join('')}
  <!-- counter and cabinets -->
  <rect y="300" width="800" height="150" fill="url(#kWood)"/>
  <rect y="306" width="800" height="14" fill="#000" opacity=".18"/>
  ${[30, 225, 420, 615].map(x => `<rect x="${x}" y="326" width="175" height="112" rx="6" fill="url(#kPanel)"/><rect x="${x + 10}" y="336" width="155" height="92" rx="4" fill="none" stroke="#5e331c" stroke-width="2" opacity=".6"/><circle cx="${x + 87}" cy="344" r="5" fill="url(#kBrass)"/>`).join('')}
  <rect y="288" width="800" height="16" fill="url(#kStone)"/>
  <rect y="288" width="800" height="2" fill="#ffffff" opacity=".25"/>
  <!-- masala dabba -->
  <g transform="translate(110 280)"><ellipse cx="0" cy="0" rx="50" ry="14" fill="url(#kSteel)"/>${[['#d9452f', -26, -2], ['#f2b630', 0, -6], ['#7a3a1e', 26, -2], ['#3f9a5a', -12, 4], ['#e8d8b0', 14, 4]].map(([c, x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="4" fill="${c}"/>`).join('')}</g>
  <!-- stove -->
  <rect x="180" y="276" width="420" height="14" rx="4" fill="#1e1a22"/>
  <g transform="translate(290 276)">
    ${[-30, -10, 10, 30].map(x => `<path class="flame" style="--d:${(x + 30) * 0.01}s" d="M${x} 0 q-6 -12 0 -22 q6 10 0 22z" fill="#4aa8ff"/>`).join('')}
    <ellipse cx="0" cy="-30" rx="80" ry="14" fill="#1e1a22"/>
    <rect x="80" y="-36" width="70" height="10" rx="5" fill="#2a1e1a"/>
    <g class="lid"><ellipse cx="0" cy="-46" rx="66" ry="12" fill="url(#kSteel)"/><circle cx="0" cy="-58" r="7" fill="#2a1e1a"/></g>
    ${[-30, 10, 40].map((x, i) => `<circle class="sizzle" style="--d:${i * 0.3}s" cx="${x}" cy="-40" r="4" fill="#ffd36e"/>`).join('')}
  </g>
  <!-- pressure cooker -->
  <g transform="translate(500 276)">
    <rect x="-46" y="-90" width="92" height="88" rx="16" fill="url(#kSteel)"/>
    <rect x="-52" y="-100" width="104" height="16" rx="6" fill="#9aa3ae"/>
    <rect x="44" y="-94" width="60" height="10" rx="5" fill="#1e1a22"/>
    <g class="whistle"><rect x="-7" y="-122" width="14" height="24" rx="4" fill="#1e1a22"/></g>
    ${[0, 1, 2].map(i => `<circle class="steam" style="--d:${i * 0.8}s" cx="0" cy="-130" r="14" fill="#ffffff"/>`).join('')}
  </g>
  <!-- brass lota and steel glasses -->
  <g transform="translate(680 288)"><path d="M-18 0 q-10 -20 4 -32 q-6 -8 0 -12 h28 q6 4 0 12 q14 12 4 32z" fill="url(#kBrass)"/><rect x="34" y="-26" width="16" height="26" rx="2" fill="url(#kSteel)"/><rect x="56" y="-22" width="14" height="22" rx="2" fill="url(#kSteel)"/></g>
</svg>`;

const saloon = `
<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sWall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a1d5c"/><stop offset="1" stop-color="#1c0f2e"/></linearGradient>
    <pattern id="sFloor" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#f4eee6"/><rect width="30" height="30" fill="#2a2433"/><rect x="30" y="30" width="30" height="30" fill="#2a2433"/></pattern>
    <pattern id="sPole" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="40" height="40" fill="#ffffff"/><rect width="14" height="40" fill="#e23b4a"/><rect x="20" width="10" height="40" fill="#3b6bff"/></pattern>
    <pattern id="sPaper" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M18 4 q8 10 0 20 q-8 -10 0 -20z M0 22 q8 10 0 20 M36 22 q-8 10 0 20" fill="#ffffff" opacity=".06"/><circle cx="18" cy="30" r="1.5" fill="#ffc23d" opacity=".25"/></pattern>
    <radialGradient id="sSpot"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".45"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
    <linearGradient id="sShine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".35"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#sWall)"/>
  <rect width="800" height="360" fill="url(#sPaper)"/>
  <rect y="350" width="800" height="12" fill="#7a4a22"/>
  <ellipse cx="370" cy="200" rx="300" ry="220" fill="url(#sSpot)" class="glow"/>
  <rect y="360" width="800" height="90" fill="url(#sFloor)"/>
  <rect x="220" y="40" width="300" height="230" rx="16" fill="#9fc3e8" opacity=".35"/>
  <path d="M250 50 l60 0 l-80 120 v-60z M330 50 l30 0 l-130 200 v-40z" fill="url(#sShine)"/>
  <rect x="220" y="40" width="300" height="230" rx="16" fill="none" stroke="#c9a46a" stroke-width="10"/>
  ${[...Array(7)].map((_, i) => `<circle class="bulb" style="--d:${i * 0.12}s" cx="${240 + i * 43}" cy="30" r="9" fill="#ffe9a8"/>`).join('')}
  ${[...Array(5)].map((_, i) => `<circle class="bulb" style="--d:${i * 0.12 + 0.4}s" cx="210" cy="${70 + i * 45}" r="9" fill="#ffe9a8"/><circle class="bulb" style="--d:${i * 0.12 + 0.6}s" cx="530" cy="${70 + i * 45}" r="9" fill="#ffe9a8"/>`).join('')}
  <text x="120" y="110" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="34" fill="#ff3d8b" class="neon">STYLE</text>
  <rect x="50" y="140" width="140" height="70" rx="8" fill="#fff3e6"/>
  <text x="120" y="170" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="700" font-size="16" fill="#2a1430">Hair Cut ₹50</text>
  <text x="120" y="194" text-anchor="middle" font-family="Outfit, sans-serif" font-size="14" fill="#2a1430">Shave ₹30</text>
  <g transform="translate(640 60)">
    <rect x="-22" y="-12" width="44" height="16" rx="6" fill="#c9a46a"/>
    <rect x="-16" y="4" width="32" height="200" fill="url(#sPole)" class="pole"/>
    <rect x="-22" y="204" width="44" height="16" rx="6" fill="#c9a46a"/>
  </g>
  <rect x="560" y="300" width="200" height="10" fill="#7a4a22"/>
  <g transform="translate(730 300)"><path d="M-14 0 l4 -24 h20 l4 24z" fill="#c4572e"/>${[[-16, -40, -30], [-4, -52, -8], [10, -46, 20], [18, -34, 40]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="18" fill="#3f8a3c" transform="rotate(${r} ${x} ${y})"/>`).join('')}</g>
  <g transform="translate(600 250)">
    <rect width="120" height="50" rx="10" fill="#c0392b"/>
    <circle cx="26" cy="25" r="14" fill="#2a1430"/>
    ${[...Array(8)].map((_, i) => `<rect class="eq-bar" x="${50 + i * 8}" y="12" width="5" height="26" rx="2" fill="#ffd36e"/>`).join('')}
  </g>
  <g class="chair">
    <rect x="330" y="300" width="80" height="14" rx="4" fill="#8a8494"/>
    <rect x="360" y="314" width="20" height="40" fill="#5a5466"/>
    <ellipse cx="370" cy="362" rx="60" ry="10" fill="#3a3346"/>
    <rect x="300" y="250" width="140" height="56" rx="14" fill="#c0392b"/>
    <rect x="320" y="150" width="100" height="110" rx="16" fill="#a8302a"/>
  </g>
  <g class="customer bounce">
    <path d="M300 300 q70 -110 140 0z" fill="#fff3e6"/>
    <circle cx="370" cy="170" r="34" fill="#a8714a"/>
    <path d="M336 160 q34 -46 68 0 q-10 -20 -34 -22 q-24 2 -34 22z" fill="#1a1010"/>
  </g>
  <g class="scissors" transform="translate(436 150)">
    <g class="blade a"><rect x="-2" y="-46" width="5" height="46" rx="2" fill="#d8dde3"/><circle cx="0" cy="8" r="8" fill="none" stroke="#3b9bff" stroke-width="4"/></g>
    <g class="blade b"><rect x="-2" y="-46" width="5" height="46" rx="2" fill="#c0c8d0"/><circle cx="0" cy="8" r="8" fill="none" stroke="#ff3d8b" stroke-width="4"/></g>
  </g>
</svg>`;

// Small seeded random so the stars land in the same places every time
let seed = 7;
const rnd = (a, b) => { seed = (seed * 16807) % 2147483647; return a + (seed / 2147483647) * (b - a); };

const night = `
<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="nSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070720"/><stop offset=".6" stop-color="#1b1a4a"/><stop offset="1" stop-color="#3b2d63"/></linearGradient>
    <radialGradient id="nMoon"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
    <radialGradient id="nLamp"><stop offset="0" stop-color="#ffcf6a" stop-opacity=".7"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></radialGradient>
    <radialGradient id="nMilky"><stop offset="0" stop-color="#c9b8ff" stop-opacity=".32"/><stop offset=".6" stop-color="#8f7adf" stop-opacity=".12"/><stop offset="1" stop-color="#8f7adf" stop-opacity="0"/></radialGradient>
    <linearGradient id="nTrail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#nSky)"/>
  ${[...Array(80)].map((_, i) => `<circle class="star" style="--d:${rnd(0, 3).toFixed(2)}s" cx="${rnd(0, 800).toFixed(0)}" cy="${rnd(0, 260).toFixed(0)}" r="${(i % 9 ? rnd(0.6, 1.4) : rnd(1.8, 2.4)).toFixed(1)}" fill="#fff8e6"/>`).join('')}
  <ellipse cx="380" cy="120" rx="460" ry="46" fill="url(#nMilky)" transform="rotate(-18 380 120)"/>
  ${[...Array(120)].map(() => { const t = rnd(-1, 1), x = 380 + t * 420, y = 120 - t * 420 * 0.32 + rnd(-30, 30); return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rnd(0.3, 0.9).toFixed(1)}" fill="#fff" opacity="${rnd(0.3, 0.9).toFixed(2)}"/>`; }).join('')}
  <g class="shoot"><line x1="0" y1="0" x2="90" y2="-34" stroke="url(#nTrail)" stroke-width="2.5" stroke-linecap="round"/></g>
  <circle class="moonglow" cx="620" cy="96" r="110" fill="url(#nMoon)"/>
  <circle cx="620" cy="96" r="34" fill="#fff3d0"/>
  <circle cx="608" cy="88" r="6" fill="#efe0b8"/><circle cx="632" cy="108" r="4" fill="#efe0b8"/>
  <path d="M0 300 Q120 230 260 280 T520 260 T800 270 V450 H0z" fill="#1d1a44"/>
  <path d="M0 340 Q160 290 330 330 T640 310 T800 330 V450 H0z" fill="#141233"/>
  ${[60, 140, 470, 540, 720].map((x, i) => `<g class="breeze" style="--d:${i * 0.4}s"><path d="M${x} ${330 - i % 2 * 12} l-22 0 l22 -46 l22 46z M${x} ${300 - i % 2 * 12} l-17 0 l17 -38 l17 38z" fill="#0b0a22"/><rect x="${x - 3}" y="${330 - i % 2 * 12}" width="6" height="12" fill="#0b0a22"/></g>`).join('')}
  <g class="breeze big"><rect x="232" y="250" width="14" height="110" fill="#0a0920"/><circle cx="239" cy="232" r="46" fill="#0d0c26"/><circle cx="206" cy="258" r="32" fill="#0d0c26"/><circle cx="272" cy="256" r="34" fill="#0d0c26"/></g>
  <circle class="lampglow" cx="420" cy="352" r="70" fill="url(#nLamp)"/>
  <path d="M376 380 l44 -64 l44 64z" fill="#3a2f6a"/>
  <path d="M420 316 l-12 64 h24z" fill="#ffcf6a" class="tentdoor"/>
  <rect y="372" width="800" height="78" fill="#0a0a1c"/>
  ${[...Array(70)].map(() => { const x = rnd(0, 800); return `<path d="M${x.toFixed(0)} 374 q${rnd(-4, 4).toFixed(1)} -${rnd(8, 18).toFixed(0)} ${rnd(-6, 6).toFixed(1)} -${rnd(14, 26).toFixed(0)}" stroke="#16163a" stroke-width="2" fill="none"/>`; }).join('')}
  <g class="stargazer" fill="#2e2c5e" stroke="#5a58a0" stroke-width="1">
    <rect x="166" y="394" width="176" height="12" rx="6" fill="#4a3a7a" stroke="none"/>
    <path d="M176 388 q-10 -10 4 -16 l16 8z"/>
    <circle cx="188" cy="387" r="11"/>
    <rect x="198" y="380" width="64" height="16" rx="8"/>
    <rect x="258" y="384" width="76" height="10" rx="5"/>
    <path class="knee" d="M258 386 L290 358 L320 392 L307 394 L289 371 L264 396z"/>
  </g>
  ${[...Array(16)].map(() => `<circle class="firefly" style="--d:${rnd(0, 5).toFixed(2)}s;--x:${rnd(-40, 40).toFixed(0)}px;--y:${rnd(-30, 30).toFixed(0)}px" cx="${rnd(40, 760).toFixed(0)}" cy="${rnd(260, 420).toFixed(0)}" r="2.6" fill="#e4ff7a"/>`).join('')}
</svg>`;

const pahad = `
<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="pSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6faee8"/><stop offset=".55" stop-color="#cfe5f2"/><stop offset="1" stop-color="#ffe0b0"/></linearGradient>
    <radialGradient id="pSun"><stop offset="0" stop-color="#fff6d0"/><stop offset=".25" stop-color="#ffe7a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffe7a0" stop-opacity="0"/></radialGradient>
    <linearGradient id="pFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8fc2"/><stop offset="1" stop-color="#b8c6e2"/></linearGradient>
    <linearGradient id="pBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9b8dc"/><stop offset="1" stop-color="#d6def0"/></linearGradient>
    <linearGradient id="pHill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f9068"/><stop offset="1" stop-color="#3d7a52"/></linearGradient>
    <linearGradient id="pGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cbb5e"/><stop offset="1" stop-color="#3f8f45"/></linearGradient>
    <linearGradient id="pMist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#pSky)"/>
  <circle cx="130" cy="84" r="150" fill="url(#pSun)" class="glow"/>
  <g opacity=".18" fill="#fff6d0">${[...Array(8)].map((_, i) => `<path d="M130 84 L${130 + Math.cos(i * 0.32 + 0.1) * 700} ${84 + Math.sin(i * 0.32 + 0.1) * 700} L${130 + Math.cos(i * 0.32 + 0.22) * 700} ${84 + Math.sin(i * 0.32 + 0.22) * 700}z"/>`).join('')}</g>
  <circle cx="130" cy="84" r="30" fill="#fff8dc"/>
  <path d="M0 230 L70 170 L150 215 L240 150 L360 210 L450 160 L560 205 L680 150 L800 190 V300 H0z" fill="url(#pBack)"/>
  ${[[180, 60, 1], [470, 40, 1.3], [660, 90, 0.9]].map(([x, y, s], i) => `<g class="cloud" style="--d:${i * -6}s"><g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="46" ry="16" fill="#fff"/><ellipse cx="-20" cy="-10" rx="22" ry="16" fill="#fff"/><ellipse cx="16" cy="-14" rx="26" ry="20" fill="#fff"/></g></g>`).join('')}
  <path d="M0 250 L110 120 L190 210 L300 90 L420 220 L520 110 L640 230 L730 140 L800 200 V300 H0z" fill="url(#pFar)"/>
  <rect y="215" width="800" height="70" fill="url(#pMist)"/>
  <path d="M110 120 L88 146 L104 140 L118 152 L132 140z M300 90 L274 122 L292 114 L306 128 L324 118z M520 110 L498 136 L514 130 L528 142 L542 132z M730 140 L712 160 L726 156 L740 166z" fill="#ffffff"/>
  <path d="M0 290 Q140 210 300 270 T620 250 T800 260 V340 H0z" fill="#6f9f86"/>
  <path d="M0 320 Q180 270 380 310 T800 300 V360 H0z" fill="url(#pHill)"/>
  <rect y="262" width="800" height="50" fill="url(#pMist)" opacity=".7"/>
  ${[40, 90, 150, 520, 580, 640, 700, 760].map((x, i) => `<g class="breeze" style="--d:${i * 0.3}s"><path d="M${x} ${300 + i % 3 * 8} l-14 0 l14 -34 l14 34z M${x} ${282 + i % 3 * 8} l-10 0 l10 -26 l10 26z" fill="#2f6b3e"/></g>`).join('')}
  <rect y="340" width="800" height="110" fill="url(#pGrass)"/>
  ${[...Array(36)].map(() => `<circle class="flower" cx="${rnd(0, 800).toFixed(0)}" cy="${rnd(352, 440).toFixed(0)}" r="3" fill="${['#ff3d8b', '#ffc23d', '#ffffff', '#9b5cff'][Math.floor(rnd(0, 4))]}"/>`).join('')}
  <g class="birds"><path d="M0 0 q6 -6 12 0 q6 -6 12 0 M30 12 q5 -5 10 0 q5 -5 10 0" stroke="#2a3a4a" stroke-width="2" fill="none"/></g>
  <!-- chair -->
  <g stroke="#7a4a22" stroke-width="5" stroke-linecap="round"><line x1="304" y1="382" x2="312" y2="334"/><line x1="370" y1="382" x2="364" y2="334"/></g>
  <path d="M300 336 L284 262 L296 260 L313 334z" fill="#9a5a2a"/>
  <rect x="300" y="328" width="74" height="9" rx="3" fill="#9a5a2a"/>
  <!-- person -->
  <g class="sitter">
    <rect x="334" y="318" width="46" height="14" rx="7" fill="#2f4a7a"/>
    <rect x="372" y="322" width="13" height="52" rx="6" fill="#2f4a7a"/>
    <ellipse cx="386" cy="376" rx="12" ry="6" fill="#3a2a22"/>
    <rect x="310" y="262" width="30" height="66" rx="13" fill="#e2563a" transform="rotate(-8 325 328)"/>
    <g class="nod">
      <circle cx="324" cy="246" r="15" fill="#c48a5c"/>
      <path d="M309 244 a15 15 0 0 1 30 0z" fill="#3b9bff"/>
      <circle cx="324" cy="228" r="5" fill="#ffffff"/>
    </g>
    <g class="sip">
      <rect x="326" y="272" width="11" height="32" rx="5" fill="#c94a32" transform="rotate(-30 331 276)"/>
      <rect x="340" y="282" width="10" height="26" rx="5" fill="#c94a32" transform="rotate(30 345 304)"/>
      <rect x="352" y="276" width="12" height="13" rx="2" fill="#ffffff"/>
      <path d="M364 279 q6 2 0 8" stroke="#ffffff" stroke-width="2" fill="none"/>
      <circle class="chai-steam" style="--d:0s" cx="358" cy="270" r="4" fill="#ffffff"/>
      <circle class="chai-steam" style="--d:1.1s" cx="360" cy="270" r="4" fill="#ffffff"/>
    </g>
  </g>
  <!-- table with kettle -->
  <g stroke="#7a4a22" stroke-width="5" stroke-linecap="round"><line x1="412" y1="378" x2="414" y2="326"/><line x1="466" y1="378" x2="464" y2="326"/></g>
  <rect x="400" y="320" width="78" height="8" rx="3" fill="#9a5a2a"/>
  <ellipse cx="424" cy="306" rx="15" ry="13" fill="#c8742a"/>
  <path d="M438 304 q12 -4 14 -14" stroke="#c8742a" stroke-width="4" fill="none"/>
  <rect x="418" y="290" width="12" height="5" rx="2" fill="#7a4a22"/>
  <rect x="456" y="308" width="11" height="12" rx="2" fill="#ffffff"/>
  ${[0, 0.9, 1.8].map(d => `<circle class="chai-steam" style="--d:${d}s" cx="452" cy="286" r="4" fill="#ffffff"/>`).join('')}
</svg>`;

export const THEMES = {
  truck: { name: 'Horn OK Please', emoji: '🚚', time: 'Highway · Driver ki seat se', desc: 'Truck ke andar baitho: aage khuli sadak, hilte jhalar, nimbu-mirchi aur dashboard pe bajta gaana.', svg: truck },
  kitchen: { name: 'Rasoi ki Dhun', emoji: '🍳', time: 'Rasoi · Khana aur gaana', desc: 'Tadka lagta hai, cooker ki seeti bajti hai, aur gaane ke saath sab chhamakta hai.', svg: kitchen },
  night: { name: 'Taaron ki Raat', emoji: '🌙', time: 'Khula maidan · Chaandni raat', desc: 'Ghaas pe let ke taaron bhara aasmaan dekho, jugnu aur ped ki sarsarahat. Sitaare beat pe chamkenge.', svg: night },
  pahad: { name: 'Pahadon ki Chai', emoji: '☕', time: 'Pahad · Subah ki chai', desc: 'Barf wale pahad, hari vaadi aur kursi pe garam chai ki chuski. Gaane ke saath sukoon.', svg: pahad },
  saloon: { name: 'Kainchi ki Taal', emoji: '💈', time: 'Nai ki dukaan · Radio pe hit', desc: 'Kainchi chalti hai beat pe, mirror ki lights chamakti hain, radio pe hit gaane.', svg: saloon },
};
