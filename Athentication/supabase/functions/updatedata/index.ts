import updateUserService from "../service/UpdateService.ts";
import { User } from "../model/UserModel.ts";

Deno.serve(async (req) => {
  if (req.method === "PUT") {
    try {
      const url = new URL(req.url);
      const uid = url.searchParams.get('id');

      // Ensure the id is provided and is a valid number
      if (!uid || isNaN(Number(uid))) {
        return new Response(
          JSON.stringify({ error: "Invalid or missing 'id' parameter" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Parse the user data from the request body
      const user: User = await req.json();

      // Call the update service function
      const data = await updateUserService(Number(uid), user);

      // Return the success response
      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      
      return new Response(
        JSON.stringify({ error:"Internalserver error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    // If the method is not PUT, return Method Not Allowed
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }
});
