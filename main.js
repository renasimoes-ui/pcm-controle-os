/* =========================================================
   PCM • CONTROLE DE O.S. — MAIN BOOT
   AB Florestas e Madeiras
   ========================================================= */

(function () {
    'use strict';

    window.PCM_BOOT = window.PCM_BOOT || {};

    window.PCM_BOOT.loaded = true;
    window.PCM_BOOT.startedAt = Date.now();

    var supabaseLoading = null;

    window.PCM_BOOT.loadSupabase = function () {

        if (
            window.supabase &&
            typeof window.supabase.createClient === 'function'
        ) {
            return Promise.resolve(window.supabase);
        }

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

                if (
                    window.supabase &&
                    typeof window.supabase.createClient === 'function'
                ) {
                    resolve(window.supabase);
                    return;
                }

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

                script.onload = function () {

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
                    tryNext();
                };

                document.head.appendChild(script);
            }

            tryNext();

        }).catch(function (error) {

            supabaseLoading = null;

            throw error;
        });

        return supabaseLoading;
    };

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
