import { Response } from "express";
import mongoose from "mongoose";

export const handleCastError = (
  err: mongoose.Error.CastError,
  res: Response
) => {
  res.status(400).json({
    success: false,
    message: "Invalid ID format.",
    statusCode: 400,
    error: { path: err.path, value: err.value },
  });
};
