export default {
  async fetch(request, env) {
    try {
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

      let lista = "";

      for (const unidade of unidades) {
        lista += `
          <option value="${unidade.id}">
            ${unidade.numero}${unidade.bloco ? " - " + unidade.bloco : ""}
          </option>
        `;
      }

      const html = `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

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

    input,
    select {
      width: 100%;
      padding: 13px;
      border: 1px solid #d1d5db;
      border-radius: 9px;
      font-size: 16px;
      background: white;
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

      <label for="unidade">
        Casa / Unidade
      </label>

      <select id="unidade">
        <option value="">
          Selecione a casa
        </option>

        ${lista}

      </select>

      <label for="entregador">
        Nome do entregador
      </label>

      <input
        id="entregador"
        type="text"
        placeholder="Digite seu nome"
      >

      <label for="telefone">
        Telefone
      </label>

      <input
        id="telefone"
        type="tel"
        placeholder="(11) 99999-9999"
      >

      <label for="transportadora">
        Transportadora
      </label>

      <input
        id="transportadora"
        type="text"
        placeholder="Ex.: Mercado Livre"
      >

      <button class="button">
        Solicitar abertura da caixa
      </button>

      <div class="info">
        Preencha os dados para registrar a entrega.
      </div>

    </div>

  </div>

</body>
</html>
`;

      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=UTF-8"
        }
      });

    } catch (erro) {

      return new Response(
        `Erro de conexão: ${erro.message}`,
        {
          status: 500,
          headers: {
            "content-type": "text/plain; charset=UTF-8"
          }
        }
      );
    }
  }
};
