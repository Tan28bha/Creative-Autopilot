import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const token = Deno.env.get("REPLICATE_API_TOKEN");

  try {
    const res = await fetch("https://api.replicate.com/v1/models", {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    const text = await res.text();

    return new Response(
      JSON.stringify({
        status: res.status,
        body: text.slice(0, 200),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: String(e),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      }
    );
  }
});
