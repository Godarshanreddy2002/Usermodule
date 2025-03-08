


export class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = message;
    }
  }
  
  
  export class DatabaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "User with this email or WhatsApp number already exists";
    }
  }
  
  
  export function handleError(error: Error): Response {
    
    console.error(error);
  
    
    if (error instanceof ValidationError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  
    
    if (error instanceof DatabaseError) {
      return new Response(
        JSON.stringify({ error: "Database error", details: error.message }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
  
    // Handle Syntax Errors (e.g., invalid JSON)
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  
    // Handle Generic Errors (unknown server errors)
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  