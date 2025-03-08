import supabase from "../_common/DBConn.ts";

export default async function deleteUserRepo(email: string) {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('email', email).select('email').single(); // Delete based on email

  if (error) {
    console.error("Error during deletion:", error);
    throw new Error("Failed to delete user. Please check the email and try again.");
  }

 
  if (!data) {
    throw new Error(`No user found with the email: ${email}`);
  }

  return { message: "User deleted successfully" }; // Return success message after deletion
}
