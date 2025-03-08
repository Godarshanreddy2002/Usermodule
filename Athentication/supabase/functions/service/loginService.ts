import checkUser from "../Reository/loginRepo.ts";

export default async function loginUser(email: string, password: string) {
  try 
  {
    
    const user = await checkUser(email, password);    
    return { message: "Login successful" };
  } 
  catch (error) 
  {
    
    if (error instanceof Error) {
      throw new Error(error.message); 
    }

    
    throw new Error("An unexpected error occurred during login.");
  }
}