import { NotFoundError } from "../../../utils/errors";
import Blog from "../blog/blog.model";
import User from "../user/user.model";


const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.isBlocked = true;
  await user.save();
};

const deleteBlog = async (blogId: string) => {
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      throw new Error("Blog not found");
    }
  
    return { message: "Blog deleted successfully" };
  };
  

export const adminService = {
  blockUser,
  deleteBlog,
};
