import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";



const register = catchAsync(async(req: Request, res: Response)=> {
    const result = await AuthService.register(req.body);

    sendResponse(res,{
        statusCode: StatusCodes.CREATED,
        status: true,
        message: "User rgistered successfully",
        data: result 
    })
})

export const AuthControllers = {
    register
}