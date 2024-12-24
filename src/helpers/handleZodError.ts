import { Response } from "express";
import { ZodError } from "zod";

// Helper function for Zod error handling
export const handlerZodError = (err: ZodError, res: Response): void => {
  const errorDetails = err.errors.map(e => ({
    path: e.path.join("."), // Flattening the path for better readability
    message: e.message,
  }));

  // Send the response and ensure nothing is returned
  res.status(400).json({
    success: false,
    message: "Validation error",
    statusCode: 400,
    error: { details: errorDetails },
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  return;
};
