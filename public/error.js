const params = new URLSearchParams(window.location.search);
const errorCode = params.get('err');
const errorMessage = params.get('message') || 'Unknown error occurred';

document.addEventListener('DOMContentLoaded', () => {
  const errorElement = document.getElementById('uv-error');
  const codeElement = document.getElementById('uv-error-code');
  const registerButton = document.getElementById('uv-register-sw');

  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
  
  if (codeElement && errorCode) {
    codeElement.textContent = errorCode;
  }

  if (registerButton) {
    registerButton.addEventListener('click', async () => {
      try {
        await navigator.serviceWorker.register('/uv/uv.sw.js', {
          scope: __uv$config.prefix
        });
        location.reload();
      } catch (err) {
        alert('Failed to register service worker: ' + err.toString());
      }
    });
  }
});
