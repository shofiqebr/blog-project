import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../app/modules/user/user.interface";
import catchAsync from "../utils/catchAsync";
import jwt,{ JwtPayload } from "jsonwebtoken";
import User from "../app/modules/user/user.model";


const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async ( req: Request, res: Response, next: NextFunction)=> {
        if(!token) {
            throw new Error ( 'You are not authorized! ')
        }
        const decoded = jwt.verify(
            token,
            "secret",
        ) as JwtPayload

        console.log({decoded})

        const { role, email} = decoded;

        const user = await User.findOne({ email })

        if (!user) {
            throw new Error ('This is not found ! ')
        }

        const userStatus = user?.isBlocked

        if (userStatus){
            throw new Error(
                "You are not authorized"
            )
        }
        req.user = decoded as JwtPayload;
        next();
    } )
}

export default auth