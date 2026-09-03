export default {
  async fetch(request, env) {
    return new Response(
      JSON.stringify({
        supabase_url: env.SUPABASE_URL || "NAO_DEFINIDA",
        supabase_key: env.SUPABASE_PUBLISHABLE_KEY
          ? "DEFINIDA"
          : "NAO_DEFINIDA"
      }, null, 2),
      {
        headers: {
          "content-type": "application/json; charset=UTF-8"
        }
      }
    );
  }
};
