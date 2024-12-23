import { Types } from "mongoose";

export interface IBlog {
  _id: string;
  title: string; 
  content: string; 
  author: Types.ObjectId; 
  isPublished: boolean; 
 
}
