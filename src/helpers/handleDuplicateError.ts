import { Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlerDuplicateError = (err: any, res: Response) => {
  const key = Object.keys(err.keyValue).join(", ");
  res.status(409).json({
    success: false,
    message: `Duplicate key error: ${key} already exists.`,
    statusCode: 409,
    error: { details: err.keyValue },
  });
};
