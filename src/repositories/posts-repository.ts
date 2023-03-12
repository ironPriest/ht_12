import {inject, injectable} from "inversify";
import {PostType} from "../types/types";
import {PostMethodType, PostModelClass} from "../domain/PostSchema";
import {HydratedDocument} from "mongoose";
import {PostLikeStatusRepository} from "./post-like-staus-repository";

@injectable()
export class PostsRepository {

    constructor(
        @inject(PostLikeStatusRepository) protected postLikeStatusRepository: PostLikeStatusRepository
    ) {
    }

    async getPosts(
        blogId: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        userId: string | undefined
    ) {

        let totalCount = await PostModelClass.count()
        let pageCount = Math.ceil(+totalCount / pageSize)
        const sortFilter: any = {}
        switch (sortDirection) {
            case ('Asc'): sortFilter[sortBy] = 1
                break
            case ('Desc'): sortFilter[sortBy] = -1
                break
        }

        let filter = {}
        if (blogId) filter = {blogId: blogId}

        console.log('--blogId-- --filter-- -->', blogId, filter)

        let queryRes = await PostModelClass.
        find(filter).
        select('-__v -_id -extendedLikesInfo._id').
        sort(sortFilter).
        skip((pageNumber - 1) * pageSize).
        limit(pageSize).
        lean()

        /*if (blogId) {
            query = query.find({blogId})
        }*/

        const mappedPosts = await Promise.all(queryRes.map(async post => {
            post.extendedLikesInfo.likesCount = await this.postLikeStatusRepository.likesCount(post.id)
            post.extendedLikesInfo.dislikesCount = await this.postLikeStatusRepository.dislikesCount(post.id)
            post.extendedLikesInfo.myStatus = 'None'
            if (userId) {
                const likeStatus = await this.postLikeStatusRepository.getLikeStatus(userId, post.id)
                if (likeStatus) {
                    post.extendedLikesInfo.myStatus = likeStatus.likeStatus
                }
            }

            const newestLikes = await this.postLikeStatusRepository.getNewestLikes(post.id)
            post.extendedLikesInfo.newestLikes = newestLikes

            return post
        }))

        return {
            "pagesCount": pageCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": mappedPosts
        }
    }

    async getPostById(postId: string): Promise<HydratedDocument<PostType, PostMethodType> | null> {
        return PostModelClass.
            findOne({id: postId}).
            where('id').equals(postId).
            select('-__v -_id -extendedLikesInfo._id')
    }

    async createPost(post: PostType): Promise<PostType | null> {

        const newPostInstance = new PostModelClass(post)

        await newPostInstance.save()

        return newPostInstance

    }

    async updatePost(
        postId: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string): Promise<boolean> {

        const postInstance = await  PostModelClass.findOne({id: postId})
        if (!postInstance) return false

        postInstance.title = title
        postInstance.shortDescription = shortDescription
        postInstance.content = content
        postInstance.blogId = blogId

        await postInstance.save()

        return true
    }

    async deletePost(postId: string): Promise<boolean> {

        const postInstance = await PostModelClass.findOne({id: postId})
        if (!postInstance) return false

        await postInstance.deleteOne()

        return true
    }

    async save(newPost: HydratedDocument<PostType, PostMethodType>): Promise<HydratedDocument<PostType, PostMethodType>> {
        await newPost.save()
        return newPost
    }

    async deleteAll() {
        await PostModelClass.deleteMany()
    }

}