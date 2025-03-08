import supabase from '../_common/DBConn.ts';
import { User } from '../model/UserModel.ts';

interface UpdateUserResponse {
  message: string;
}

export default async function updateUserData(id: number, userData: User): Promise<UpdateUserResponse> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update(userData)  // Update the user data
      .eq('id', id)       // Match the user by ID
      .select('*')        // Select all fields of the updated user
      .single();          // Ensure only one user is returned

    // Handle error from Supabase (e.g., if the ID does not exist)
    if (error) {
      // Check for a specific error indicating that no user was found
      if (error.code === 'PGRST116') { // No matching rows found
        throw new Error(`No user found with ID ${id}`);
      }
      // Generic database error handling
      throw new Error(`Database error: ${error.message}`);
    }

    // If user is null or undefined, the ID might not exist
    if (!user) {
      throw new Error(`User with ID ${id} does not exist`);
    }

    return { message: "User updated successfully" };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error updating user:", error);

    // Return a custom error message
    throw new Error(`Failed to update user:`);
  }
}
