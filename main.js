/* PCM Controle de O.S. — bootstrap
   Arquivo auxiliar do projeto atual.
   Não altera Supabase, tabelas ou dados.
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
  window.PCM_BOOT.supabasePromise =
    window.PCM_BOOT.supabasePromise || null;

  function loadSupabase() {
    if (
      window.supabase &&
      typeof window.supabase.createClient === 'function'
    ) {
      return Promise.resolve(window.supabase);
    }

    if (window.PCM_BOOT.supabasePromise) {
      return window.PCM_BOOT.supabasePromise;
    }

    window.PCM_BOOT.supabasePromise = new Promise((resolve, reject) => {
      let index = 0;

      function next() {
        if (
          window.supabase &&
          typeof window.supabase.createClient === 'function'
        ) {
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

        script.onload = function () {
          if (
            window.supabase &&
            typeof window.supabase.createClient === 'function'
          ) {
            resolve(window.supabase);
          } else {
            next();
          }
        };

        script.onerror = function () {
          next();
        };

        document.head.appendChild(script);
      }

      next();
    });

    return window.PCM_BOOT.supabasePromise;
  }

  window.PCM_BOOT.loadSupabase = loadSupabase;

  window.addEventListener('error', function (event) {
    console.error(
      '[PCM BOOT] JavaScript:',
      event.error || event.message
    );
  });

  window.addEventListener(
    'unhandledrejection',
    function (event) {
      console.error(
        '[PCM BOOT] Promise rejeitada:',
        event.reason
      );
    }
  );

  /*
   * Não bloqueia a abertura do aplicativo.
   * O Supabase é carregado em segundo plano.
   */
  loadSupabase().catch(function (error) {
    console.error(
      '[PCM BOOT] Supabase não carregou:',
      error
    );

    window.PCM_BOOT.supabaseError =
      String(
        error &&
        error.message
          ? error.message
          : error
      );
  });
})();
