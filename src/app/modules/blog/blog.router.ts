import express from "express";
import auth from "../../../middlewares/auth";
import { blogController } from "./blog.controller";
import { USER_ROLE } from "../user/user.constrants";


const blogRouter = express.Router();

// Route to create a blog
blogRouter.post("/blogs", auth(USER_ROLE.admin, USER_ROLE.user), blogController.createBlog);

blogRouter.patch("/blogs/:id", auth(USER_ROLE.user), blogController.updateBlog);

export default blogRouter;
