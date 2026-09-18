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

        /* Se já estiver carregado, não carrega novamente */
        if (
            window.supabase &&
            typeof window.supabase.createClient === 'function'
        ) {
            return Promise.resolve(window.supabase);
        }

        /* Se já existe uma tentativa, reutiliza */
        if (supabaseLoading) {
            return supabaseLoading;
        }

        supabaseLoading = new Promise(function (resolve, reject) {

            var sources = [
                'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
                'https://unpkg.com/@supabase/supabase-js@2'
            ];

            var index = 0;

            function tentarProximo() {

                /* Verifica se carregou */
                if (
                    window.supabase &&
                    typeof window.supabase.createClient === 'function'
                ) {
                    resolve(window.supabase);
                    return;
                }

                /* Não há mais opções */
                if (index >= sources.length) {
                    reject(
                        new Error(
                            'Não foi possível carregar a conexão com o sistema. Verifique a internet e tente novamente.'
                        )
                    );
                    return;
                }

                var script = document.createElement('script');

                script.src = sources[index++];
                script.async = true;

                var finalizado = false;

                var timeout = setTimeout(function () {

                    if (finalizado) {
                        return;
                    }

                    finalizado = true;

                    tentarProximo();

                }, 10000);

                script.onload = function () {

                    if (finalizado) {
                        return;
                    }

                    finalizado = true;

                    clearTimeout(timeout);

                    if (
                        window.supabase &&
                        typeof window.supabase.createClient === 'function'
                    ) {
                        resolve(window.supabase);
                    } else {
                        tentarProximo();
                    }
                };

                script.onerror = function () {

                    if (finalizado) {
                        return;
                    }

                    finalizado = true;

                    clearTimeout(timeout);

                    tentarProximo();
                };

                document.head.appendChild(script);
            }

            tentarProximo();

        }).catch(function (erro) {

            supabaseLoading = null;

            throw erro;
        });

        return supabaseLoading;
    };

    /* Captura erros sem impedir o sistema de abrir */
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
