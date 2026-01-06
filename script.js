// ---------------------------
// script.js - Projeto Fênix PWA Planner
// ---------------------------

// Retorna data local no formato YYYY-MM-DD
function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Cria calendário do mês no container
function generateMonthlyCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 a 11
  const todayStr = getTodayLocal();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  container.innerHTML = ''; // limpa container

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const entry = document.createElement('div');
    entry.classList.add('daily-entry', 'border', 'p-2', 'rounded', 'mb-2');
    entry.dataset.date = dateStr;

    // Verifica se já tem nota salva
    const savedNote = localStorage.getItem(`note-${dateStr}`) || '';

    entry.innerHTML = `
      <h3>Dia ${day}</h3>
      <textarea class="daily-note w-full p-1 border rounded" placeholder="Escreva aqui suas reflexões...">${savedNote}</textarea>
      <button class="save-btn mt-1 p-1 bg-purple-500 text-white rounded">Salvar</button>
    `;

    if (dateStr === todayStr) {
      entry.style.display = 'block';
      entry.classList.add('today-highlight');
    } else {
      entry.style.display = 'none';
    }

    container.appendChild(entry);

    // Adiciona evento de salvar nota
    const saveBtn = entry.querySelector('.save-btn');
    const textarea = entry.querySelector('.daily-note');
    saveBtn.addEventListener('click', () => {
      localStorage.setItem(`note-${dateStr}`, textarea.value);
      alert('Nota salva com sucesso!');
    });
  }
}

// Mostra uma entrada específica por data
function showEntry(dateStr) {
  const entries = document.querySelectorAll('.daily-entry');
  entries.forEach(entry => {
    entry.style.display = entry.dataset.date === dateStr ? 'block' : 'none';
  });
}

// Navegação entre dias
function setupNavigation() {
  const prevBtn = document.getElementById('prev-day');
  const nextBtn = document.getElementById('next-day');

  if (!prevBtn || !nextBtn) return;

  let currentDate = getTodayLocal();

  prevBtn.addEventListener('click', () => {
    currentDate = shiftDate(currentDate, -1);
    showEntry(currentDate);
  });

  nextBtn.addEventListener('click', () => {
    currentDate = shiftDate(currentDate, 1);
    showEntry(currentDate);
  });
}

// Função para avançar ou retroceder dias
function shiftDate(dateStr, offset) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day + offset);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ---------------------------
// Inicialização
// ---------------------------
window.addEventListener('DOMContentLoaded', () => {
  generateMonthlyCalendar('calendar-container');
  setupNavigation();
  showEntry(getTodayLocal());
});

// ---------------------------
// Service Worker
// ---------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registrado com sucesso:', reg))
      .catch(err => console.error('Falha ao registrar Service Worker:', err));
  });
}
