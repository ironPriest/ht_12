import {inject, injectable} from "inversify";
import {PostsService} from "../application/posts-service";
import {BlogsService} from "../domain/blogs-service";
import {Request, Response} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";


@injectable()
export class BlogsController {

    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostsService) protected postsService: PostsService
    ) {
    }

    async getBlogs(req: Request, res: Response) {
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
        const blogs = await this.blogsService.getBlogs(
            req.query.searchNameTerm?.toString(),
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
        res.send(blogs)
    }

    async createBlog(req: Request, res: Response) {
        const newBlogger = await this.blogsService.createBlog(
            req.body.name,
            req.body.websiteUrl,
            req.body.description)
        res.status(201).send(newBlogger)
    }

    async getBlogPosts(req: Request, res: Response) {

        let blog = await this.blogsService.getBlogById(req.params.blogId)
        if (!blog) return res.sendStatus(404)

        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
        const pageSize = req.query.pageSize ? +req.query.pageSize : 10
        const sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        const sortDirection = req.query.sortDirection ? req.query.sortDirection.toString() : 'Desc'
        const posts = await this.postsService.getPosts(
            req.params.blogId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            req.user?.id)
        res.send(posts)

    }

    async createBlogPost(req: Request, res: Response) {
        const newPost = await this.postsService.createPost(
            req.body.title,
            req.body.shortDescription,
            req.body.content,
            req.params.blogId)
        if (!newPost) return res.sendStatus(400)
        res.status(201).send(newPost)
    }

    async getBlog(req: Request, res: Response) {
        let blog = await this.blogsService.getBlogById(req.params.bloggerId)
        if (blog) {
            res.send(blog)
        } else {
            res.send(404)
        }
    }

    async updateBlog(req: Request, res: Response) {
        const isUpdated: boolean = await this.blogsService.updateBlog(
            req.params.blogId,
            req.body.name,
            req.body.youtubeUrl)
        if (isUpdated) {
            const blog = await this.blogsService.getBlogById(req.params.blogId)
            res.status(204).send(blog)
        } else {
            res.send(404)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        const isDeleted: boolean = await this.blogsService.deleteBlog(req.params.blogId)
        if (isDeleted) {
            res.send(204)
        } else {
            res.send(404)
        }
    }

}