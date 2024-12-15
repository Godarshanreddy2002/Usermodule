import { updateUserStatus } from "../../_repository/_user_repo/UserRepository.ts";
import ErrorResponse, { SuccessResponse } from "../../_responses/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/_constants/HttpStatusCodes.ts";
import { USERMODULE } from "../../_shared/_messages/userModuleMessages.ts";
import { validateAccountStatus, validatingUserId } from "../../_shared/_validation/UserValidate.ts";



export async function ActivateOrDeactivateUser(req: Request, params: Record<string, string>): Promise<Response> {
  try {
    const id = params.id;
    
    const body = await req.json(); // Parse the body of the request
    const { account_status } = body; // Destructure account_status from the parsed body
    
    
    const isvalidAccountStatus = await validateAccountStatus(account_status)
    if (isvalidAccountStatus instanceof Response) {
      return isvalidAccountStatus
    }
    const idavailble = await validatingUserId(id);
    if (idavailble instanceof Response) {
      return idavailble;
    }
    if (id != params.user_id && params.user_type != 'A') {
      return ErrorResponse(HTTP_STATUS_CODE.FORBIDDEN, USERMODULE.NOT_ALLOWED)
    }
    console.log("start of deactivate");

    const {data,error:updateError} = await updateUserStatus(id,account_status);
    if(updateError)
    {
      return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,`${USERMODULE.INTERNAL_SERVER_ERROR} : ${updateError}`)
    }
    if(!data)
    {
      return ErrorResponse(HTTP_STATUS_CODE.NOT_FOUND,USERMODULE.USER_NOT_FOUND_)
    }
    return SuccessResponse(`${USERMODULE.USER_STATUS_SET_TO_BE} :${account_status}`,HTTP_STATUS_CODE.OK)
  }
  catch (error) {
    return ErrorResponse(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, `${error}`)
  }
}
