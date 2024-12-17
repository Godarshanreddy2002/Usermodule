
import ErrorResponse, { SuccessResponse } from "../../_responses/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import { LOGERROR, USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import { addFollowerToUser, CheckFollower, getUserProfile, updateFollowerCount } from "../../_repository/_user_repo/UserRepository.ts";
import { validatingUserId } from "../../_shared/_validation/UserValidate.ts";





export default async function addFollower(_req:Request,params:Record<string,string>) {

    try
    {
        const user_id=params.id;
        const followed_by=params.user_id;
        const idAvailable = await validatingUserId(user_id);
        if (idAvailable instanceof Response) {
            console.error(LOGERROR.INVALID_USER_ID.replace("{userId}", user_id)); 
            return idAvailable;
        }
        const {data:user,error:userError}=await getUserProfile(user_id)
        if(userError)
        {
            console.log("getting user profile error")
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} ${userError.message}`)
        }
        if(!user)
        {
            console.log("gettng user not found")            
            return ErrorResponse(HTTP_STATUS_CODE.NOT_FOUND,USERMODULE.USER_NOT_FOUND)
        }
        console.log("start of checking follower")
        const {data:checkData,error:checkError}=await CheckFollower(user_id,followed_by)
        if(checkError)
        {
            console.log("gettng user profile error")
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR}: ${checkError.message}`)
        }
        if(checkData)
        {
            console.log("user is already followed")
            return ErrorResponse(HTTP_STATUS_CODE.CONFLICT,USERMODULE.USER_ALREADY_FOLLOWED)
        }
        console.log("Add follower")
        const {data:updateData,error:updateError}=await addFollowerToUser(user_id,followed_by);
        if(updateError)
        {
            console.log("Add follower error")
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} ${updateError.message}`)
        }
        if(!updateData)
        {
            console.log("something went wrong in Add follower")
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,USERMODULE.UNABLE_TO_FOLLOW)
        }
        console.log("Add follower success")
        console.log(user.follower_count)
        const followercount:number = user.follower_count+1;
        console.log(followercount);
        const {data:incrementFollowerCount,error:errorInFollowerIncrement}=await updateFollowerCount(user_id,followercount);
        console.log(incrementFollowerCount)
        if(errorInFollowerIncrement)
        {
            console.log("Increment follower count erroe")
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR}: ${errorInFollowerIncrement}`)
        }
        if(!incrementFollowerCount)
        {
            console.log("some thing went wrong in Increment follower count")
            return ErrorResponse(HTTP_STATUS_CODE.NOT_FOUND,USERMODULE.USER_NOT_FOUND)
        }
        console.log("success")
        return SuccessResponse(USERMODULE.USER_fOLLOWED_SUCCESS,HTTP_STATUS_CODE.OK)
            

    }
    catch(error)
    {
        return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} ${error}`)
    }
    
}