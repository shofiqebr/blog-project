import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { adminService } from "./admin.service";


const blockUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedUser = await adminService.blockUser(userId);
    res.status(200).json({
        success: true,
        message: 'User blocked successfully',
        statusCode: 200,
        data: updatedUser,
    });
});


const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await adminService.deleteBlog(id);

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
    statusCode: 200,
  });
});

export const adminController = {
  blockUser,
  deleteBlog,
};
