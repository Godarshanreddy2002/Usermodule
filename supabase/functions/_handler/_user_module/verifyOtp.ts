
import { otpVerication } from "../../_repository/_user_repo/AuthRepo.ts";
import { getUser, RegisterUser } from "../../_repository/_user_repo/UserRepository.ts";
import { makeUserLockout } from "../../_repository/_user_repo/UserRepository.ts";
import { USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import ErrorResponse, { SuccessResponse } from "../../_responses/Response.ts";

import { isOtpAvailable, isPhoneAvailable } from "../../_shared/_validation/UserValidate.ts";


/**
 * This method will perform Otp verification by following bellow conditions
 * 1.It will get the user by mobile number if user exists
 * 2.It wiil check the user lockout time
 * 3.If user not in lockout time, then verify the OTP
 * 4.If it is invalid OTP then we will increment failed_login_count or It will make user as lockout
 * 5.If OTP is valid, and returns user id and access token in the form of JSON response
 * 6.if user is new user, then it will create user account with some default values and returns user_id and access token in the form of JSON response
 *  
 * @param req -- Request to verify otp
 * @returns -- It will return JSON Response Object that contains(user_id,access_token)
 */
export default async function verifyOtp(req: Request):Promise<Response> {
try{
    console.error("Verify OTP API started");
    
    const body = await req.json();
   
    const phoneNo: string = body.phoneNo;
    const Otp: string = body.Otp;
    
    const validPhone = isPhoneAvailable(phoneNo)
    if (validPhone instanceof Response)
        return validPhone;
    const validOtp = isOtpAvailable(Otp);
    if (validOtp instanceof Response)
        return validOtp;
    const {data:user,error:userError} = await getUser(phoneNo)
   if(userError)
   {
    return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${userError}`)
   }
    if (user&&user.lockout_time && user.lockout_time > new Date().toISOString())
        return ErrorResponse(HTTP_STATUS_CODE.FORBIDDEN, USERMODULE.USER_LOCKED)

    const { data, error } = await otpVerication(phoneNo, Otp)

    if (error || !data) {
        
        if (user) {
            console.log("User failed count  : ", user.failed_login_count);
            console.log(user.lockout_time);
            (user.failed_login_count < 3) ? ((user.account_status = 'A'), (user.failed_login_count += 1), (user.lockout_time = null)) : ((user.account_status = 'S'), (user.failed_login_count = 0), (user.lockout_time = new Date(new Date().setHours(new Date().getHours() + 1)).toISOString()))
            const {data:_updateUser,error:updateError} = await makeUserLockout(user.user_id, user.lockout_time, user.failed_login_count, user.account_status,);
            if(updateError)
            {
                return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${updateError}`)
            }
            if (user.lockout_time) {
                return ErrorResponse(HTTP_STATUS_CODE.CONFLICT, `${USERMODULE.LOCK_USER} try after ${user.lockout_time}`)
            }
            return ErrorResponse(HTTP_STATUS_CODE.CONFLICT, USERMODULE.INVALID_OTP,);
        }
    }
    if (user) {
        console.log(data);
        
        user.account_status = 'A';
        const {data:_updateUser,error:updateError} = await makeUserLockout(user.user_id, null, 0, user.account_status,);
        if(updateError)
        {
            return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${updateError}`)
        }
        const userId = data.user?.id;
        const access_token = data.session?.access_token;
        if (userId && access_token) {
            return SuccessResponse(USERMODULE.USER_VERIFIED, HTTP_STATUS_CODE.OK,{ userId, access_token })
        }

        return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, USERMODULE.INTERNAL_SERVER_ERROR)

    }

    if (!user) {
        console.log("create user account")
        const userId = data.user?.id;
        const access_token = data.session?.access_token;
        
        if (userId && access_token) {
            const { data: _register, error: registerError } = await RegisterUser(userId, phoneNo)
            if (registerError) {
                console.error("Error in creating user", registerError.message)
                return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, `${USERMODULE.INTERNAL_SERVER_ERROR} :${registerError}`)
            }
            return SuccessResponse(USERMODULE.SENT_OTP_SUCCESS,HTTP_STATUS_CODE.CREATED ,{ userId, access_token })
        }
        

    }
    return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, USERMODULE.INTERNAL_SERVER_ERROR)
}
catch(error)
{
    return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${error}`)
}
   
}


