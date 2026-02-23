const API_URL = 'https://raw.githubusercontent.com/denizsuyu/film/main/film.json';

let items = [];
let desc = true;

const $search = document.getElementById('search');
const $list = document.getElementById('list');
const $toggle = document.getElementById('toggle');
const $count = document.getElementById('count');

function parseDate(s){
  const [d,m,y] = (s||'').split('.').map(Number);
  return new Date(y||0, (m||1)-1, d||1);
}

function sortItems(arr){
  return arr.slice().sort((a,b)=>{
    const da = parseDate(a.date);
    const db = parseDate(b.date);
    const dateDiff = db - da; // db - da gives descending diff
    if(dateDiff === 0){
      // if dates equal, fall back to id with same direction as date
      return desc ? (b.id - a.id) : (a.id - b.id);
    }
    return desc ? dateDiff : -dateDiff;
  });
}

function render(list){
  $list.innerHTML = list.map(it=>{
    return `<li class="item"><div>
      <div class="name">${escapeHtml(it.name)}</div>
      <div class="meta">ID: ${it.id}</div>
    </div><div class="meta">${it.date}</div></li>`
  }).join('');
  if($count) $count.textContent = `${list.length} records`;
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

function applyFilters(){
  const q = ($search.value||'').trim().toLowerCase();
  let filtered = items.filter(it=> it.name.toLowerCase().includes(q));
  filtered = sortItems(filtered);
  render(filtered);
}

async function fetchData(){
  try{
    const res = await fetch(API_URL, {cache:'no-cache'});
    if(!res.ok) throw new Error('Fetch failed');
    items = await res.json();
    items = Array.isArray(items) ? items : [];
    items = sortItems(items);
    render(items);
  }catch(e){
    console.error(e);
    $list.innerHTML = '<li class="item"><div class="meta">Data failed to load.</div></li>';
    if($count) $count.textContent = '0 records';
  }
}

$search.addEventListener('input', applyFilters);
$toggle.addEventListener('click', ()=>{ desc = !desc; $toggle.textContent = `sort: ${desc? '↓' : '↑'}`; applyFilters(); });

// focus the search input on initial load
$search.focus();

fetchData();
