/*importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js');

const messaging = firebase.messaging();
messaging.setBackgroundMessagingHandler(function(payload){
	const title = "AgriNeTT";
	const options = {
		body: payload.data.status
	};
	return self.registration.showNotification(title, options);
});
*/
var cacheName = 'AgriPrice';
var filesToCache = [
	'/',
	'/index.html',
	'/assets/images/launcher.png',
	'/assets/images/logo_agrinet.png',
	'/assets/images/uwi.gif',
	'/assets/images/namdevco.jpg',
	'/assets/images/fruits/banana(grmichel).jpg',
	'/assets/images/fruits/banana(green).jpg',
	'/assets/images/fruits/banana(ripe).jpg',
	'/assets/images/fruits/bodibean.jpg',
	'/assets/images/fruits/cabbage(imported)(gn).jpg',
	'/assets/images/fruits/cabbage(imported)(purple).jpg',
	'/assets/images/fruits/cabbage(white).jpg',
	'/assets/images/fruits/cabbage(local)(gn).jpg',
	'/assets/images/fruits/callaloobush(open).jpg',
	'/assets/images/fruits/callaloobush(roll).jpg',
	'/assets/images/fruits/caraillie(l).jpg',
	'/assets/images/fruits/caraillie(m).jpg',
	'/assets/images/fruits/caraillie(s).jpg',
	'/assets/images/fruits/carrot.jpg',
	'/assets/images/fruits/cassava.jpg',
	'/assets/images/fruits/cauliflower(local).jpg',
	'/assets/images/fruits/cauliflower(imported).jpg',
	'/assets/images/fruits/celery.jpg',
	'/assets/images/fruits/chive(l).jpg',
	'/assets/images/fruits/christophene.jpg',
	'/assets/images/fruits/coconut(dry)(l).jpg',
	'/assets/images/fruits/coconut(dry)(m).jpg',
	'/assets/images/fruits/coconut(dry)(s).jpg',
	'/assets/images/fruits/cucumber.jpg',
	'/assets/images/fruits/dasheen(imported).jpg',
	'/assets/images/fruits/dasheen(local).jpg',
	'/assets/images/fruits/eddoe(imported).jpg',
	'/assets/images/fruits/eddoe(local).jpg',
	'/assets/images/fruits/ginger.jpg',
	'/assets/images/fruits/grapefruit.jpg',
	'/assets/images/fruits/hotpepper(40lb).jpg',
	"/assets/images/fruits/hot pepper(100's).jpg",
	'/assets/images/fruits/lettuce(l).jpg',
	'/assets/images/fruits/lettuce(m).jpg',
	'/assets/images/fruits/lettuce(s).jpg',
	'/assets/images/fruits/lime(l).jpg',
	'/assets/images/fruits/lime(m).jpg',
	'/assets/images/fruits/lime(s).jpg',
	'/assets/images/fruits/melongene(l).jpg',
	'/assets/images/fruits/melongene(m).jpg',
	'/assets/images/fruits/melongene(s).jpg',
	'/assets/images/fruits/ochro.jpg',
	'/assets/images/fruits/orange(king).jpg',
	'/assets/images/fruits/orange(l).jpg',
	'/assets/images/fruits/orange(m).jpg',
	'/assets/images/fruits/orange(navel).jpg',
	'/assets/images/fruits/orange(s).jpg',
	'/assets/images/fruits/patchoi.jpg',
	'/assets/images/fruits/pawpaw.jpg',
	'/assets/images/fruits/pigeonpea.jpg',
	'/assets/images/fruits/pimento(l).jpg',
	'/assets/images/fruits/pimento(m).jpg',
	'/assets/images/fruits/pimento(s).jpg',
	'/assets/images/fruits/pineapple.jpg',
	'/assets/images/fruits/plantain(green).jpg',
	'/assets/images/fruits/plantain(ripe).jpg',
	'/assets/images/fruits/portugal.jpg',
	'/assets/images/fruits/pumpkin.jpg',
	'/assets/images/fruits/seimbean.jpg',
	'/assets/images/fruits/shadonbeni.jpg',
	'/assets/images/fruits/sorrel.jpg',
	'/assets/images/fruits/spinach(amarantusspp).jpg',
	'/assets/images/fruits/squash.jpg',
	'/assets/images/fruits/sweetpepper(imported).jpg',
	'/assets/images/fruits/sweetpepper(l).jpg',
	'/assets/images/fruits/sweetpepper(m).jpg',
	'/assets/images/fruits/sweetpepper(s).jpg',
	'/assets/images/fruits/sweetpotato(imported).jpg',
	'/assets/images/fruits/sweetpotato(local).jpg',
	'/assets/images/fruits/thyme(s).jpg',
	'/assets/images/fruits/tomato(imported).jpg',
	'/assets/images/fruits/tomato(l).jpg',
	'/assets/images/fruits/tomato(m).jpg',
	'/assets/images/fruits/tomato(s).jpg',
	'/assets/images/fruits/watermelon.jpg',
	'/assets/images/fruits/yam(imported).jpg',
	'/assets/images/fruits/yam(local).jpg'
];
self.addEventListener('install', function(e){
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache){
			console.log('Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});
self.addEventListener('activate', function(e){
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function(keyList){
			return Promise.all(keyList.map(function(key){
				if(key !== cacheName){
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});
self.addEventListener('fetch', function(e){
	console.log('[ServiceWorker] fetch', e.request.url);
	e.respondWith(
		caches.match(e.request).then(function(response){
			return response || fetch(e.request);
		})
	);
});
