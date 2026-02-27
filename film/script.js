const DATA_URL = (window.__DATA_URL__ || new URLSearchParams(location.search).get('data') || 'https://raw.githubusercontent.com/denizsuyu/film/main/film.json');

function parseDateDMY(s) { const [d, m, y] = s.split('.').map(Number); return new Date(y, m - 1, d) }
async function load() { const res = await fetch(DATA_URL); if (!res.ok) throw new Error('...'); const data = await res.json(); return data }
function sortFilms(list) { return list.slice().sort((a, b) => { const da = parseDateDMY(a.date), db = parseDateDMY(b.date); if (db - da !== 0) return db - da; return b.id - a.id }) }
function render(list) {
    const root = document.getElementById('list'); root.innerHTML = ''; if (!list.length) { root.innerHTML = '<p style="color:var(--muted);text-align:center">...</p>'; return }
    const countEl = document.getElementById('count');
    if (countEl) countEl.textContent = `${list.length} result`;
    const frag = document.createDocumentFragment(); for (const f of list) { const card = document.createElement('article'); card.className = 'card'; const name = document.createElement('div'); name.className = 'name'; name.textContent = f.name; const meta = document.createElement('div'); meta.className = 'meta'; const date = document.createElement('div'); date.textContent = f.date; const id = document.createElement('div'); id.textContent = '#' + String(f.id).padStart(2, '0'); meta.append(date, id); card.append(name, meta); frag.append(card) } root.append(frag)
}

function connectSearch(original) {
    const input = document.getElementById('search'); input.addEventListener('input', () => { const q = input.value.trim().toLowerCase(); if (!q) { render(original); return } render(original.filter(f => f.name.toLowerCase().includes(q) || String(f.id).includes(q))) });
}

async function init() { try { const data = await load(); const sorted = sortFilms(data); render(sorted); connectSearch(sorted) } catch (e) { const root = document.getElementById('list'); root.innerHTML = '<p style="color:#a66; text-align:center">...</p>' } }

async function init() { try { const data = await load(); const sorted = sortFilms(data); render(sorted); connectSearch(sorted); const input = document.getElementById('search'); if (input) { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } } } catch (e) { const root = document.getElementById('list'); root.innerHTML = '<p style="color:#a66; text-align:center">...</p>' } }

init()
