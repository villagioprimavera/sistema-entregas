export default {
  async fetch(request, env) {
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
          body: "{}"
        }
      );

      if (!response.ok) {
        const erro = await response.text();

        return new Response(
          `Erro ao consultar Supabase:\n${erro}`,
          {
            status: 500,
            headers: {
              "content-type": "text/plain; charset=UTF-8"
            }
          }
        );
      }

      const total = await response.json();

      return new Response(
        `Sistema conectado!\n\nUnidades cadastradas: ${total}`,
        {
          headers: {
            "content-type": "text/plain; charset=UTF-8"
          }
        }
      );

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
