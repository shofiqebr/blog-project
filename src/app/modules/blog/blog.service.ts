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
  try {
    const queryObj = { ...query };
    const excludedFields = ["search", "sortBy", "sortOrder"];
    excludedFields.forEach((key) => delete queryObj[key]);

    // Search functionality
    const search = query.search || "";
    // console.log("Search Term:", search);
    const searchableFields = ["title", "content"];
    const searchConditions = search
      ? {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {};

    // Combine filters
    const filterQuery = { ...queryObj, ...searchConditions };

    // Sorting
    const sortStr =
      query.sortBy && query.sortOrder
        ? `${query.sortOrder === "desc" ? "-" : ""}${query.sortBy}`
        : "-createdAt"; 

    // Pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Logging for debugging
    // console.log("Filter Query:", filterQuery);
    // console.log("Sort String:", sortStr);
    // console.log("Pagination - Page:", page, "Limit:", limit, "Skip:", skip);

    // Query execution
    const rawResult = await Blog.find(filterQuery);
    console.log("Raw Query Result:", rawResult);

    const result = await Blog.find(filterQuery)
      .sort(sortStr)
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .populate("author", "-password -__v");

    // console.log("Processed Result:", result);

    return result;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error("Failed to fetch blogs");
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
