<script>
/* ==========================================
   PROJETO FÊNIX — SCRIPT ESTÁVEL
   ✔ NÃO quebra após Clear Site Data
========================================== */

/* ---------- DATA LOCAL ---------- */
function getLocalDateISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

/* ---------- CONSTANTES ---------- */
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
  "Respire fundo e sinta seu ritmo interno."
];

/* ---------- ESTADO ---------- */
let state = {
  selectedDate: getLocalDateISO(),
  entries: []
};

/* ---------- STORAGE ---------- */
try {
  const saved = localStorage.getItem('projeto_fenix_data');
  if (saved) state.entries = JSON.parse(saved);
} catch {
  localStorage.removeItem('projeto_fenix_data');
}

function saveData() {
  localStorage.setItem('projeto_fenix_data', JSON.stringify(state.entries));
}

/* ---------- LOAD DAY ---------- */
function loadDailyEntry(dateStr) {
  const loading = document.getElementById('loading-overlay');
  const form = document.getElementById('entry-form');
  const moodContainer = document.getElementById('mood-container');
  const questionsContainer = document.getElementById('questions-container');

  loading.classList.remove('hidden');
  form.classList.add('hidden');

  let entry = state.entries.find(e => e.date === dateStr);

  if (!entry) {
    entry = {
      date: dateStr,
      phrase: DAILY_PHRASES[Math.floor(Math.random()*DAILY_PHRASES.length)],
      questions: QUESTIONS.map(q => ({ text:q, answer:'' })),
      mood:'',
      writing:'',
      selfcare:'',
      anchor:''
    };
    state.entries.push(entry);
    saveData();
  }

  const [y,m,d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m-1, d);

  document.getElementById('display-day-name').textContent =
    dateObj.toLocaleDateString('pt-BR',{weekday:'long'});

  document.getElementById('display-full-date').textContent =
    dateObj.toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});

  document.getElementById('display-phrase').textContent = entry.phrase;

  questionsContainer.innerHTML = '';
  entry.questions.forEach((q,i)=>{
    const div = document.createElement('div');
    div.className='card p-4';
    div.innerHTML = `<p>${q.text}</p><textarea class="input-elegant w-full">${q.answer}</textarea>`;
    div.querySelector('textarea').oninput = e=>{
      entry.questions[i].answer = e.target.value;
      saveData();
    };
    questionsContainer.appendChild(div);
  });

  moodContainer.innerHTML='';
  MOODS.forEach(m=>{
    const btn=document.createElement('button');
    btn.className='btn-mood';
    btn.textContent=m;
    if(entry.mood===m) btn.classList.add('active');
    btn.onclick=()=>{
      entry.mood=m;
      saveData();
      loadDailyEntry(dateStr);
    };
    moodContainer.appendChild(btn);
  });

  document.getElementById('input-writing').value = entry.writing;
  document.getElementById('input-selfcare').value = entry.selfcare;
  document.getElementById('input-anchor').value = entry.anchor;

  document.getElementById('input-writing').oninput = e=>{entry.writing=e.target.value;saveData();};
  document.getElementById('input-selfcare').oninput = e=>{entry.selfcare=e.target.value;saveData();};
  document.getElementById('input-anchor').oninput = e=>{entry.anchor=e.target.value;saveData();};

  loading.classList.add('hidden');
  form.classList.remove('hidden');
}

/* ---------- INICIALIZAÇÃO SEGURA ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('date-picker');
  datePicker.value = state.selectedDate;
  datePicker.addEventListener('change', e => {
    state.selectedDate = e.target.value;
    loadDailyEntry(state.selectedDate);
  });

  loadDailyEntry(state.selectedDate);
});
</script>
