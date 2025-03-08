import insertUser from "../Reository/SignUpRepo.ts";
import { User } from "../model/UserModel.ts";
// import { ValidationError } from "../handler/errorHandling.ts";

// Function to handle the registration process
export default async function registerUser(user: User) {
    if (!user.name || !user.email || !user.password || !user.whatsapp_number) {
        throw new Error("Required field missing")
      }
    return await insertUser(user);
}
