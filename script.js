// ---------------------------
// script.js - Projeto Fênix PWA Planner (corrigido para data local)
// ---------------------------

// Retorna data local no formato YYYY-MM-DD
function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const MOODS = ['Leve','Cansada','Inspirada','Ansiosa','Presente','Confusa','Grata','Empoderada'];
const QUESTIONS = [
  "O que sua alma pede hoje?",
  "Onde você pode ser mais gentil consigo?",
  "O que precisa de pausa agora?"
];
const DAILY_PHRASES = [
  "Renove sua energia e desperte sua essência.",
  "Cada amanhecer é um convite ao autoconhecimento.",
  "Pequenos passos diários criam grandes transformações.",
  "O silêncio revela aquilo que palavras não conseguem.",
  "Respire fundo e sinta seu ritmo interno.",
  "Gratidão transforma o ordinário em extraordinário.",
  "Permita-se pausar e ouvir seu coração.",
  "O reencontro com você começa no agora.",
  "A coragem surge quando você se escuta.",
  "Liberte-se do que não serve mais."
];

// ===== ESTADO =====
let state = {
  selectedDate: getTodayLocal(),
  currentEntry: null,
  entries: []
};

try {
  const saved = localStorage.getItem('projeto_fenix_data');
  if(saved) state.entries = JSON.parse(saved);
} catch(e){
  localStorage.removeItem('projeto_fenix_data');
  state.entries = [];
}

function saveData(){
  localStorage.setItem('projeto_fenix_data', JSON.stringify(state.entries));
}

// Carrega entrada do dia
function loadDailyEntry(date){
  const loading = document.getElementById('loading-overlay');
  const form = document.getElementById('entry-form');
  const questionsContainer = document.getElementById('questions-container');
  const moodContainer = document.getElementById('mood-container');

  loading.classList.remove('hidden');
  form.classList.add('hidden');

  let entry = state.entries.find(e => e.date === date);
  if(!entry){
    entry = {
      date,
      phrase: DAILY_PHRASES[Math.floor(Math.random()*DAILY_PHRASES.length)],
      questions: QUESTIONS.map(q => ({text: q, answer: ''})),
      mood: '',
      writing: '',
      selfcare: '',
      anchor: ''
    };
    state.entries.push(entry);
    saveData();
  }

  state.currentEntry = entry;

  // Datas e frase
  const [y, m, d] = date.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);

  document.getElementById('display-phrase').textContent = entry.phrase;
  document.getElementById('display-full-date').textContent = dateObj.toLocaleDateString('pt-BR',{year:'numeric', month:'long', day:'numeric'});
  document.getElementById('display-day-name').textContent = dateObj.toLocaleDateString('pt-BR',{weekday:'long'});

  // Perguntas
  questionsContainer.innerHTML = '';
  entry.questions.forEach((q,i)=>{
    const card = document.createElement('div');
    card.className = 'card p-4';
    const p = document.createElement('p'); p.textContent = q.text;
    const ta = document.createElement('textarea');
    ta.className = 'input-elegant w-full'; ta.value = q.answer;
    ta.oninput = e => { entry.questions[i].answer = e.target.value; saveData(); };
    card.appendChild(p); card.appendChild(ta); questionsContainer.appendChild(card);
  });

  // Moods
  moodContainer.innerHTML = '';
  MOODS.forEach(m=>{
    const btn = document.createElement('button');
    btn.textContent = m;
    btn.className = 'btn-mood';
    if(entry.mood === m) btn.classList.add('active');
    btn.onclick = () => { entry.mood = m; saveData(); loadDailyEntry(date); };
    moodContainer.appendChild(btn);
  });

  // Escrita terapêutica
  const inputWriting = document.getElementById('input-writing');
  inputWriting.value = entry.writing;
  inputWriting.oninput = e => { entry.writing = e.target.value; saveData(); };

  // Autocuidado
  const inputSelfcare = document.getElementById('input-selfcare');
  inputSelfcare.value = entry.selfcare;
  inputSelfcare.oninput = e => { entry.selfcare = e.target.value; saveData(); };

  // Âncora do dia
  const inputAnchor = document.getElementById('input-anchor');
  inputAnchor.value = entry.anchor;
  inputAnchor.oninput = e => { entry.anchor = e.target.value; saveData(); };

  loading.classList.add('hidden'); 
  form.classList.remove('hidden');
}

// Eventos
const datePicker = document.getElementById('date-picker');
datePicker.value = state.selectedDate;
datePicker.onchange = e => {
  state.selectedDate = e.target.value;
  loadDailyEntry(state.selectedDate);
};

// Inicialização
window.addEventListener('DOMContentLoaded', ()=>{ loadDailyEntry(state.selectedDate); });

// Service Worker PWA
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').then(reg => console.log("Service Worker registrado!", reg));
  });
}

// Botão instalação PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e=>{
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.createElement('button');
  installBtn.textContent = "📲 Instalar Projeto Fênix";
  installBtn.style.position = "fixed"; installBtn.style.bottom = "16px";
  installBtn.style.right = "16px";
  installBtn.style.background = "#D946EF";
  installBtn.style.color = "white";
  installBtn.style.border = "none";
  installBtn.style.borderRadius = "1rem";
  installBtn.style.padding = "0.75rem 1rem";
  installBtn.style.fontWeight = "bold";
  installBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  installBtn.style.cursor = "pointer";
  document.body.appendChild(installBtn);
  installBtn.addEventListener('click', async ()=>{
    installBtn.disabled = true;
    deferredPrompt.prompt();
    const {outcome} = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.remove();
    if(outcome === 'accepted') console.log("Usuário instalou o PWA!");
  });
});
