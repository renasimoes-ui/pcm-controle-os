/* =========================================================
   PCM • CONTROLE DE O.S. — MAIN BOOT
   AB Florestas e Madeiras

   Este arquivo NÃO cria banco, NÃO altera tabelas
   e NÃO faz chamadas ao Supabase.
   O index.html controla a aplicação.
   ========================================================= */

(function () {
    'use strict';

    // Marca que o arquivo foi carregado corretamente.
    window.PCM_BOOT = window.PCM_BOOT || {};

    window.PCM_BOOT.loaded = true;
    window.PCM_BOOT.startedAt = Date.now();

    /*
     * Não carregar Supabase aqui.
     *
     * O próprio index.html já possui a rotina de conexão.
     * Assim evitamos duas inicializações simultâneas,
     * problemas de CDN e falhas no carregamento do celular.
     */

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
