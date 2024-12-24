import { Response } from "express";

export const handleGenericError = (err: Error, res: Response) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    statusCode: 500,
    error: {},
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
