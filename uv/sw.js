/*global UVServiceWorker,__uv$config*/
/*
 * Stock service worker script.
 * Users can provide their own sw.js if they need to extend the functionality of the service worker.
 * Ideally, this will be registered under the scope in uv.config.js so it will not need to be modified.
 * However, if a user changes the location of uv.bundle.js/uv.config.js or sw.js is not relative to them, they will need to modify this script locally.
 */
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");


const uv = new UVServiceWorker();

async function handleRequest(event) {
	if (uv.route(event)) {
		return await uv.fetch(event);
	}

	return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});





/**/
console.log("Service Worker is loading...");

try {
    importScripts("/uv/uv.bundle.js");
    console.log("uv.bundle.js loaded successfully");

    importScripts("/uv/uv.config.js");
    console.log("uv.config.js loaded successfully");

    importScripts("/uv/uv.sw.js");
    console.log("uv.sw.js loaded successfully");

    const uv = new UVServiceWorker();

    async function handleRequest(event) {
        console.log("Handling request:", event.request.url);
        if (uv.route(event)) {
            console.log("Routing request through UV");
            return await uv.fetch(event);
        }

        return await fetch(event.request);
    }

    self.addEventListener("fetch", (event) => {
        console.log("Fetch event:", event.request.url);
        event.respondWith(handleRequest(event));
    });

    console.log("Service Worker loaded successfully!");
} catch (e) {
    console.error("Error loading Service Worker:", e);
}
