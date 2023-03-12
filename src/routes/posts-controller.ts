import {PostsService} from "../application/posts-service";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {PostModelClass} from "../domain/PostSchema";
import {PostLikeStatusService} from "../application/post-like-status-srvice";

@injectable()
export class PostsController {

    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(PostLikeStatusService) protected postLikeStatusService: PostLikeStatusService
    ) {
    }

    async updateLike(req: Request, res: Response) {

        const post = await this.postsService.getPostById(req.user.id, req.params.postId)
        if (!post) return res.sendStatus(404)

        const postLikeStatus = await this.postLikeStatusService.checkExistence(req.user.id, req.params.postId)
        if (!postLikeStatus) {
            const creationResult = await this.postLikeStatusService.create(
                req.user.id,
                req.user.login,
                req.params.postId,
                req.body.likeStatus
            )
            if (!creationResult) return res.sendStatus(400)
            return res.sendStatus(204)
        } else {
            const updateResult = await this.postLikeStatusService.update(req.user.id, req.params.postId, req.body.likeStatus)
            if (!updateResult) return res.sendStatus(400)
            return res.sendStatus(204)
        }
    }

    async getPostComments(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.user?.id, req.params.postId)
        if (!post) {
            res.sendStatus(404)
        } else {
            const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
            const pageSize = req.query.pageSize ? +req.query.pageSize : 10
            const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
            const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
            const comments = await this.commentsService.getPostComments(
                req.params.postId,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
                req.user.id)
            res.status(200).send(comments)
        }
    }

    async createComment(req: Request, res: Response) {
        const post = await this.postsService.getPostById(req.user.id, req.params.postId)
        if (!post) {
            res.sendStatus(404)
        } else {
            const newComment = await this.commentsService.create(
                req.body.content,
                req.user!._id,
                req.params.postId)
            res.status(201).send(newComment)
        }
    }

    async getPosts(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
        const posts = await this.postsService.getPosts(
            null,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            req.user?.id)
        res.send(posts)
    }

    async createPost(req: Request, res: Response) {
        const newPost = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId)
        if (newPost) {
            res.status(201).send(newPost)
        } else {
            res.status(400).json({
                errorsMessages: [{
                    "message": "no such blogId!!",
                    "field": "blogId"
                }]
            })
        }

    }

    async getPost(req: Request, res: Response) {

        const post = await this.postsService.getPostById(req.user?.id, req.params.id)
        if (!post) return res.sendStatus(404)

        res.status(200).send(post)

    }

    async updatePost(req: Request, res: Response) {

        const postInstance = await PostModelClass.findOne({id: req.params.postId})
        if (!postInstance) return res.sendStatus(404)

        const updatedPostInstance = await this.postsService.updatePost(
            req.params.postId,
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.body.blogId
        )

        if (!updatedPostInstance) return res.sendStatus(400)

        return res.sendStatus(204)
    }

    async deletePost(req: Request, res: Response) {
        const isDeleted: boolean = await this.postsService.deletePost(req.params.postId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }

}