import express from "express";
import auth from "../../../middlewares/auth";
import { blogController } from "./blog.controller";
import { USER_ROLE } from "../user/user.constrants";


const blogRouter = express.Router();


blogRouter.post("/blogs", auth( USER_ROLE.user), blogController.createBlog);

blogRouter.get("/blogs", blogController.getAllBlogs);


blogRouter.patch("/blogs/:id", auth(USER_ROLE.user), blogController.updateBlog);

blogRouter.delete("/blogs/:id", auth(USER_ROLE.user), blogController.deleteBlog);


export default blogRouter;
