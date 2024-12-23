import express from "express";
import { adminController } from "./admin.controller";
import auth from "../../../middlewares/auth";
import { USER_ROLE } from "../user/user.constrants";


const adminRouter = express.Router();

// Block User
adminRouter.patch("/admin/users/:userId/block", auth(USER_ROLE.admin), adminController.blockUser);

// Delete Blog
adminRouter.delete("/admin/blogs/:id", auth(USER_ROLE.admin), adminController.deleteBlog);

export { adminRouter };
