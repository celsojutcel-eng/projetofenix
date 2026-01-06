// ===============================
// Projeto Fênix – script.js FINAL
// ===============================

// ---------- CONSTANTES ----------
const MOODS = [
  'Leve', 'Cansada', 'Inspirada', 'Ansiosa',
  'Presente', 'Confusa', 'Grata', 'Empoderada'
];

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

// ---------- FUNÇÕES DE DATA (SEM BUG UTC) ----------
function getTodayLocal() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 🔥 FUNÇÃO CRÍTICA – evita bug de um dia a menos
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12); // meio-dia = seguro
}

// ---------- ESTADO ----------
let state = {
  selectedDate: getTodayLocal(),
  currentEntry: null,
  entries: []
};

// ---------- STORAGE ----------
try {
  const saved = localStorage.getItem('projeto_fenix_data');
  if (saved) state.entries = JSON.parse(saved);
} catch {
  localStorage.removeItem('projeto_fenix_data');
  state.entries = [];
}

function saveData() {
  localStorage.setItem('projeto_fenix_data', JSON.stringify(state.entries));
}

// ---------- RENDER DATA NO CABEÇALHO ----------
function renderDateHeader(dateStr) {
  const dateObj = parseLocalDate(dateStr);

  document.getElementById('display-day-name').textContent =
    dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  document.getElementById('display-full-date').textContent =
    dateObj.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
}

// ---------- CARREGAR DIA ----------
function loadDailyEntry(date) {
  const loading = document.getElementById('loading-overlay');
  const form = document.getElementById('entry-form');
  const questionsContainer = document.getElementById('questions-container');
  const moodContainer = document.getElementById('mood-container');

  loading.classList.remove('hidden');
  form.classList.add('hidden');

  let entry = state.entries.find(e => e.date === date);

  if (!entry) {
    entry = {
      date,
      phrase: DAILY_PHRASES[Math.floor(Math.random() * DAILY_PHRASES.length)],
      questions: QUESTIONS.map(q => ({ text: q, answer: '' })),
      mood: '',
      writing: '',
      selfcare: '',
      anchor: ''
    };
    state.entries.push(entry);
    saveData();
  }

  state.currentEntry = entry;

  renderDateHeader(date);
  document.getElementById('display-phrase').textContent = entry.phrase;

  // Perguntas
  questionsContainer.innerHTML = '';
  entry.questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'card p-4';

    const p = document.createElement('p');
    p.textContent = q.text;

    const ta = document.createElement('textarea');
    ta.className = 'input-elegant w-full';
    ta.value = q.answer;
    ta.oninput = e => {
      entry.questions[i].answer = e.target.value;
      saveData();
    };

    card.appendChild(p);
    card.appendChild(ta);
    questionsContainer.appendChild(card);
  });

  // Moods
  moodContainer.innerHTML = '';
  MOODS.forEach(m => {
    const btn = document.createElement('button');
    btn.textContent = m;
    btn.className = 'btn-mood';
    if (entry.mood === m) btn.classList.add('active');

    btn.onclick = () => {
      entry.mood = m;
      saveData();
      loadDailyEntry(date);
    };

    moodContainer.appendChild(btn);
  });

  // Escrita terapêutica
  const writing = document.getElementById('input-writing');
  writing.value = entry.writing;
  writing.oninput = e => {
    entry.writing = e.target.value;
    saveData();
  };

  // Autocuidado
  const selfcare = document.getElementById('input-selfcare');
  selfcare.value = entry.selfcare;
  selfcare.oninput = e => {
    entry.selfcare = e.target.value;
    saveData();
  };

  // Âncora
  const anchor = document.getElementById('input-anchor');
  anchor.value = entry.anchor;
  anchor.oninput = e => {
    entry.anchor = e.target.value;
    saveData();
  };

  loading.classList.add('hidden');
  form.classList.remove('hidden');
}

// ---------- DATE PICKER ----------
const datePicker = document.getElementById('date-picker');
datePicker.value = state.selectedDate;

datePicker.addEventListener('change', e => {
  state.selectedDate = e.target.value;
  loadDailyEntry(state.selectedDate);
});

// ---------- INIT ----------
window.addEventListener('DOMContentLoaded', () => {
  loadDailyEntry(state.selectedDate);
});

// ---------- SERVICE WORKER (CORRETO) ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.error('Erro no Service Worker', err));
  });
}

// ---------- BOTÃO INSTALAR PWA ----------
let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = "📲 Instalar Projeto Fênix";
  installBtn.style.position = "fixed";
  installBtn.style.bottom = "16px";
  installBtn.style.right = "16px";
  installBtn.style.background = "#c67b5c";
  installBtn.style.color = "#fff";
  installBtn.style.border = "none";
  installBtn.style.borderRadius = "1rem";
  installBtn.style.padding = "0.75rem 1rem";
  installBtn.style.fontWeight = "bold";
  installBtn.style.cursor = "pointer";
  installBtn.style.zIndex = "999";

  document.body.appendChild(installBtn);

  installBtn.onclick = async () => {
    installBtn.disabled = true;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    installBtn.remove();
    deferredPrompt = null;
  };
});
