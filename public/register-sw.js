self.addEventListener('load', () => {
  const registerSW = document.getElementById('uv-register-sw');
  
  registerSW.addEventListener('click', async () => {
    try {
      await navigator.serviceWorker.register('/uv/uv.sw.js', {
        scope: __uv$config.prefix
      });
      
      console.log('Service worker registered successfully');
      location.reload();
    } catch (err) {
      console.error('Failed to register service worker:', err);
      alert('Failed to register service worker: ' + err.toString());
    }
  });
});
