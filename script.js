// =======================================
// PROJETO FÊNIX — PLANNER DIÁRIO (CORRIGIDO)
// =======================================

// ----------- DATA LOCAL NORMALIZADA -----------
// Retorna a data local real (sem UTC) no formato YYYY-MM-DD
function getTodayLocal() {
  const now = new Date();
  const localDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const y = localDate.getFullYear();
  const m = String(localDate.getMonth() + 1).padStart(2, '0');
  const d = String(localDate.getDate()).padStart(2, '0');

  return `${y}-${m}-${d}`;
}

// ----------- GERAR CALENDÁRIO DO MÊS -----------
function generateMonthlyCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const todayStr = getTodayLocal();
  const [year, month] = todayStr.split('-').map(Number);

  const daysInMonth = new Date(year, month, 0).getDate();
  container.innerHTML = '';

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const entry = document.createElement('div');
    entry.className = 'daily-entry border p-4 rounded-lg mb-4';
    entry.dataset.date = dateStr;

    const savedNote = localStorage.getItem(`note-${dateStr}`) || '';

    entry.innerHTML = `
      <h3 class="font-bold text-lg mb-2">Dia ${day}</h3>
      <textarea
        class="daily-note w-full p-2 border rounded mb-2"
        rows="4"
        placeholder="Escreva aqui suas reflexões..."
      >${savedNote}</textarea>
      <button class="save-btn bg-purple-600 text-white px-4 py-2 rounded">
        Salvar
      </button>
    `;

    // mostra apenas o dia atual
    entry.style.display = dateStr === todayStr ? 'block' : 'none';

    if (dateStr === todayStr) {
      entry.classList.add('ring', 'ring-purple-400');
    }

    container.appendChild(entry);

    // salvar nota
    entry.querySelector('.save-btn').addEventListener('click', () => {
      const text = entry.querySelector('.daily-note').value;
      localStorage.setItem(`note-${dateStr}`, text);
      alert('Nota salva com sucesso ✨');
    });
  }
}

// ----------- MOSTRAR DIA ESPECÍFICO -----------
function showEntry(dateStr) {
  document.querySelectorAll('.daily-entry').forEach(entry => {
    entry.style.display = entry.dataset.date === dateStr ? 'block' : 'none';
  });
}

// ----------- AVANÇAR / RETROCEDER DIA -----------
function shiftDate(dateStr, offset) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offset);

  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yy}-${mm}-${dd}`;
}

// ----------- NAVEGAÇÃO -----------
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

// ----------- INICIALIZAÇÃO -----------
document.addEventListener('DOMContentLoaded', () => {
  const today = getTodayLocal();
  generateMonthlyCalendar('calendar-container');
  setupNavigation();
  showEntry(today);
});
