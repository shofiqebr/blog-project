import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../app/modules/user/user.interface";
import catchAsync from "../utils/catchAsync";
import jwt,{ JwtPayload } from "jsonwebtoken";
import User from "../app/modules/user/user.model";


const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async ( req: Request, res: Response, next: NextFunction)=> {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if(!token) {
            throw new Error ( 'You are not authorized! ')
        }
        const decoded = jwt.verify(
            token,
            "secret",
        ) as JwtPayload

        // console.log({decoded})

        const { role, email} = decoded;

        const user = await User.findOne({ email })

        if (!user) {
            throw new Error ('This is not found ! ')
        }

       

        if ( user?.isBlocked){
            throw new Error(
                "You are not authorized"
            )
        }

        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new Error(
              'You are not authorized',
            );
          }

        req.user =  {
            _id: user._id.toString(),
            role: user.role,
            email: user.email,
          } as JwtPayload;
        next();
    } )
}

export default auth