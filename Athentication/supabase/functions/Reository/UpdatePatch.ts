import supabase from "../_common/DBConn.ts";
import { User } from "../model/UserModel.ts";


export default async function partialupdate(id: number, user: Partial<User>) {
  try {
   
   
console.log("repositroy")
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id) 
      .select('*'); 
    if (error) {
      console.error("Error during update:", error.message);
      throw new Error(`Failed to update user: ${error.message}`);
    }

  
    if (data.length === 0) {
      throw new Error(`User with id ${id} not found.`);
    }

    return data;
  } catch (error) {
    console.error("Error in partialupdate:", error);
    throw new Error( "An error occurred while updating the user.");
  }
}
