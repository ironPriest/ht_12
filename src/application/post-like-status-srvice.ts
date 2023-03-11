import {inject, injectable} from "inversify";
import {PostLikeStatus} from "../types/types";
import {PostLikeStatusRepository} from "../repositories/post-like-staus-repository";
import {PostLikeStatusModel} from "../domain/PostLikeStatusSchema";

@injectable()
export class PostLikeStatusService {

    constructor(
        @inject(PostLikeStatusRepository) protected postLikeStatusRepository: PostLikeStatusRepository
    ) {
    }

    async checkExistence(userId: string, postId: string): Promise<PostLikeStatus | null> {
        return await this.postLikeStatusRepository.getLikeStatus(userId, postId);
    }

    async create(userId: string, login: string, postId: string): Promise<boolean> {

        /*const newLikeStatus = new LikeStatus(
            new ObjectId(),
            userId,
            commentId,
            likeStatus
        )

        return await this.likeStatusesRepository.create(newLikeStatus)*/

        const likeStatusEntity = PostLikeStatusModel.makeInstance(userId, login, postId)

        return await this.postLikeStatusRepository.save(likeStatusEntity)
    }

    async update(userId: string, postId: string, likeStatus: string): Promise<boolean> {

        let likeStatusInstance = await this.postLikeStatusRepository.getLikeStatus(userId, postId)
        if (!likeStatusInstance) return false

        likeStatusInstance.updateLike(likeStatus)

        await this.postLikeStatusRepository.save(likeStatusInstance)

        return true
    }

}