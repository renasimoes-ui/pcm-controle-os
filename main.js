/* =========================================================
   PCM • CONTROLE DE O.S. — MAIN BOOT
   AB Florestas e Madeiras
   Compatível com celular / Vercel / GitHub
   ========================================================= */

(function () {

    'use strict';

    window.PCM_BOOT = window.PCM_BOOT || {};

    /* Evita executar o boot duas vezes */
    if (window.PCM_BOOT.loaded) {
        console.log('[PCM] main.js já foi carregado.');
        return;
    }

    window.PCM_BOOT.loaded = true;
    window.PCM_BOOT.startedAt = Date.now();

    var supabaseLoading = null;

    /* =========================================================
       VERIFICA SE O SUPABASE JÁ ESTÁ DISPONÍVEL
       ========================================================= */

    function supabaseDisponivel() {

        return !!(
            window.supabase &&
            typeof window.supabase.createClient === 'function'
        );

    }


    /* =========================================================
       CARREGAMENTO DO SUPABASE
       ========================================================= */

    window.PCM_BOOT.loadSupabase = function () {

        /* Já carregado */
        if (supabaseDisponivel()) {

            console.log(
                '[PCM] Supabase já estava carregado.'
            );

            return Promise.resolve(window.supabase);
        }


        /* Já existe uma tentativa em andamento */
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


            function tentarProximo() {

                /* Verifica novamente */
                if (supabaseDisponivel()) {

                    console.log(
                        '[PCM] Supabase carregado com sucesso.'
                    );

                    resolve(window.supabase);

                    return;
                }


                /* Acabaram as fontes */
                if (index >= sources.length) {

                    reject(
                        new Error(
                            'Não foi possível carregar o Supabase. Verifique a conexão de internet do celular.'
                        )
                    );

                    return;
                }


                var url = sources[index++];

                console.log(
                    '[PCM] Tentando carregar Supabase:',
                    url
                );


                var script =
                    document.createElement('script');


                script.src = url;

                script.async = true;

                script.defer = true;

                script.crossOrigin = 'anonymous';


                var finalizado = false;


                var timeout =
                    window.setTimeout(function () {

                        if (finalizado) {
                            return;
                        }

                        finalizado = true;

                        console.warn(
                            '[PCM] Timeout ao carregar:',
                            url
                        );

                        tentarProximo();

                    }, 12000);


                /* =================================================
                   CARREGOU
                   ================================================= */

                script.onload = function () {

                    if (finalizado) {
                        return;
                    }

                    finalizado = true;

                    window.clearTimeout(timeout);


                    if (supabaseDisponivel()) {

                        console.log(
                            '[PCM] Supabase carregado:',
                            url
                        );

                        resolve(window.supabase);

                    } else {

                        console.warn(
                            '[PCM] Script carregou, mas Supabase não apareceu.'
                        );

                        tentarProximo();
                    }

                };


                /* =================================================
                   ERRO
                   ================================================= */

                script.onerror = function () {

                    if (finalizado) {
                        return;
                    }

                    finalizado = true;

                    window.clearTimeout(timeout);


                    console.warn(
                        '[PCM] Falha ao carregar:',
                        url
                    );


                    tentarProximo();

                };


                document.head.appendChild(script);

            }


            tentarProximo();

        }).catch(function (erro) {

            /* Permite uma nova tentativa */
            supabaseLoading = null;


            console.error(
                '[PCM] Falha no carregamento do Supabase:',
                erro
            );


            throw erro;

        });


        return supabaseLoading;

    };


    /* =========================================================
       ERROS JAVASCRIPT
       ========================================================= */

    window.addEventListener(
        'error',
        function (event) {

            console.error(
                '[PCM] Erro JavaScript:',
                event.error ||
                event.message ||
                event
            );

        }
    );


    /* =========================================================
       PROMISES COM ERRO
       ========================================================= */

    window.addEventListener(
        'unhandledrejection',
        function (event) {

            console.error(
                '[PCM] Promise rejeitada:',
                event.reason ||
                event
            );

        }
    );


    /* =========================================================
       INFORMAÇÃO DE BOOT
       ========================================================= */

    console.log(
        '[PCM] main.js carregado com sucesso.'
    );

    console.log(
        '[PCM] Boot iniciado em:',
        new Date(window.PCM_BOOT.startedAt)
    );


})();
