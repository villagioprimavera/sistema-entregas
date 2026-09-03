export default {
  async fetch(request, env) {
    try {

      // =========================================================
      // API - REGISTRAR ENTREGA
      // =========================================================

      if (
        request.method === "POST" &&
        new URL(request.url).pathname === "/api/entrega"
      ) {

        const dados = await request.json();

        const response = await fetch(
          `${env.SUPABASE_URL}/rest/v1/rpc/registrar_entrega`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": env.SUPABASE_PUBLISHABLE_KEY,
              "Authorization": `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({
              p_unidade_id: dados.unidade_id,
              p_entregador_nome: dados.entregador_nome,
              p_entregador_tel: dados.entregador_tel,
              p_transportadora: dados.transportadora
            })
          }
        );

        const resultado = await response.text();

        if (!response.ok) {
          return new Response(
            JSON.stringify({
              sucesso: false,
              erro: resultado
            }),
            {
              status: 400,
              headers: {
                "content-type": "application/json; charset=UTF-8"
              }
            }
          );
        }

        return new Response(
          JSON.stringify({
            sucesso: true,
            dados: JSON.parse(resultado)
          }),
          {
            headers: {
              "content-type": "application/json; charset=UTF-8"
            }
          }
        );
      }


      // =========================================================
      // BUSCAR UNIDADES
      // =========================================================

      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/rpc/get_unidades_disponiveis`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": env.SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`
          },
          body: "{}"
        }
      );

      if (!response.ok) {
        const erro = await response.text();

        return new Response(
          `Erro ao consultar unidades:\n${erro}`,
          {
            status: 500,
            headers: {
              "content-type": "text/plain; charset=UTF-8"
            }
          }
        );
      }

      const unidades = await response.json();


      // =========================================================
      // PREPARAR LISTA DE CASAS
      // =========================================================

      let listaCasas = "";

      for (const unidade of unidades) {

        // Remove "CASA" do número exibido
        // Exemplo: CASA01 -> 01
        let numeroExibido = String(unidade.numero)
          .replace(/^CASA/i, "")
          .trim();

        listaCasas += `
          <div
            class="opcao-casa"
            data-id="${unidade.id}"
            data-numero="${numeroExibido}"
            onclick="selecionarCasa(this)"
          >
            ${numeroExibido}
          </div>
        `;
      }


      // =========================================================
      // PÁGINA
      // =========================================================

      const html = `
<!DOCTYPE html>
<html lang="pt-BR">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Registrar Entrega</title>


  <style>

    * {
      box-sizing: border-box;
    }


    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f3f4f6;
      color: #1f2937;
    }


    .container {
      max-width: 500px;
      margin: 0 auto;
      padding: 24px 16px;
    }


    .card {
      background: white;
      border-radius: 16px;
      padding: 28px 22px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }


    .logo {
      text-align: center;
      font-size: 42px;
      margin-bottom: 8px;
    }


    h1 {
      text-align: center;
      margin: 0 0 8px;
      font-size: 26px;
    }


    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 28px;
    }


    label {
      display: block;
      margin-top: 16px;
      margin-bottom: 6px;
      font-weight: bold;
      font-size: 14px;
    }


    input {
      width: 100%;
      padding: 13px;
      border: 1px solid #d1d5db;
      border-radius: 9px;
      font-size: 16px;
      background: white;
    }


    /* =====================================================
       CAMPO DE BUSCA DA CASA
       ===================================================== */

    .busca-casa {
      position: relative;
    }


    #buscaCasa {
      width: 100%;
    }


    .lista-casas {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: calc(100% + 4px);
      max-height: 240px;
      overflow-y: auto;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 9px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
      z-index: 1000;
    }


    .opcao-casa {
      padding: 14px 16px;
      font-size: 17px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
    }


    .opcao-casa:last-child {
      border-bottom: none;
    }


    .opcao-casa:hover {
      background: #f3f4f6;
    }


    .opcao-casa.selecionada {
      background: #dbeafe;
      font-weight: bold;
    }


    .sem-resultado {
      padding: 14px 16px;
      color: #6b7280;
      text-align: center;
    }


    .button {
      width: 100%;
      margin-top: 24px;
      padding: 15px;
      border: 0;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }


    .button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }


    .mensagem {
      display: none;
      margin-top: 18px;
      padding: 14px;
      border-radius: 10px;
      text-align: center;
      font-size: 14px;
    }


    .sucesso {
      display: block;
      background: #dcfce7;
      color: #166534;
    }


    .erro {
      display: block;
      background: #fee2e2;
      color: #991b1b;
    }


    .info {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }

  </style>

</head>


<body>


  <div class="container">

    <div class="card">


      <div class="logo">📦</div>


      <h1>Registrar entrega</h1>


      <div class="subtitle">
        Condomínio Villagio Primavera
      </div>


      <!-- ===================================================
           CASA / UNIDADE
           =================================================== -->

      <label for="buscaCasa">
        Casa / Unidade
      </label>


      <div class="busca-casa">

        <input
          id="buscaCasa"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          placeholder="Digite o número da casa"
          oninput="buscarCasas()"
          onclick="abrirListaCasas()"
        >


        <input
          id="unidade"
          type="hidden"
        >


        <div
          id="listaCasas"
          class="lista-casas"
        >

          ${listaCasas}

        </div>

      </div>


      <label for="entregador">
        Nome do entregador
      </label>


      <input
        id="entregador"
        type="text"
        placeholder="Digite seu nome"
        autocomplete="name"
      >


      <label for="telefone">
        Telefone
      </label>


      <input
        id="telefone"
        type="tel"
        placeholder="(11) 99999-9999"
        autocomplete="tel"
      >


      <label for="transportadora">
        Transportadora
      </label>


      <input
        id="transportadora"
        type="text"
        placeholder="Ex.: Mercado Livre"
      >


      <button
        id="botao"
        class="button"
        onclick="registrarEntrega()"
      >
        Solicitar abertura da caixa
      </button>


      <div
        id="mensagem"
        class="mensagem"
      ></div>


      <div class="info">
        Preencha os dados para registrar a entrega.
      </div>


    </div>

  </div>


  <script>


    // =========================================================
    // ABRIR LISTA DE CASAS
    // =========================================================

    function abrirListaCasas() {

      const lista =
        document.getElementById("listaCasas");

      lista.style.display = "block";

      buscarCasas();
    }


    // =========================================================
    // BUSCAR CASAS
    // =========================================================

    function buscarCasas() {

      const busca =
        document
          .getElementById("buscaCasa")
          .value
          .trim()
          .toLowerCase();


      const lista =
        document.getElementById("listaCasas");


      const opcoes =
        lista.querySelectorAll(".opcao-casa");


      let encontrou = false;


      opcoes.forEach(opcao => {

        const numero =
          opcao
            .dataset
            .numero
            .toLowerCase();


        if (
          busca === "" ||
          numero.includes(busca)
        ) {

          opcao.style.display = "block";

          encontrou = true;

        } else {

          opcao.style.display = "none";

        }

      });


      // Remove mensagem anterior

      const mensagem =
        lista.querySelector(".sem-resultado");

      if (mensagem) {
        mensagem.remove();
      }


      // Nenhuma casa encontrada

      if (!encontrou) {

        const semResultado =
          document.createElement("div");

        semResultado.className =
          "sem-resultado";

        semResultado.textContent =
          "Nenhuma casa encontrada.";

        lista.appendChild(
          semResultado
        );
      }


      lista.style.display = "block";
    }


    // =========================================================
    // SELECIONAR CASA
    // =========================================================

    function selecionarCasa(opcao) {

      const id =
        opcao.dataset.id;

      const numero =
        opcao.dataset.numero;


      document
        .getElementById("unidade")
        .value = id;


      document
        .getElementById("buscaCasa")
        .value = numero;


      const opcoes =
        document.querySelectorAll(
          ".opcao-casa"
        );


      opcoes.forEach(item => {
        item.classList.remove(
          "selecionada"
        );
      });


      opcao.classList.add(
        "selecionada"
      );


      document
        .getElementById("listaCasas")
        .style.display = "none";
    }


    // =========================================================
    // FECHAR LISTA AO CLICAR FORA
    // =========================================================

    document.addEventListener(
      "click",
      function(event) {

        const campo =
          document.querySelector(
            ".busca-casa"
          );


        if (
          campo &&
          !campo.contains(event.target)
        ) {

          document
            .getElementById("listaCasas")
            .style.display = "none";

        }

      }
    );


    // =========================================================
    // REGISTRAR ENTREGA
    // =========================================================

    async function registrarEntrega() {


      const unidade =
        document
          .getElementById("unidade")
          .value;


      const numeroCasa =
        document
          .getElementById("buscaCasa")
          .value
          .trim();


      const entregador =
        document
          .getElementById("entregador")
          .value
          .trim();


      const telefone =
        document
          .getElementById("telefone")
          .value
          .trim();


      const transportadora =
        document
          .getElementById("transportadora")
          .value
          .trim();


      const botao =
        document
          .getElementById("botao");


      const mensagem =
        document
          .getElementById("mensagem");


      mensagem.className =
        "mensagem";

      mensagem.textContent = "";


      // =====================================================
      // VALIDAÇÃO
      // =====================================================

      if (!unidade) {

        mensagem.className =
          "mensagem erro";

        mensagem.textContent =
          "Selecione uma casa na lista.";

        return;
      }


      if (!numeroCasa) {

        mensagem.className =
          "mensagem erro";

        mensagem.textContent =
          "Informe o número da casa.";

        return;
      }


      if (!entregador) {

        mensagem.className =
          "mensagem erro";

        mensagem.textContent =
          "Informe o nome do entregador.";

        return;
      }


      if (!telefone) {

        mensagem.className =
          "mensagem erro";

        mensagem.textContent =
          "Informe o telefone.";

        return;
      }


      // =====================================================
      // BLOQUEIA BOTÃO
      // =====================================================

      botao.disabled = true;

      botao.textContent =
        "Registrando entrega...";


      try {


        const response =
          await fetch(
            "/api/entrega",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({

                  unidade_id:
                    Number(unidade),

                  entregador_nome:
                    entregador,

                  entregador_tel:
                    telefone,

                  transportadora:
                    transportadora

                })
            }
          );


        const resultado =
          await response.json();


        if (
          !response.ok ||
          !resultado.sucesso
        ) {

          let erro =
            resultado.erro ||
            "Não foi possível registrar a entrega.";


          try {

            erro =
              JSON.parse(erro).message ||
              erro;

          } catch (_) {}


          throw new Error(erro);
        }


        const entrega =
          resultado.dados[0];


        mensagem.className =
          "mensagem sucesso";


        mensagem.innerHTML =
          "✅ Entrega registrada!<br><br>" +

          "Casa: <strong>" +
          entrega.unidade_numero +
          "</strong><br>" +

          "Entrega nº: <strong>" +
          entrega.entrega_id +
          "</strong><br><br>" +

          "Aguarde a abertura da caixa.";


        botao.textContent =
          "Entrega registrada";


      } catch (erro) {


        mensagem.className =
          "mensagem erro";


        mensagem.textContent =
          erro.message;


        botao.disabled = false;


        botao.textContent =
          "Solicitar abertura da caixa";

      }

    }

  </script>


</body>

</html>
`;


      return new Response(
        html,
        {
          headers: {
            "content-type":
              "text/html; charset=UTF-8"
          }
        }
      );


    } catch (erro) {

      return new Response(
        `Erro de conexão: ${erro.message}`,
        {
          status: 500,
          headers: {
            "content-type":
              "text/plain; charset=UTF-8"
          }
        }
      );

    }
  }
};
