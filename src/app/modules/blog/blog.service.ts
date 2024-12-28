import { JwtPayload } from 'jsonwebtoken';
import { BlogQueryOptions, IBlog } from './blog.interface';
import Blog from './blog.model';

const createBlog = async (blogData: Partial<IBlog>) => {
  const result = await Blog.create(blogData);

  const blog = await Blog.findById(result._id)
    .select('-createdAt -updatedAt -__v')
    .populate('author', '-password -__v');

  return blog;
};

export const getAllBlogs = async (query: BlogQueryOptions) => {
  console.log("main",query)
  try {
    const queryObj = { ...query };
    
    // Exclude special parameters
    const excludedFields = ["search", 
      "sortBy", 
      "sortOrder", 
      // "fields"
    ];
    excludedFields.forEach((key) => delete queryObj[key]);
    console.log(queryObj)

    // Search functionality
    const search = query.search || '';
    const searchableFields = ['title', 'content'];
    const searchQuery = Blog.find({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' }, // case-insensitive
      })),
    });

 
    // sorting

    let sortStr = '';

    if(query?.sortBy && query?.sortOrder){
      const sortBy = query.sortBy;
      const sortOrder = query.sortOrder;
      sortStr = `${sortOrder === "desc"? '-' : ''}${sortBy}`
    }

 

    // // Field selection
    // const fields = query.fields ? query.fields.split(",").join(" ") : "-__v";


    // Query execution
    const result = await searchQuery.sort(sortStr);
   

    return result;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw new Error('Failed to fetch blogs');
  }
};

const updateBlog = async (
  blogId: string,
  user: JwtPayload,
  updateData: Partial<{ title: string; content: string }>,
) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new Error('Blog not found');
  }

  if (blog.author.toString() !== user._id.toString()) {
    throw new Error('You are not authorized to update this blog');
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    { ...updateData, updatedAt: new Date() },
    { new: true },
  ).populate('author', '-password'); // Populate author details

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
};
