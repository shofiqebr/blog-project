import { Response } from "express";
import mongoose from "mongoose";

export const handleValidationError = (
  err: mongoose.Error.ValidationError,
  res: Response
) => {
  const errors = Object.values(err.errors).map((e) => ({
    path: e.path,
    message: e.message,
  }));
  res.status(400).json({
    success: false,
    message: "Validation error",
    statusCode: 400,
    error: { details: errors },
  });
};
