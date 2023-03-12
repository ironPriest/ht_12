import {container} from "../composition-root";
import {BlogsService} from "../domain/blogs-service";
import {BlogsController} from "./blogs-controller";
import {Router} from "express";
import {body, param} from "express-validator";
import {inputValidationMiddleware, requestsCounterMiddleware} from "../middlewares/input-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {contentValidation, descValidation, titleValidation} from "./posts-router";
import {userCheckMiddleware} from "../middlewares/user-check-middleware";

const blogsController = container.resolve(BlogsController)
const blogsService = container.resolve(BlogsService)

export const blogsRouter = Router({})

blogsRouter.use(requestsCounterMiddleware)

const nameValidation = body('name')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 15})

const youtubeUrlValidation = body('websiteUrl')
    .trim()
    .bail()
    .exists({checkFalsy: true})
    .bail()
    .isLength({max: 100})
    .bail()
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')

const bloggerIdValidation = param('blogId').custom(async (blogId, ) => {
    const blog = await blogsService.getBlogById(blogId)
    if (!blog) {
        throw new Error('such blog doesnt exist')
    }
    return true
})

blogsRouter.get(
    '/',
    blogsController.getBlogs.bind(blogsController)
)
blogsRouter.post(
    '/',
    authMiddleware,
    nameValidation,
    youtubeUrlValidation,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController)
)
blogsRouter.get(
    '/:blogId/posts',
    bloggerIdValidation,
    inputValidationMiddleware,
    blogsController.getBlogPosts.bind(blogsController)
)
blogsRouter.post(
    '/:blogId/posts',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    bloggerIdValidation,
    inputValidationMiddleware,
    userCheckMiddleware,
    blogsController.createBlogPost.bind(blogsController)
)
blogsRouter.get(
    '/:blogId',
    blogsController.getBlog.bind(blogsController)
)
blogsRouter.put(
    '/:blogId',
    authMiddleware,
    youtubeUrlValidation,
    nameValidation,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController)
)
blogsRouter.delete(
    '/:blogId',
    authMiddleware,
    blogsController.deleteBlog.bind(blogsController)
)