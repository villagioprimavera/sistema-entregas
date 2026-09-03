export default {
  async fetch(request, env, ctx) {
    try {
      const response = await fetch(
        `${env.SUPABASE_URL}/rest/v1/rpc/get_unidades_count`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": env.SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({})
        }
      );

      if (!response.ok) {
        const erro = await response.text();

        return new Response(
          `Erro ao consultar Supabase: ${erro}`,
          {
            status: 500,
            headers: {
              "content-type": "text/plain; charset=UTF-8"
            }
          }
        );
      }

      const total = await response.json();

      const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Sistema de Entregas</title>

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
      margin-bottom: 24px;
    }

    .status {
      background: #ecfdf5;
      color: #047857;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .contador {
      background: #eff6ff;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
    }

    .numero {
      font-size: 38px;
      font-weight: bold;
      color: #2563eb;
    }

    .texto {
      margin-top: 5px;
      color: #6b7280;
      font-size: 14px;
    }

    .button {
      display: block;
      width: 100%;
      padding: 15px;
      border: 0;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      font-size: 16px;
      font-weight: bold;
    }

    .info {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="card">

      <div class="logo">📦</div>

      <h1>Sistema de Entregas</h1>

      <div class="subtitle">
        Condomínio Villagio Primavera
      </div>

      <div class="status">
        ● Sistema online
      </div>

      <div class="contador">
        <div class="numero">${total}</div>
        <div class="texto">
          unidades cadastradas
        </div>
      </div>

      <button class="button">
        Registrar uma entrega
      </button>

      <div class="info">
        Acesso destinado aos entregadores do condomínio.
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
