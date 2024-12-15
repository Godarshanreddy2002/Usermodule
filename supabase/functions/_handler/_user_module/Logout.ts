import { logout} from "../../_repository/_user_repo/AuthRepo.ts";
import { USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import { SuccessResponse } from "../../_responses/Response.ts";
import ErrorResponse from "../../_responses/Response.ts";
/**
 * This method is used to logout user from current session
 * @param req -- request
 * @param params -- parmas contain user_id,user_jwt,user account status,user_type
 * @returns -- It will return response object
 */
export default async function logoutUser(_req:Request,params:Record<string,string>) {
   try{
    const token =params.token;
    const scope=params.scope;
    const scopes:string[]=['local','global']
    if(!scopes.includes(scope))
    {
        return ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST,USERMODULE.ALLOWED_USER_SCOPES)
    }
    console.log(token);
    const { data:data,error } = await logout(token,scope);
    if(!data&&!error)
    {
        return ErrorResponse(HTTP_STATUS_CODE.BAD_REQUEST,USERMODULE.INTERNAL_SERVER_ERROR)
    }
    if (error) {
        console.log("not able to log out");
        return ErrorResponse( HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,USERMODULE.USER_LOGOUT_ERROR,);
    } else {
        return SuccessResponse(USERMODULE.USER_LOGOUT_SUCCESS,HTTP_STATUS_CODE.OK);
    }
   }
   catch(error)
   {
    return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${error}`)
   }
    
}
