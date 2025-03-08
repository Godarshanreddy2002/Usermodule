  // Follow this setup guide to integrate the Deno language server with your editor:
  // https://deno.land/manual/getting_started/setup_your_environment
  // This enables autocomplete, go to definition, etc.

  // Setup type definitions for built-in Supabase Runtime APIs
  // import { createClient } from "npm:@supabase/supabase-js"

  import getDataService from "../service/GetDataService.ts";

  Deno.serve(async (req) => {
    try {
      if (req.method === 'GET') {
        const url = new URL(req.url);
        const userId1 = url.searchParams.get('id');
        
        
        if (userId1 === null || isNaN(Number(userId1))) {
          return new Response(
            JSON.stringify({ error: 'Invalid or missing user ID' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        
        const userId = Number(userId1);


        const data = await getDataService(userId);
        
        
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
      }else
      {
        return new Response(JSON.stringify({ error: "method not allowed here" }),
  { status: 405,
    headers: { "Content-Type": "application/json" } });
      }
      
    } catch (error) {
      
      if (error instanceof Error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

return new Response(JSON.stringify({ error: "method not allowed here" }),
  { status: 405,
    headers: { "Content-Type": "application/json" } });

  })


