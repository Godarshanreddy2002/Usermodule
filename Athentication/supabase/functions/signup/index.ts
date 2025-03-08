import { User } from "../model/UserModel.ts";
import registerUser from "../service/SignUpService.ts";

Deno.serve(async (req) => {
  if (req.method === "POST") {
    try {
      const user: User = await req.json();
      const data = await registerUser(user);
      return new Response(
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to register user", details:error }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  else{
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }  
});
