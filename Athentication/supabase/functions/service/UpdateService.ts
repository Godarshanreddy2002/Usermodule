import { User } from "../model/UserModel.ts";
import updateUserData from "../Reository/UpdateRepo.ts";

export default async function updateUserService(id: number, user: User): Promise<{ message: string }> {
  try {
    // Await the result of updateUserData to ensure the update operation completes
    const result = await updateUserData(id, user);

    // Return the success message
    return { message: "User updated successfully" };
  } catch (error) {
    // If there's an error, return a meaningful error message
    console.error("Error in updating user:", error);
    return { message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}
