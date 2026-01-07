// ------------------------------
// SERVICE WORKER
// ------------------------------
if('serviceWorker' in navigator){
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js');
      console.log('[SW] Registrado com sucesso:', reg);
    } catch(err) {
      console.error('[SW] Falha ao registrar:', err);
    }
  });
}

// ------------------------------
// BOTÃO INSTALAR PWA
// ------------------------------
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  }
});
