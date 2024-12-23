import { Types } from "mongoose";

export interface IBlog {
  _id: string;
  title: string; 
  content: string; 
  author: Types.ObjectId; 
  isPublished: boolean; 
 
}


export interface BlogQueryOptions {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  fields?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}