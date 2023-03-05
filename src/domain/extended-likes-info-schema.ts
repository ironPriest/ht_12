import mongoose from "mongoose";
import {ExtendedLikesInfo} from "../types/types";

export const ExtendedLikesInfoSchema = new mongoose.Schema<ExtendedLikesInfo>({
    likesCount: {type:Number, required: true},
    dislikesCount: {type:Number, required: true},
    myStatus: {type:String, required: true},
    newestLikes: {type:[], required: true}
})