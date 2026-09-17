/* =========================================================
   PCM • CONTROLE DE O.S. — MAIN BOOT
   AB Florestas e Madeiras

   Este arquivo NÃO cria banco e NÃO altera tabelas.
   Ele apenas disponibiliza o carregamento do Supabase
   para o index.html quando necessário.
   ========================================================= */

(function () {
    'use strict';

    // =========================================================
    // INICIALIZAÇÃO
    // =========================================================

    window.PCM_BOOT = window.PCM_BOOT || {};

    window.PCM_BOOT.loaded = true;
    window.PCM_BOOT.startedAt = Date.now();

    // =========================================================
    // CARREGAMENTO DO SUPABASE
    // =========================================================

    var supabaseLoading = null;

    window.PCM_BOOT.loadSupabase = function () {

        // Se o Supabase já estiver carregado,
        // não carrega novamente.
        if (
            window.supabase &&
            typeof window.supabase.createClient === 'function'
        ) {
            return Promise.resolve(window.supabase);
        }

        // Se já existe um carregamento acontecendo,
        // reutiliza a mesma Promise.
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

                // Verifica novamente se carregou.
                if (
                    window.supabase &&
                    typeof window.supabase.createClient === 'function'
                ) {
                    resolve(window.supabase);
                    return;
                }

                // Acabaram as opções.
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

            // Permite tentar novamente caso a primeira tentativa falhe.
            supabaseLoading = null;

            throw error;
        });

        return supabaseLoading;
    };

    // =========================================================
    // TRATAMENTO DE ERROS
    // =========================================================

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

    // =========================================================
    // CONFIRMAÇÃO DE CARREGAMENTO
    // =========================================================

    console.log('[PCM] main.js carregado com sucesso.');

})();
