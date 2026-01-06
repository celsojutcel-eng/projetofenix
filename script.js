// ===============================
// Projeto Fênix – script.js
// Correção definitiva de data
// ===============================

// ---------- UTILIDADES DE DATA ----------

// Retorna data local real (YYYY-MM-DD) SEM UTC
function getTodayLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Converte YYYY-MM-DD para objeto Date seguro
function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Renderiza dia da semana e data longa
function renderDateHeader(dateString) {
  const date = parseLocalDate(dateString);

  const weekDay = date.toLocaleDateString('pt-BR', {
    weekday: 'long'
  });

  const fullDate = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const dayNameEl = document.getElementById('display-day-name');
  const fullDateEl = document.getElementById('display-full-date');

  if (dayNameEl) dayNameEl.textContent = weekDay;
  if (fullDateEl) fullDateEl.textContent = fullDate;
}

// ---------- CALENDÁRIO ----------

function generateMonthlyCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const todayStr = getTodayLocal();
  const todayDate = parseLocalDate(todayStr);

  const year = todayDate.getFullYear();
  const month = todayDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  container.innerHTML = '';

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const entry = document.createElement('div');
    entry.className = 'daily-entry';
    entry.dataset.date = dateStr;

    const savedNote = localStorage.getItem(`note-${dateStr}`) || '';

    entry.innerHTML = `
      <h3>Dia ${day}</h3>
      <textarea class="daily-note" placeholder="Escreva aqui suas reflexões...">${savedNote}</textarea>
      <button class="save-btn">Salvar</button>
    `;

    entry.style.display = dateStr === todayStr ? 'block' : 'none';

    const btn = entry.querySelector('.save-btn');
    const textarea = entry.querySelector('.daily-note');

    btn.addEventListener('click', () => {
      localStorage.setItem(`note-${dateStr}`, textarea.value);
      alert('Nota salva com sucesso!');
    });

    container.appendChild(entry);
  }
}

// ---------- EXIBIÇÃO DE ENTRADA ----------

function showEntry(dateString) {
  document.querySelectorAll('.daily-entry').forEach(entry => {
    entry.style.display = entry.dataset.date === dateString ? 'block' : 'none';
  });
}

// ---------- NAVEGAÇÃO ----------

function shiftDate(dateString, offset) {
  const date = parseLocalDate(dateString);
  date.setDate(date.getDate() + offset);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
}

function setupNavigation() {
  const prevBtn = document.getElementById('prev-day');
  const nextBtn = document.getElementById('next-day');
  const datePicker = document.getElementById('date-picker');

  if (!datePicker) return;

  let currentDate = datePicker.value || getTodayLocal();

  function update(dateStr) {
    currentDate = dateStr;
    datePicker.value = dateStr;
    renderDateHeader(dateStr);
    showEntry(dateStr);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      update(shiftDate(currentDate, -1));
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      update(shiftDate(currentDate, 1));
    });
  }

  datePicker.addEventListener('change', (e) => {
    update(e.target.value);
  });

  update(currentDate);
}

// ---------- INICIALIZAÇÃO ----------

window.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('date-picker');

  if (datePicker) {
    datePicker.value = getTodayLocal();
    renderDateHeader(datePicker.value);
  }

  generateMonthlyCalendar('calendar-container');
  setupNavigation();
});

// ---------- SERVICE WORKER ----------

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then(() => console.log('Service Worker registrado'))
      .catch(err => console.error('Erro no Service Worker:', err));
  });
}
