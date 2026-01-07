<script>
/* ==========================================
   PROJETO FÊNIX — PLANNER DIÁRIO (FINAL)
   ✔ Data local real (sem UTC)
   ✔ Input date sincronizado
   ✔ Sem conflito de carregamento
========================================== */

/* ---------- DATA LOCAL REAL ---------- */
function getLocalDateISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ---------- CONSTANTES ---------- */
const MOODS = [
  'Leve','Cansada','Inspirada','Ansiosa',
  'Presente','Confusa','Grata','Empoderada'
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

/* ---------- ESTADO ---------- */
let state = {
  selectedDate: getLocalDateISO(),
  currentEntry: null,
  entries: []
};

/* ---------- LOCAL STORAGE ---------- */
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

/* ---------- CARREGAR DIA ---------- */
function loadDailyEntry(dateStr) {
  const loading = document.getElementById('loading-overlay');
  const form = document.getElementById('entry-form');
  const questionsContainer = document.getElementById('questions-container');
  const moodContainer = document.getElementById('mood-container');

  loading.classList.remove('hidden');
  form.classList.add('hidden');

  let entry = state.entries.find(e => e.date === dateStr);

  if (!entry) {
    entry = {
      date: dateStr,
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

  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);

  document.getElementById('display-day-name').textContent =
    dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

  document.getElementById('display-full-date').textContent =
    dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

  document.getElementById('display-phrase').textContent = entry.phrase;

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

  moodContainer.innerHTML = '';
  MOODS.forEach(mood => {
    const btn = document.createElement('button');
    btn.textContent = mood;
    btn.className = 'btn-mood';
    if (entry.mood === mood) btn.classList.add('active');

    btn.onclick = () => {
      entry.mood = mood;
      saveData();
      loadDailyEntry(dateStr);
    };

    moodContainer.appendChild(btn);
  });

  const writing = document.getElementById('input-writing');
  const selfcare = document.getElementById('input-selfcare');
  const anchor = document.getElementById('input-anchor');

  writing.value = entry.writing;
  selfcare.value = entry.selfcare;
  anchor.value = entry.anchor;

  writing.oninput = e => { entry.writing = e.target.value; saveData(); };
  selfcare.oninput = e => { entry.selfcare = e.target.value; saveData(); };
  anchor.oninput = e => { entry.anchor = e.target.value; saveData(); };

  loading.classList.add('hidden');
  form.classList.remove('hidden');
}

/* ---------- INICIALIZAÇÃO FINAL ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('date-picker');

  state.selectedDate = getLocalDateISO();
  datePicker.value = state.selectedDate;

  datePicker.addEventListener('change', e => {
    state.selectedDate = e.target.value;
    loadDailyEntry(state.selectedDate);
  });

  loadDailyEntry(state.selectedDate);
});
</script>
