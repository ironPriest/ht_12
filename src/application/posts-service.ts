import {PostLikeStatus, PostType} from "../types/types";
import {PostsRepository} from "../repositories/posts-repository";
import {v4} from "uuid";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs-repository";
import {inject, injectable} from "inversify";
import {PostMethodType, PostModelClass} from "../domain/PostSchema";
import {HydratedDocument} from "mongoose";
import {PostLikeStatusRepository} from "../repositories/post-like-staus-repository";
import {PostLikeMethodType} from "../domain/PostLikeStatusSchema";

@injectable()
export class PostsService {

    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(PostLikeStatusRepository) protected postLikeStatusRepository: PostLikeStatusRepository
    ) {
    }

    async getPosts(
        blogId: string | null,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        userId: string | undefined) {
        return await this.postsRepository.getPosts(
            blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            userId
        )
    }

    async getPostById(userId: string, postId: string): Promise<Omit<PostType, '_id'> | null> {

        let post = await this.postsRepository.getPostById(postId)
        if (!post) return null

        const likesCount = await this.postLikeStatusRepository.likesCount(postId)
        const dislikesCount = await this.postLikeStatusRepository.dislikesCount(postId)

        let myStatus = 'None'
        if(userId) {
            const likeStatus: PostLikeStatus | null = await this.postLikeStatusRepository.getLikeStatus(userId, postId)
            if (likeStatus) {
                myStatus = likeStatus.likeStatus
            }
        }

        const newestLikes = await this.postLikeStatusRepository.getNewestLikes(postId)

        post.extendedLikesInfo.likesCount = likesCount
        post.extendedLikesInfo.dislikesCount = dislikesCount
        post.extendedLikesInfo.myStatus = myStatus
        post.extendedLikesInfo.newestLikes = newestLikes

        return post

    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<Omit<PostType, "_id"> | null> {

        const blog = await this.blogsRepository.getBlogById(blogId)
        if (!blog) return null

        const newPost = PostModelClass.makeInstance(
            title,
            shortDescription,
            content,
            blogId,
            blog.name
        )

        const createdPost = await this.postsRepository.save(newPost)

        if (createdPost) {
            return {
                id: createdPost.id,
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdPost.blogId,
                blogName: createdPost.blogName,
                createdAt: createdPost.createdAt,
                extendedLikesInfo: {
                    likesCount: createdPost.extendedLikesInfo.likesCount,
                    dislikesCount: createdPost.extendedLikesInfo.dislikesCount,
                    myStatus: createdPost.extendedLikesInfo.myStatus,
                    newestLikes: createdPost.extendedLikesInfo.newestLikes
                }
        }

        } else {
            return null
        }

    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return this.postsRepository.updatePost(postId, title, shortDescription, content, blogId)
    }

    async deletePost(postId: string): Promise<boolean> {
        return this.postsRepository.deletePost(postId)
    }

}