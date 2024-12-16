
import ErrorResponse, { SuccessResponse } from "../../_responses/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import { LOGERROR, USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import { addFollowerToUser, CheckFollower } from "../../_repository/_user_repo/UserRepository.ts";
import { validatingUserId } from "../../_shared/_validation/UserValidate.ts";




export default async function addFollower(req:Request,params:Record<string,string>) {

    try
    {
        const user_id=params.id;
        const followed_by=params.user_id;
        const idAvailable = await validatingUserId(user_id);
        if (idAvailable instanceof Response) {
            console.error(LOGERROR.INVALID_USER_ID.replace("{userId}", user_id)); 
            return idAvailable;
        }
        const {data:checkData,error:checkError}=await CheckFollower(user_id,followed_by)
        if(checkError)
        {
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} ${checkError.message}`)
        }
        if(checkData)
        {
            return SuccessResponse(USERMODULE.USER_ALREADY_FOLLOWED,HTTP_STATUS_CODE.OK)
        }
        const {data:updateData,error:updateError}=await addFollowerToUser(user_id,followed_by);
        if(updateError)
        {
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} ${updateError.message}`)
        }
        if(!updateData)
        {
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,USERMODULE.UNABLE_TO_FOLLOW)
        }
        return SuccessResponse(USERMODULE.USER_fOLLOWED_SUCCESS,HTTP_STATUS_CODE.OK)
            

    }
    catch(error)
    {
        return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} ${error}`)
    }
    
}