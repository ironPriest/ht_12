import {BlogType} from "../types/types";
import {ObjectId} from "mongodb";
import {BlogsRepository} from "../repositories/blogs-repository"
import {v4} from 'uuid';
import {inject, injectable} from "inversify";
import {BlogMethodType, BlogModelClass} from "../repositories/db";
import {HydratedDocument} from "mongoose";

@injectable()
export class BlogsService {

    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository
    ) {
    }


    async getBlogs(
        searchTerm: string | undefined,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string) {
        return await this.blogsRepository.getBlogs(
            searchTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection)
    }

    async getBlogById(blogId: string): Promise<Omit<BlogType, '_id'> | null> {
        let blog: HydratedDocument<BlogType, BlogMethodType> | null = await this.blogsRepository.getBlogById(blogId)
        if (blog) {
            return {
                id: blog.id,
                name: blog.name,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                description: blog.description
            }
        } else {
            return null
        }

    }

    async createBlog(name: string, websiteUrl: string, description: string): Promise<Omit<BlogType, "_id">> {

        let newBlog = new BlogType(
            new ObjectId(),
            v4(),
            name,
            websiteUrl,
            description,
            new Date()
        )
        const createdBlog = await this.blogsRepository.createBlog(newBlog)
        return {
            id: createdBlog.id,
            name: createdBlog.name,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            description: createdBlog.description
        }
    }

    async updateBlog(blogId: string, name: string, websiteUrl: string): Promise<boolean> {
        return this.blogsRepository.updateBlog(blogId, name, websiteUrl)
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        return this.blogsRepository.deleteBlog(blogId)
    }

}