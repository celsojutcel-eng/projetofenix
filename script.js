// =============================
// DADOS
// =============================
const MOODS = ['Leve','Cansada','Inspirada','Ansiosa','Grata','Presente'];
const QUESTIONS = [
  "O que sua alma pede hoje?",
  "Onde você pode ser mais gentil consigo?",
  "O que precisa de pausa agora?"
];
const PHRASES = [
  "Renove sua energia.",
  "Ouça seu ritmo interno.",
  "Pequenos passos geram grandes mudanças."
];

let state = { date:'', entries:[] };

// =============================
// SALVAR / CARREGAR
// =============================
function save() { localStorage.setItem('fenix', JSON.stringify(state.entries)); }
function load() {
  try {
    const d = localStorage.getItem('fenix');
    if(d) state.entries = JSON.parse(d);
  } catch { state.entries = []; }
}

// =============================
// FUNÇÕES DE DATA
// =============================
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function addDays(dateStr, diff) {
  const [y,m,d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m-1, d + diff, 12);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}

function renderDate(dateStr) {
  const [y,m,d] = dateStr.split('-').map(Number);
  const dt = new Date(y,m-1,d,12);
  display-day-name.textContent = dt.toLocaleDateString('pt-BR',{ weekday:'long' });
  display-full-date.textContent = dt.toLocaleDateString('pt-BR',{ day:'2-digit', month:'long', year:'numeric' });
}

// =============================
// LOAD DIA
// =============================
function loadDay(dateStr){
  state.date = dateStr;
  renderDate(dateStr);

  let entry = state.entries.find(e => e.date === dateStr);
  if(!entry){
    entry = {
      date: dateStr,
      phrase: PHRASES[Math.floor(Math.random()*PHRASES.length)],
      mood: '',
      questions: QUESTIONS.map(q => ({q,a:''})),
      selfcare: '',
      insight: ''
    };
    state.entries.push(entry); save();
  }

  display-phrase.textContent = entry.phrase;

  // moods
  mood-container.innerHTML = '';
  MOODS.forEach(m => {
    const b = document.createElement('button');
    b.textContent = m;
    b.className = 'mood'+(entry.mood===m?' active':'');
    b.onclick = () => { entry.mood = m; save(); loadDay(dateStr); };
    mood-container.appendChild(b);
  });

  // perguntas
  questions-container.innerHTML = '';
  entry.questions.forEach(q => {
    const c = document.createElement('div');
    c.className = 'card';
    c.innerHTML = `<p>${q.q}</p><textarea class="w-full border rounded p-2 mt-2">${q.a}</textarea>`;
    c.querySelector('textarea').oninput = e => { q.a = e.target.value; save(); };
    questions-container.appendChild(c);
  });

  input-selfcare.value = entry.selfcare;
  input-anchor.value = entry.insight;

  input-selfcare.oninput = e => { entry.selfcare = e.target.value; save(); };
  input-anchor.oninput = e => { entry.insight = e.target.value; save(); };
}

// =============================
// INIT
// =============================
document.addEventListener('DOMContentLoaded', () => {
  load();
  date-picker.value = todayISO();
  loadDay(date-picker.value);

  date-picker.onchange = e => loadDay(e.target.value);
  prev-day.onclick = () => loadDay(addDays(state.date,-1));
  next-day.onclick = () => loadDay(addDays(state.date,1));
});

// =============================
// PWA + BOTÃO INSTALAR
// =============================
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; installBtn.style.display='none'; });
  }
});

// SERVICE WORKER
if('serviceWorker' in navigator){
  window.addEventListener('load', async () => {
    try{
      const reg = await navigator.serviceWorker.register('./service-worker.js');
      console.log('[SW] Registrado com sucesso:', reg);
    }catch(err){
      console.error('[SW] Falha ao registrar:', err);
    }
  });
}
