import { sendOtp } from "../../_repository/_user_repo/AuthRepo.ts";
import { USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import { SuccessResponse } from "../../_responses/Response.ts";
import ErrorResponse from "../../_responses/Response.ts";
import { getUser } from "../../_repository/_user_repo/UserRepository.ts";
import { isPhoneAvailable } from "../../_shared/_validation/UserValidate.ts";
/**
 * This function sends OTP to user by checking following conditions
 * 1.It will check user is already present or not
 * 2.If user is present ,then it will check user is in lockout or not
 * 3.If user in lockout, then it will return error response
 * 4.If user is not in lockout time it will send otp
 * 5.If the user is new user, It will directly sends OTP to corresponding phone number
 * @param req --It is request in the form  of JSON 
 * @returns -- It will return resonse object
 */
export default async function signInWithOtp(req: Request):Promise<Response> {

  
    try{
      const body = await req.json();

  const phoneNo = body.phoneNo;
  // This method checks the phone number is available or not
  const phoneNoIsnotThere = isPhoneAvailable(phoneNo);

  if (phoneNoIsnotThere instanceof Response) {
        return phoneNoIsnotThere;
  }

  const {data:user,error:userError} = await getUser(phoneNo); //getting user with phone number
  if(userError)
  {
    return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${userError}`)
  }
  if (user) {

    const currentTime = new Date().toISOString();

    if (user.lockout_time && user.lockout_time > currentTime) {
      return ErrorResponse(HTTP_STATUS_CODE.FORBIDDEN, `${USERMODULE.ACCOUNT_DEACTIVATED} Try after ${user.lockout_time}`)
    }
  }

  const { data: _data, error } = await sendOtp(phoneNo);
  if (error) {

    return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, `${error}`,);
  } else {
    return SuccessResponse(USERMODULE.SENT_OTP_SUCCESS, HTTP_STATUS_CODE.OK);
  }
    }
    catch(error)
    {
      return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${error}`)
    }

  

}

//TODO maximum otp requests for within 5 mins = 3
// if exceeds 3 lock for 15 mins
//maximum otp request per day for per user 15