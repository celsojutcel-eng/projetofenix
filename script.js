// script.js do Projeto Fênix
console.log('script.js carregado!');

// Exemplo de função para daily entries
function loadDailyEntry() {
  const entries = document.querySelectorAll('.daily-entry');
  if (!entries) return; // evita erro se não houver elementos
  entries.forEach(entry => {
    console.log('Carregando entrada diária:', entry);
  });
}

// Chama a função quando a página carrega
window.addEventListener('DOMContentLoaded', loadDailyEntry);

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registrado com sucesso:', reg))
      .catch(err => console.error('Falha ao registrar Service Worker:', err));
  });
}
