import {injectable} from "inversify";
import {PostLikeStatus} from "../types/types";
import {PostLikeMethodType, PostLikeStatusModel} from "../domain/PostLikeStatusSchema";
import {HydratedDocument} from "mongoose";

@injectable()
export class PostLikeStatusRepository {

    async getLikeStatus(userId: string, postId: string): Promise<HydratedDocument<PostLikeStatus, PostLikeMethodType> | null> {

        const likeStatus = await PostLikeStatusModel.
        findOne().
        where('userId').equals(userId).
        where('postId').equals(postId)

        if (!likeStatus) return null

        return likeStatus
    }

    async save(likeStatusEntity: HydratedDocument<PostLikeStatus, PostLikeMethodType>): Promise<boolean>{
        await likeStatusEntity.save()
        return true
    }

    async likesCount(postId: string): Promise<number> {
        return PostLikeStatusModel.count({postId, likeStatus: 'Like'}).lean()
    }

    async dislikesCount(postId: string): Promise<number> {
        return PostLikeStatusModel.count({postId, likeStatus: 'Dislike'}).lean()
    }

    async getNewestLikes(postId: string): Promise<PostLikeStatus[]> {
        return PostLikeStatusModel.
        find().
        where('postId').equals(postId).
        where('likeStatus').equals('Like').
        select('-__v -_id -likeStatus -postId').
        sort('addedAt').
        limit(3).
        lean()
    }

}