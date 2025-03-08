import supabase from "../_common/DBConn.ts";
import { User } from "../model/UserModel.ts";
import { DatabaseError } from "../handler/errorHandling.ts";


export default async function insertUser(user: User) {
  console.log(" Function to insert user data into the database")
  try {

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: user.name,
          email: user.email,
          password: user.password, 
          whatsapp_number: user.whatsapp_number,
        },
      ])
      .single(); 
    if (error) {
      
      if (error.code === "23505") { 
        throw new DatabaseError("User or what app number is already exit");
      }

      throw error;
    }

    return {message:"successfully inserted"};
    
  } catch (error) {
    throw error; 
  }
}



