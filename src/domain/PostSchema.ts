import mongoose, {HydratedDocument, Model} from "mongoose";
import {PostType} from "../types/types";
import {ExtendedLikesInfoSchema} from "./extended-likes-info-schema";
import {ObjectId} from "mongodb";
import {v4} from "uuid";

export type PostMethodType = {

}
type PostModelType = Model<PostType, {}, PostMethodType>
type PostModelStaticType = Model<PostType> & {
    makeInstance(
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string
    ): HydratedDocument<PostType, PostMethodType>
}
type PostModelFullType = PostModelType & PostModelStaticType

const PostSchema = new mongoose.Schema<PostType, PostModelFullType, PostMethodType>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    extendedLikesInfo: {type: ExtendedLikesInfoSchema, required: true}
})
PostSchema.static('makeInstance', function makeInstance(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
) {
    return new PostModelClass({
        _id: new ObjectId(),
        id: v4(),
        title,
        shortDescription,
        content,
        blogId,
        blogName,
        createdAt: new Date().toISOString(),
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: []
        }
    })
})
export const PostModelClass = mongoose.model<PostType, PostModelFullType>('posts', PostSchema)