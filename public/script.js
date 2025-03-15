// public/script.js
window.addEventListener('load', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    let url = document.querySelector('input').value;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const encodedUrl = __uv$config.encodeUrl(url);
    const fullUrl = __uv$config.prefix + encodedUrl;
    
    location.href = fullUrl;
  });
});
