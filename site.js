/* Orbite : script commun FR / EN */
const T = document.documentElement.lang === 'en' ? { here: 'your system', dlFor: 'Download for ' } : { here: 'ton système', dlFor: 'Télécharger pour ' };
/* langue : mémorise le choix */
document.querySelectorAll('.lang a').forEach((a) => a.addEventListener('click', () => { try { localStorage.setItem('orbite-lang', a.dataset.l); } catch {} }));
/* vidéo : 16:9 sur ordinateur, verticale sur téléphone */
(() => {
  const v = document.getElementById('demo'); if (!v) return;
  const base = v.dataset.base, mob = matchMedia('(max-width:640px)').matches;
  v.src = base + (mob ? 'demo-mobile.mp4' : 'demo.mp4');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.controls = true; } else { v.play().catch(() => { v.controls = true; }); }
})();
(() => {
  const ua = navigator.userAgent;
  const here = /Windows/i.test(ua) ? 'win' : /Mac/i.test(ua) && !/iPhone|iPad/i.test(ua) ? 'mac' : /Linux|X11/i.test(ua) && !/Android/i.test(ua) ? 'linux' : null;
  const names = { win: 'Windows', mac: 'macOS', linux: 'Linux' };
  const show = (os) => { for (const k of ['win', 'mac', 'linux']) document.getElementById('how-' + k).hidden = k !== os; document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.os === os)); };
  if (here) {
    const card = document.querySelector(`.os[data-os="${here}"]`);
    card.classList.add('here'); card.insertAdjacentHTML('afterbegin', `<span class="badge">${T.here}</span>`);
    document.getElementById('dl').prepend(card);
    const hero = document.getElementById('heroDl'); hero.href = card.querySelector('a').getAttribute('href'); hero.setAttribute('download', '');
    hero.querySelector('span').textContent = T.dlFor + names[here];
    hero.addEventListener('click', () => { show(here); setTimeout(() => document.getElementById('telecharger').scrollIntoView(), 400); });
  }
  show(here || 'win');
  document.getElementById('tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(b.dataset.os); });
  document.querySelectorAll('.os a').forEach((a) => a.addEventListener('click', () => show(a.closest('.os').dataset.os)));

  /* ciel : étoiles qui tournent lentement autour d'un anneau lumineux */
  const cv = document.getElementById('sky'), g = cv.getContext('2d'); let W, H, D;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let s = 7; const R = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const cols = ['#f5d9a6', '#b79cff', '#7fe0c0', '#9fd8ff', '#ffffff'];
  const stars = Array.from({ length: 520 }, () => ({ a: R() * 6.283, r: 60 + Math.pow(R(), 0.55) * 900, s: R() < 0.07 ? 2.2 : 1.1, c: cols[Math.floor(R() * 5)], tw: R() * 6 }));
  const disk = Array.from({ length: 1100 }, () => ({ a: R() * 6.283, r: 34 + Math.pow(R(), 1.8) * 80, c: R() }));
  const size = () => { const r = cv.getBoundingClientRect(); D = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * D; cv.height = H * D; };
  const frame = (t) => {
    const T = reduce ? 0 : t / 1000; g.setTransform(D, 0, 0, D, 0, 0); g.fillStyle = '#05060a'; g.fillRect(0, 0, W, H);
    const cx = W / 2, cy = 125;
    const neb = g.createRadialGradient(cx, cy, 10, cx, cy, Math.max(W, H) * 0.7); neb.addColorStop(0, 'rgba(120,90,170,.13)'); neb.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = neb; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';
    for (const st of stars) { const a = st.a + T * 0.015 * (160 / st.r); g.globalAlpha = 0.25 + 0.3 * Math.sin(T * 1.3 + st.tw); g.fillStyle = st.c; g.fillRect(cx + Math.cos(a) * st.r, cy + Math.sin(a) * st.r * 0.3, st.s, st.s); }
    const halo = g.createRadialGradient(cx, cy, 20, cx, cy, 140); halo.addColorStop(0, 'rgba(255,210,150,.30)'); halo.addColorStop(1, 'rgba(255,210,150,0)'); g.globalAlpha = 1; g.fillStyle = halo; g.fillRect(cx - 140, cy - 140, 280, 280);
    const pts = disk.map((d) => { const a = d.a + T * 0.5 / Math.sqrt(d.r / 34); return [cx + Math.cos(a) * d.r, cy + Math.sin(a) * d.r * 0.22, Math.sin(a), d]; });
    const dot = ([x, y, , d]) => { g.globalAlpha = 0.22 + 0.5 * (1 - (d.r - 34) / 80); g.fillStyle = d.c < 0.5 ? '#ffd9a0' : d.c < 0.85 ? '#ffb27a' : '#fff3dd'; g.fillRect(x, y, 1.5, 1.5); };
    pts.filter((p) => p[2] < 0).forEach(dot);
    g.globalAlpha = 0.4; g.strokeStyle = '#ffe3b8'; g.lineWidth = 2.6; g.beginPath(); g.ellipse(cx, cy - 1, 34, 32, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.fillStyle = '#020203'; g.beginPath(); g.arc(cx, cy, 23, 0, 6.283); g.fill();
    g.globalCompositeOperation = 'lighter'; g.strokeStyle = '#fff0d6'; g.lineWidth = 1.3; g.globalAlpha = 0.9; g.beginPath(); g.arc(cx, cy, 24, 0, 6.283); g.stroke();
    pts.filter((p) => p[2] >= 0).forEach(dot);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(frame);
  };
  size(); addEventListener('resize', size); requestAnimationFrame(frame);
})();
