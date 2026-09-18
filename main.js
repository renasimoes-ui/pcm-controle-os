/* =========================================================
   PCM • CONTROLE DE O.S. — MAIN BOOT
   AB Florestas e Madeiras
   Compatível com celular / Vercel
   ========================================================= */

(function () {
    'use strict';

    window.PCM_BOOT = window.PCM_BOOT || {};

    window.PCM_BOOT.loaded = true;
    window.PCM_BOOT.startedAt = Date.now();

    var supabaseLoading = null;

    window.PCM_BOOT.loadSupabase = function () {

        /* Se o Supabase já estiver carregado, não carrega novamente */
        if (
            window.supabase &&
            typeof window.supabase.createClient === 'function'
        ) {
            return Promise.resolve(window.supabase);
        }

        /* Se já existe uma tentativa em andamento,
           reaproveita a mesma */
        if (supabaseLoading) {
            return supabaseLoading;
        }

        supabaseLoading = new Promise(function (resolve, reject) {

            var sources = [
                'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
                'https://unpkg.com/@supabase/supabase-js@2',
                'https://esm.sh/@supabase/supabase-js@2'
            ];

            var index = 0;

            function tryNext() {

                /* Verifica novamente antes de tentar outro CDN */
                if (
                    window.supabase &&
                    typeof window.supabase.createClient === 'function'
                ) {
                    resolve(window.supabase);
                    return;
                }

                /* Acabaram as fontes */
                if (index >= sources.length) {
                    reject(
                        new Error(
                            'Não foi possível carregar a conexão do sistema. Verifique a internet e tente novamente.'
                        )
                    );
                    return;
                }

                var script = document.createElement('script');

                script.async = true;
                script.src = sources[index++];

                var finished = false;

                /* Tempo máximo para cada CDN.
                   Isso evita ficar travado no celular */
                var timeout = setTimeout(function () {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    tryNext();

                }, 12000);

                script.onload = function () {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    clearTimeout(timeout);

                    if (
                        window.supabase &&
                        typeof window.supabase.createClient === 'function'
                    ) {
                        resolve(window.supabase);
                    } else {
                        tryNext();
                    }

                };

                script.onerror = function () {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    clearTimeout(timeout);

                    tryNext();

                };

                document.head.appendChild(script);
            }

            tryNext();

        }).catch(function (error) {

            /* Permite uma nova tentativa caso a conexão falhe */
            supabaseLoading = null;

            throw error;
        });

        return supabaseLoading;
    };


    /* =========================================================
       CAPTURA DE ERROS
       ========================================================= */

    window.addEventListener('error', function (event) {

        console.error(
            '[PCM] Erro JavaScript:',
            event.error || event.message || event
        );

    });


    window.addEventListener('unhandledrejection', function (event) {

        console.error(
            '[PCM] Promise rejeitada:',
            event.reason || event
        );

    });


    console.log('[PCM] main.js carregado com sucesso.');

})();
