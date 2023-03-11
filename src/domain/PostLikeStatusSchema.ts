import mongoose, {HydratedDocument, Model} from "mongoose";
import {PostLikeStatus} from "../types/types";
import {ObjectId} from "mongodb";

export type PostLikeMethodType = {
    updateLike: (code: string) => PostLikeStatus
}
type PostLikeModelType = Model<PostLikeStatus, {}, PostLikeMethodType>
type PostLikeModelStaticType = Model<PostLikeStatus> & {
    makeInstance(
        userId: string,
        login: string,
        postId: string,
    ): HydratedDocument<PostLikeStatus, PostLikeMethodType>
}
type PostLikeModelFullType = PostLikeModelType & PostLikeModelStaticType

const PostLikeStatusSchema = new mongoose.Schema<PostLikeStatus>({
    userId: {type: String, required: true},
    login: {type: String, required: true},
    postId: {type: String, required: true},
    likeStatus: {type: String, required: true},
    addedAt: {type: String, required: true}
})
PostLikeStatusSchema.method('updateLike', function updateLike(likeStatus) {
    this.likeStatus = likeStatus
    return this
})
PostLikeStatusSchema.static('makeInstance', function makeInstance(
    userId: string,
    login: string,
    postId: string,
) {
    return new PostLikeStatusModel({
        _id: new ObjectId(),
        userId: userId,
        login: login,
        postId: postId,
        likeStatus: 'None',
        addedAt: new Date().toISOString()
    })
})

export const PostLikeStatusModel = mongoose.model<PostLikeStatus, PostLikeModelFullType>('postLikeStatuses', PostLikeStatusSchema)