import { JwtPayload } from "jsonwebtoken"
import { BlogQueryOptions, IBlog } from "./blog.interface"
import Blog from "./blog.model"


const createBlog = async (blogData: Partial<IBlog>) => {
      const result = await Blog.create(blogData)

      const blog = await Blog.findById(result._id)
      .select("-createdAt -updatedAt -__v")
      .populate("author", "-password -__v");
  
    return blog
  }


  const getAllBlogs = async (query: BlogQueryOptions) => {
    const queryObj = { ...query };
  
    // Exclude special parameters from the main query object
    const excludedFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields"];
    excludedFields.forEach((key) => delete queryObj[key]);
  
    // Search functionality
    const searchTerm = query.searchTerm || "";
    const searchableFields = ["title", "content"];
    const searchQuery = searchTerm
      ? {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: searchTerm, $options: "i" }, // case-insensitive search
          })),
        }
      : {};
  
    // Combine search and filters
    const filterQuery = { ...searchQuery, ...queryObj };
  
    // Pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
  
    // Sorting
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "desc" ? -1 : 1;
  
    // Ensure sortQuery is an object for sorting
    const sortQuery: { [key: string]: 1 | -1 } = { [sortBy]: sortOrder };
  
    // Field selection
    const fields = query.fields ? query.fields.split(",").join(" ") : "-__v"; // Exclude __v by default
  
    // Query execution
    const result = await Blog.find(filterQuery)
      .sort(sortQuery) // Sorting applied here
      .skip(skip)
      .limit(limit)
      .select(fields)
      .populate("author", "-password"); // Exclude password from author details
  
    return result;
  };
  
  
  

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

  const deleteBlog = async (blogId: string, user: JwtPayload) => {
    const blog = await Blog.findById(blogId);
  
    if (!blog) {
      throw new Error('Blog not found');
    }
  
    // Ensure the user owns the blog
    if (blog.author.toString() !== user._id) {
      throw new Error('You are not authorized to delete this blog');
    }
  
    await Blog.findByIdAndDelete(blogId);
  };


  export const blogService = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
  }