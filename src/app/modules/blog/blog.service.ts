import { IBlog } from "./blog.interface"
import Blog from "./blog.model"


const createBlog = async (payload: IBlog) => {
      const result = await Blog.create(payload)
  
    // const data = new Tour(payload)
  
    //   data.color = "red"
  
    // const result = await data.save()
    return result
  }


  export const blogService = {
    createBlog,
 
  }