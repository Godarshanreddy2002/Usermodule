
import { getUserProfile } from "../../_repository/_user_repo/UserRepository.ts";

import ErrorResponse from "../../_responses/Response.ts";
import { SuccessResponse } from "../../_responses/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import { USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import { validatingUserId } from "../../_shared/_validation/UserValidate.ts";

/**
 * This method can fetch user profile by id
 * @param req --It is request Object 
 * @param params --parmas contain user_id,user_jwt,user account status,user_type
 * @returns --It will return JSON response that contails user profile
 */
export default async function FetchUserProfile(_req: Request,params:Record<string, string>):Promise<Response> {
  
    try {
      
      const user_Id=params.id;
      
      const idavailble=await validatingUserId(user_Id);
        if(idavailble instanceof Response)
        {
            return idavailble;
        }

     const {data:userData,error:userError}=await getUserProfile(user_Id)
     if(userError){
      return ErrorResponse( HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR}, ${userError.message}`);
     }
     if(!userData){
      return ErrorResponse(HTTP_STATUS_CODE.NOT_FOUND,USERMODULE.USER_NOT_FOUND,)
     }
      console.log("UserData is: ",userData)
     return SuccessResponse(USERMODULE.USER_DETAILS,HTTP_STATUS_CODE.OK,userData)



    } catch (error) {
      
     return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${error}`)
    }
 
 
}
