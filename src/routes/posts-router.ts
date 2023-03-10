import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {bearerAuthMiddleware} from "../middlewares/bearer-auth-middleware";
import {userCheckMiddleware} from "../middlewares/user-check-middleware";
import {BlogsService} from "../domain/blogs-service";
import {container} from "../composition-root";
import {PostsController} from "./posts-controller";

const postsController = container.resolve(PostsController)
const blogsService = container.resolve(BlogsService)

export const postsRouter = Router({})

export const titleValidation = body('title')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 30})

export const descValidation = body('shortDescription')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 100})

export const contentValidation = body('content')
    .trim()
    .exists({checkFalsy: true})
    .isLength({max: 1000})

export const blogIdValidation = body('blogId')
    .exists({checkFalsy: true})
    .custom(async (blogId, ) => {
        const blogger = await blogsService.getBlogById(blogId)

        if (!blogger) {
            throw new Error('such blogger doesnt exist')
        }
        return true
    })

export const commentValidation = body('content')
    .exists({checkFalsy: true})
    .isString()
    .isLength({min: 20})
    .isLength({max: 300})

const likeValidation = body('likeStatus')
    .exists({checkFalsy: true}).isIn(['None', 'Like', 'Dislike'])

postsRouter.put(
    '/:postId/like-status',
    bearerAuthMiddleware,
    likeValidation,
    inputValidationMiddleware,
    postsController.updateLike.bind(postsController)
)
postsRouter.get(
    '/:postId/comments',
    userCheckMiddleware,
    postsController.getPostComments.bind(postsController)
)
postsRouter.post(
    '/:postId/comments',
    bearerAuthMiddleware,
    commentValidation,
    inputValidationMiddleware,
    postsController.createComment.bind(postsController)
)
postsRouter.get(
    '/',
    userCheckMiddleware,
    postsController.getPosts.bind(postsController)
)
postsRouter.post(
    '/',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController)
)
postsRouter.get(
    '/:id',
    userCheckMiddleware,
    postsController.getPost.bind(postsController)
)

postsRouter.put(
    '/:postId',
    authMiddleware,
    descValidation,
    titleValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    postsController.updatePost.bind(postsController)
)
postsRouter.delete(
    '/:postId',
    authMiddleware,
    postsController.deletePost.bind(postsController)
)

