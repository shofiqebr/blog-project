import { Request, Response } from "express"
import { blogService } from "./blog.service"
import catchAsync from "../../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"
// import { isValidObjectId } from "mongoose"


const createBlog = async (req: Request, res: Response) => {
    try {
      const body = req.body
      const user = req.user as JwtPayload; // Comes from the `auth` middleware
      const authorId = user._id;

          // Add the author field to the blog data
    const blogData = { ...body, author: authorId };

      const result = await blogService.createBlog(blogData)
  
      res.send({
        success: true,
        message: 'Blog created successfully',
        result,
      })
    } catch (error) {
      res.send({
        success: false,
        message: 'Something went wrong',
        error,
      })
    }
  }


  const updateBlog = catchAsync(async (req: Request, res: Response) => {
    const blogId = req.params.id;

    // if (!isValidObjectId(blogId)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid blog ID",
    //   });
    // }

    const { title, content } = req.body;
   
   // Extract user from req.user (added by auth middleware)
   const user = req.user as JwtPayload;
   
    const updatedBlog = await blogService.updateBlog(blogId, user, { title, content });
  
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      statusCode: 200,
      data: updatedBlog,
    });
  });


  export const blogController = {
    createBlog,
    updateBlog,
  }