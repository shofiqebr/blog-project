import { NextFunction, Request, Response } from "express"
import { blogService } from "./blog.service"
import catchAsync from "../../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"





const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const user = req.user as JwtPayload;
    const authorId = user._id;


    const blogData = { ...body, author: authorId };

    const result = await blogService.createBlog(blogData);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: result,
    });
  } catch (error) {
    next(error); 
  }
};


export default createBlog;



  const getAllBlogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try{

      const blogs = await blogService.getAllBlogs(req.query);
  
      res.status(200).json({
        success: true,
        message: "Blogs fetched successfully",
        statusCode: 200,
        data: blogs,
      });
    }catch(error){
      next(error)
    };
   
  });
  


  const updateBlog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    try{
      const blogId = req.params.id;


      const { title, content } = req.body;
     
    
     const user = req.user as JwtPayload;
  
      const updatedBlog = await blogService.updateBlog(blogId, user, { title, content });
    
      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        statusCode: 200,
        data: updatedBlog,
      });

    }catch(error){
      next(error)
    };
   
  });


  const deleteBlog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    try{

      const blogId = req.params.id;
  
      // Extract user from req.user
      const user = req.user as JwtPayload;
    
      await blogService.deleteBlog(blogId, user);
    
      res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
        statusCode: 200,
      });
    }catch(error){
      next(error)
    };
  
  });

  export const blogController = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
  }