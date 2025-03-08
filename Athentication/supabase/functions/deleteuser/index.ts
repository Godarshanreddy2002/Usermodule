import deleteServicefun from "../service/DeleteService.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  if (req.method === 'DELETE') {
    try {
      const url = new URL(req.url);
      const mail: string = url.searchParams.get('email') || '';

     
      if (!mail) {
        return new Response(
          JSON.stringify({ error: "Email parameter is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const data = await deleteServicefun(mail);

     
      return new Response(
        JSON.stringify({ message: "User deleted successfully", data }),
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
      );}
  } else {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }
});
