import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { handleValidationError } from "../helpers/handlerValidationError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handlerZodError } from "../helpers/handleZodError";


// Standardized error response
const errorResponse = (
  res: Response,
  message: string,
  statusCode: number,
  error: Record<string, unknown> = {},
  stack?: string
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
  });
};

// Global error handler
export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "An unexpected error occurred.";
  let errorDetails: Record<string, unknown> = {};

  // Zod validation error
  if (err instanceof ZodError) {
    return handlerZodError(err, res);
  }

  // Mongoose Cast Error
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format.";
    errorDetails = { path: err.path, value: err.value };
    return errorResponse(res, message, statusCode, errorDetails, err.stack);
  }

  // Mongoose Validation Error
  if (err instanceof mongoose.Error.ValidationError) {
    return handleValidationError(err, res);
  }

  // Mongoose Duplicate Key Error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (err instanceof mongoose.Error && (err as any).code === 11000) {
    return handlerDuplicateError(err, res);
  }

  // Authentication Error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any).name === "AuthenticationError") {
    statusCode = 401;
    message = "Authentication failed. Invalid or expired token.";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return errorResponse(res, message, statusCode, {}, (err as any).stack);
  }

  // Authorization Error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any).name === "AuthorizationError") {
    statusCode = 403;
    message = "Access denied. You do not have the required permissions.";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return errorResponse(res, message, statusCode, {}, (err as any).stack);
  }

  // Not Found Error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any).name === "NotFoundError") {
    statusCode = 404;
    message = "The requested resource could not be found.";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return errorResponse(res, message, statusCode, {}, (err as any).stack);
  }

  // Generic internal server error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return errorResponse(res, message, statusCode, {}, (err as any)?.stack);
};
