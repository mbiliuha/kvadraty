/* Квадрати: офлайн-кеш. Сторінка — спершу з мережі (щоб оновлення приходили), без мережі — з кешу.
   Бібліотеки та шрифти — з кешу. Плитки карти не кешуємо. */
const C='kv-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(/\/tile\/|\/\d+\/\d+\/\d+(\.png|\.jpg)?$/.test(u.pathname))return;
  if(u.origin===self.location.origin){
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(req,c));return r})
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('./',{ignoreSearch:true}))));
    return;
  }
  if(/unpkg\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|telegram\.org|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(u.hostname)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(n=>{const c=n.clone();caches.open(C).then(x=>x.put(req,c));return n})));
  }
});
