'use strict';

const config = {
	version: location.hostname === 'localhost' ? new Date().toISOString() : '1.0.0-a8',
	stale: [
		'/',
		'/js/index.js',
		'/js/share-button.js',
		'/js/share-config.js',
		'/js/gravatar-img.js',
		'/js/current-year.js',
		'/js/imgur-img.js',
		'/js/rental-properties.js',
		'/js/schema-postal-address.js',
		'/js/slot-helpers.js',
		'https://cdn.kernvalley.us/js/std-js/deprefixer.js',
		'https://cdn.kernvalley.us/js/std-js/shims.js',
		'https://cdn.kernvalley.us/js/std-js/md5.js',
		'https://cdn.kernvalley.us/js/std-js/Notification.js',
		'https://cdn.kernvalley.us/js/std-js/webShareApi.js',
		'https://cdn.kernvalley.us/js/std-js/esQuery.js',
		'https://cdn.kernvalley.us/js/std-js/functions.js',
		'https://cdn.kernvalley.us/components/login-button.js',
		'https://cdn.kernvalley.us/components/logout-button.js',
		'https://cdn.kernvalley.us/components/gravatar-img.js',
		'https://cdn.kernvalley.us/js/std-js/asyncDialog.js',
		'https://cdn.kernvalley.us/js/User.js',
		'https://cdn.kernvalley.us/js/PaymentAPI/PaymentRequestUpdateEvent.js',
		'https://cdn.kernvalley.us/js/PaymentAPI/PaymentAddress.js',
		'https://cdn.kernvalley.us/js/PaymentAPI/PaymentResponse.js',
		'https://cdn.kernvalley.us/js/PaymentAPI/BasicCardResponse.js',
		'https://cdn.kernvalley.us/js/PaymentAPI/BillingAddress.js',
		'https://cdn.kernvalley.us/components/payment-form/payment-form.js',
		'https://cdn.kernvalley.us/components/login-form/login-form.html',
		'https://cdn.kernvalley.us/components/registration-form/registration-form.html',
		'/css/index.css',
		'/css/vars.css',
		'/css/layout.css',
		'/css/header.css',
		'/css/nav.css',
		'/css/main.css',
		'/css/sidebar.css',
		'/css/footer.css',
		'https://cdn.kernvalley.us/css/core-css/rem.css',
		'https://cdn.kernvalley.us/css/core-css/viewport.css',
		'https://cdn.kernvalley.us/css/core-css/element.css',
		'https://cdn.kernvalley.us/css/core-css/class-rules.css',
		'https://cdn.kernvalley.us/css/core-css/utility.css',
		'https://cdn.kernvalley.us/css/core-css/fonts.css',
		'https://cdn.kernvalley.us/css/core-css/animations.css',
		'https://cdn.kernvalley.us/css/normalize/normalize.css',
		'https://cdn.kernvalley.us/css/animate.css/animate.css',
		'/img/apple-touch-icon.png',
		'/img/favicon.svg',
		'/img/octicons/mail.svg',
		'/img/logos/instagram.svg',
		'/img/icons.svg',
		'/img/listings/05c6cbb6-713f-486d-a867-e3f70d967bb5.jpg',
		'/listings.json',
	].map(path => new URL(path, location.origin).href),
};

self.addEventListener('install', async () => {
	const cache = await caches.open(config.version);
	const keys = await caches.keys();
	const old = keys.filter(k => k !== config.version);
	await Promise.all(old.map(key => caches.delete(key)));

	try {
		await cache.addAll(config.stale);
	} catch (err) {
		console.error(err);
	}

	skipWaiting();
});

self.addEventListener('activate', event => {
	event.waitUntil(async function() {
		clients.claim();
	}());
});

self.addEventListener('fetch', async event => {
	if (event.request.method === 'GET' && config.stale.includes(event.request.url)) {
		const cache = await caches.open(config.version);
		const cached = await cache.match(event.request);

		if (cached instanceof Response) {
			event.respondWith(cached);
		}
	}
});
