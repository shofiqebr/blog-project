import express from "express";
import auth from "../../../middlewares/auth";
import { blogController } from "./blog.controller";
import { USER_ROLE } from "../user/user.constrants";


const blogRouter = express.Router();

// Route to create a blog
blogRouter.post("/blogs", auth(USER_ROLE.admin, USER_ROLE.user), blogController.createBlog);

export default blogRouter;
