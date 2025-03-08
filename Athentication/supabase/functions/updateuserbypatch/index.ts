import partialupdate from "../Reository/UpdatePatch.ts";
import { User } from "../model/UserModel.ts";


console.log("Hello from Functions!");

Deno.serve(async (req) => {
  if (req.method === 'PATCH') {
    try {
      // Parse query parameters and check for 'id'
      const url = new URL(req.url);
      const uid = url.searchParams.get('id');
      console.log(uid);
     const user:Partial<User> = await req.json();
     console.log(user);

      // Check if 'id' is missing or invalid
      if (!uid || isNaN(Number(uid))) {
        return new Response(
          JSON.stringify({ error: "Invalid or missing 'id' parameter" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      

      // Attempt to partially update the user data
      const data = await partialupdate(Number(uid),user );

      // Return success response with updated data
      return new Response(
        JSON.stringify({message:"Data Updated Successfully",data:data}),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

    } catch (error) {
      // If an error occurs, return a 500 Internal Server Error response
      console.error("Error in PATCH request:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update user data",details:error }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } else {
    
    return new Response(
      JSON.stringify({ error: "This method is not allowed here" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }
});
