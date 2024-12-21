import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest";
import { UserValidation } from "../user/user.validation";
import { AuthControllers } from "./auth.controller";

const authRouter = Router();

authRouter.post('/register',validateRequest(UserValidation.userValidationSchema), AuthControllers.register)

export default authRouter;