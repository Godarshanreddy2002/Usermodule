import { UserProfile } from "../../_model/UserModel.ts";
import { getUserProfile, updateProfile } from "../../_repository/_user_repo/UserRepository.ts";
import { USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import ErrorResponse, { SuccessResponse } from "../../_responses/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import { validatingUserId } from "../../_shared/_validation/UserValidate.ts";

/**
 * This method can update user profile by user_id
 * @param req --It is a JSON object Request
 * @param params --parmas contain user_id,user_jwt,user account status,user_type
 * @returns -- It will return Response object in the form of JSON
 */
export default async function updateUserProfile(req: Request, params: Record<string, string>): Promise<Response> {  // Ensure the return type is always Response
    try {
        
        const id = params.id;
        const idavailble = await validatingUserId(id);
        if (idavailble instanceof Response) {
            return idavailble;
        }
        const user_id = params.user_id;
        if (user_id != id && params.user_type != 'A') {
            return ErrorResponse(HTTP_STATUS_CODE.FORBIDDEN, USERMODULE.NOT_ALLOWED)
        }
        const requestBody = await req.json();
        const updateUser: UserProfile = requestBody;

        const {data:user,error:userError}=await getUserProfile(id);

        if(userError)
        {
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} : ${userError}`)
        }
        if(!user)
        {
            return ErrorResponse(HTTP_STATUS_CODE.NOT_FOUND,USERMODULE.USER_NOT_FOUND_)
        }
        if(user)
        {   
            if(params.user_type!='A')
            {
                if(requestBody.user_type!=user.user_type)
                {
                    return ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST,`${USERMODULE.USER_NOT_ALLOWED_TO_CHANGE} 'user type '${user.user_type} to ${requestBody.user_type}`)
                }
                if(requestBody.account_status!=user.account_status)
                {
                    return ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST,`${USERMODULE.USER_NOT_ALLOWED_TO_CHANGE} 'account_ astatus '${user.account_status} to ${requestBody.account_status}'`)
                }
                if(requestBody.rank!=user.rank)
                {
                    return ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST,`${USERMODULE.USER_NOT_ALLOWED_TO_CHANGE} 'account_ astatus '${user.account_status} to ${requestBody.account_status}'`)
                }
            }
            
        }
        updateUser.updated_at = new Date().toISOString();
        console.log("start");

        const {data,error:updateError} = await updateProfile(updateUser, id);
        if(updateError)
        {
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} : ${updateError}`)
        }
        if(!data)
        {
            return ErrorResponse(HTTP_STATUS_CODE.NOT_FOUND,USERMODULE.USER_NOT_FOUND)
        }
        
        return SuccessResponse(USERMODULE.USER_UPDATE_SUCCESS, HTTP_STATUS_CODE.OK);
        
    } catch (error) {
        return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${error}`)        
    }
}


