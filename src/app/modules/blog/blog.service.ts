import { JwtPayload } from "jsonwebtoken"
import { IBlog } from "./blog.interface"
import Blog from "./blog.model"


const createBlog = async (blogData: Partial<IBlog>) => {
      const result = await Blog.create(blogData)
  
    // const data = new Tour(payload)
  
    //   data.color = "red"
  
    // const result = await data.save()
    return result
  }

  const updateBlog = async (
    blogId: string,
    user: JwtPayload,
    updateData: Partial<{ title: string; content: string }>
  ) => {
    const blog = await Blog.findById(blogId);
  
    if (!blog) {
      throw new Error("Blog not found");
    }
  
    if (blog.author.toString() !== user._id.toString()) {
      throw new Error("You are not authorized to update this blog");
    }
    
  
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate("author", "-password"); // Populate author details
  
    return updatedBlog;
  };


  export const blogService = {
    createBlog,
    updateBlog,
 
  }