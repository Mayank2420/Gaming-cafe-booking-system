// ══════════════════════════════════════════════
//  GAMING CAFE — admin.js
//  Connects admin.html to MongoDB via backend API
// ══════════════════════════════════════════════

// ── CONFIG: apna backend URL yahan set karo ──
const API_BASE = 'http://localhost:5000';

// ══════════════════════════════════════════════
//  FETCH HELPERS
// ══════════════════════════════════════════════
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${path}`);
  return res.json();
}

// ══════════════════════════════════════════════
//  GAMES — Load, Add, Delete
// ══════════════════════════════════════════════
async function fetchGames() {
  try {
    return await apiFetch('/api/games/all');
  } catch (err) {
    console.error('Games fetch error:', err);
    return [];
  }
}

// Called by admin.html ADD GAME button
async function addGame() {
  const title    = document.getElementById('title').value.trim();
  const category = document.getElementById('category').value.trim();
  const price    = parseFloat(document.getElementById('price').value);
  const time     = document.getElementById('time').value.trim() || 'all';

  if (!title || !category || isNaN(price) || price <= 0) {
    alert('Game Name, Category aur valid Price zaroori hai!');
    return;
  }

  try {
    await apiFetch('/api/games/add', {
      method: 'POST',
      body: JSON.stringify({ title, category, price, time })
    });

    // Clear inputs
    ['title','category','price','time'].forEach(id => {
      document.getElementById(id).value = '';
    });

    // Flash success
    const ok = document.getElementById('addSuccess');
    if (ok) { ok.style.display = 'inline'; setTimeout(() => { ok.style.display = 'none'; }, 2000); }

    renderAll();
  } catch (err) {
    alert('Game add nahi hua: ' + err.message);
  }
}

// Called by delete button in game catalogue
async function deleteGame(id) {
  if (!confirm('Is game ko catalogue se remove karein?')) return;
  try {
    await apiFetch(`/api/games/${id}`, { method: 'DELETE' });
    renderAll();
  } catch (err) {
    alert('Delete nahi hua: ' + err.message);
  }
}

// ══════════════════════════════════════════════
//  BOOKINGS — Load
// ══════════════════════════════════════════════
async function fetchBookings() {
  try {
    return await apiFetch('/api/bookings/all');
  } catch (err) {
    console.error('Bookings fetch error:', err);
    return [];
  }
}
// ══════════════════════════════════════════════
//  RENDER — Stats
// ══════════════════════════════════════════════
function renderStats(games, bookings) {
  const today     = new Date().toLocaleDateString('en-IN');
 const totalRev = bookings
.filter(
  b => b.status === 'booked'
)
.reduce(
  (s,b) => s + (Number(b.amount) || 0),
  0
);
  const todayCount = bookings.filter(b => {

  const d =
  new Date(b.createdAt)
  .toLocaleDateString('en-IN');

  return (
    d === today &&
    b.status === 'booked'
  );

}).length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('rev-value',   '₹' + totalRev.toLocaleString('en-IN'));
  set(
  'book-value',
  bookings.filter(
    b => b.status === 'booked'
  ).length
);
  set('today-value', todayCount);
  set('games-count', games.length);
  set('today-date',  new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }));
}

// ══════════════════════════════════════════════
//  RENDER — Bookings Table
// ══════════════════════════════════════════════
function renderBookings(bookings) {
  const tbody = document.getElementById('bookingsBody');
  if (!tbody) return;

  if (!bookings.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="no-data">Abhi koi booking nahi hai.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map((b, i) => {
    const cat = (b.game || '').toLowerCase();
    let badgeClass = 'badge-ps5';
    if (cat.includes('pc'))                       badgeClass = 'badge-pc';
    else if (cat.includes('ps4'))                 badgeClass = 'badge-ps4';
    else if (cat.includes('vr') || cat.includes('racing')) badgeClass = 'badge-vr';

    const dateStr = b.createdAt
      ? new Date(b.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
      : (b.date || '—');

    return `<tr>
      <td style="color:var(--muted);">${i + 1}</td>
      <td>
  <span class="badge ${badgeClass}">
    ${b.game || '—'}
  </span>
  <br>
  <small style="color:#aaa;">
    👤 ${b.name || 'N/A'}
  </small>
</td>
      <td>${b.slot || '—'}</td>
      <td style="color:var(--neon);font-family:var(--font-head);">
₹${b.amount || 0}
</td>
      <td style="color:var(--muted);font-size:0.82rem;">${b.paymentId || '—'}</td>
      <td style="color:var(--muted);">${dateStr}</td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════
//  RENDER — Games Catalogue
// ══════════════════════════════════════════════
const CAT_ICONS = {
  pc:'🖥️', ps4:'🎮', ps5:'🕹️', vr:'🥽',
  racing:'🏎️', xbox:'🎮', switch:'🕹️', mobile:'📱'
};

function getCatIcon(cat) {
  const key = (cat || '').toLowerCase().replace(/\s+/g,'');
  for (const k in CAT_ICONS) if (key.includes(k)) return CAT_ICONS[k];
  return '🎮';
}

function renderGamesList(games) {
  const el = document.getElementById('gamesList');
  if (!el) return;

  if (!games.length) {
    el.innerHTML = `<p class="no-data" style="grid-column:1/-1;padding:2rem 0;">
      Koi game nahi hai. Upar form se add karo.
    </p>`;
    return;
  }

  el.innerHTML = games.map(g => `
    <div class="game-item">
      <div class="game-info">
        <h4>${getCatIcon(g.category)} ${g.title}</h4>
        <p>${g.category} &nbsp;·&nbsp; Slots: ${g.time === 'all' ? 'All day' : (g.time || 'All day')}</p>
      </div>
      <div style="display:flex;align-items:center;gap:0.8rem;flex-shrink:0;">
        <span class="game-price">₹${g.price}</span>
        <button class="delete-btn" onclick="deleteGame('${g._id}')">✕ Remove</button>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════
//  RENDER ALL — main function
// ══════════════════════════════════════════════
async function renderAll() {
  const [games, bookings] = await Promise.all([fetchGames(), fetchBookings()]);
  renderStats(games, bookings);
  renderBookings(bookings);
  renderGamesList(games);
}

// ── also expose as renderDashboard for admin.html compatibility ──
function renderDashboard() { renderAll(); }

// ══════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', renderAll);