import loginUser from "../service/loginService.ts";

Deno.serve(async (req) => {
  if (req.method == "POST") 
    {
      try {
        const { email, password } = await req.json();
        if(!email&&!password)
        {
          return new Response(
            JSON.stringify({ error: "Email and password are required." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        else if (!email ) {
          return new Response(
            JSON.stringify({ error: "Email is required." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        else if(!password)
        {
          return new Response(
            JSON.stringify({ error: "password is required." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );        
        }      
        const data = await loginUser(email, password);

        return new Response(
          JSON.stringify(data),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
      
        if (error instanceof Error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Catch any unexpected errors
        return new Response(
          JSON.stringify({ error: "An unexpected error occurred." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }
else{
  return new Response(
    JSON.stringify({ error: "Wrong method used. Only POST is allowed." }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
}
});
