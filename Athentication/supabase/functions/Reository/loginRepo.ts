import supabase from "../_common/DBConn.ts";

export default async function checkUser(email: string, password: string) {
  try {
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*') 
      .eq('email', email)
      .single();  // Ensure only one result

    if (error) {
      throw new Error("Invalid username(mail)");
    }

    
    if (!users) {
      throw new Error("Invalid Credentials");
    }

  
    if (password !== users.password) {
      throw new Error("Invalid password.");
    }

   
    const { password: _, ...userData } = users; 
    return userData;

  } catch (error) {    
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred.");
  }
}
