/* PCM Controle de O.S. — bootstrap local
   Este arquivo existe deliberadamente no projeto para evitar referências quebradas a /main.js.
   Ele também prepara a biblioteca Supabase antes da inicialização do aplicativo.
*/
(function () {
  'use strict';

  const SUPABASE_CLIENT_CDNS = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/@supabase/supabase-js@2',
    'https://esm.sh/@supabase/supabase-js@2'
  ];

  window.PCM_BOOT = window.PCM_BOOT || {};
  window.PCM_BOOT.startedAt = Date.now();
  window.PCM_BOOT.supabasePromise = window.PCM_BOOT.supabasePromise || null;

  function loadSupabase() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      return Promise.resolve(window.supabase);
    }
    if (window.PCM_BOOT.supabasePromise) return window.PCM_BOOT.supabasePromise;

    window.PCM_BOOT.supabasePromise = new Promise((resolve, reject) => {
      let index = 0;

      const next = () => {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          resolve(window.supabase);
          return;
        }
        if (index >= SUPABASE_CLIENT_CDNS.length) {
          reject(new Error('SUPABASE_CLIENT_LOAD_FAILED'));
          return;
        }

        const script = document.createElement('script');
        script.src = SUPABASE_CLIENT_CDNS[index++];
        script.async = false;
        script.onload = () => {
          if (window.supabase && typeof window.supabase.createClient === 'function') resolve(window.supabase);
          else next();
        };
        script.onerror = next;
        document.head.appendChild(script);
      };

      next();
    });

    return window.PCM_BOOT.supabasePromise;
  }

  window.PCM_BOOT.loadSupabase = loadSupabase;

  // Remove service workers/caches left by older versions of this application.
  // This does not touch Supabase, browser data outside this origin, or the database.
  if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(reg => reg.unregister().catch(() => {}));
    }).catch(() => {});
  }
  if (window.caches && caches.keys) {
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))).catch(() => {});
  }

  loadSupabase().catch(err => {
    console.error('[PCM BOOT] Supabase não carregou:', err);
    window.PCM_BOOT.supabaseError = String(err && err.message || err);
  });

  window.addEventListener('error', event => {
    console.error('[PCM BOOT] JavaScript:', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', event => {
    console.error('[PCM BOOT] Promise rejeitada:', event.reason);
  });
})();
