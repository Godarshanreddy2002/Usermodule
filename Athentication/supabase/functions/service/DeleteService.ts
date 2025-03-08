import deleteUserRepo from "../Reository/DeleteUser.ts";

export default async function deleteServicefun(email: string) {
  try {
    
    const result = await deleteUserRepo(email);
  
    return { message: "User deleted successfully" };
  } 
  catch (error) {
   
    console.error("Error deleting user with email:", email, error);   
    
      throw new Error("Email is not available");
    
  }
}
