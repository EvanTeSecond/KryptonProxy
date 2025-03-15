const form = document.querySelector('form');
const input = document.querySelector('input');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let url = urlParams.get('site');
const link = document.getElementById("link");
link.href = "https://kryptontools.pages.dev/";
link.innerHTML = "Back";

if(!url){
    document.body.innerHTML = 'No URL Specified';
    document.body.style = "color: white; text-align: center; font-size: 4vw; ";
} else if(!isUrl(url)){
    document.body.innerHTML = 'Not a Valid URL';
    document.body.style = "color: white; text-align: center; font-size: 4vw; ";
} else if(url.includes('google')){
    document.body.innerHTML = 'Google is Not Allowed';
    document.body.style = "color: white; text-align: center; font-size: 4vw; ";
} else {
    setTimeout(() => {
        serveRequest(url);
    }, 2000);
}

function serveRequest(url){
    if(url){
        window.navigator.serviceWorker.register('./uv-sw.js', {
            scope: __uv$config.prefix
        }).then(() => {
            // if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
            if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;
            window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
        });
    }
}
// form.addEventListener('submit', async event => {
    // event.preventDefault();
    // window.navigator.serviceWorker.register('./sw.js', {
        // scope: __uv$config.prefix
    // }).then(() => {
		// url = input.value.trim();
        // if (!isUrl(url)) url = 'https://www.google.com/search?q=' + url;
        // else if (!(url.startsWith('https://') || url.startsWith('http://'))) url = 'http://' + url;
        // window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    // });
// });

function isUrl(val = ''){
    if (/^http(s?):\/\//.test(val) || val.includes('.') && val.substr(0, 1) !== ' ') return true;
    return false;
};
