import { Request, Response } from "express"
import { blogService } from "./blog.service"


const createBlog = async (req: Request, res: Response) => {
    try {
      const body = req.body
      const result = await blogService.createBlog(body)
  
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


  export const blogController = {
    createBlog,
   
  }