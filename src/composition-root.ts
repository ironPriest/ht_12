import {Container} from "inversify";

import {BlogsController} from "./routes/blogs-controller";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./domain/blogs-service";

import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./application/posts-service";
import {PostsController} from "./routes/posts-controller";

import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./routes/comments-controller";

import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./routes/users-controller";

import {LikeStatusesRepository} from "./repositories/like-statuses-repository";
import {LikeStatusesService} from "./domain/like-statuses-service";

import {AuthService} from "./domain/auth-service";
import {AuthController} from "./routes/auth-controller";

import {EmailconfirmationRepository} from "./repositories/emailconfirmation-repository";
import {RecoveryCodesRepository} from "./repositories/recovery-codes-repository";

import {EmailService} from "./domain/email-service";
import {EmailManager} from "./managers/email-manager";
import {EmailAdapter} from "./adapters/email-adapter";

import {BlacktokensRepository} from "./repositories/blacktockens-repository";
import {JwtUtility} from "./application/jwt-utility";

import {DeviceAuthSessionsRepository} from "./repositories/device-auth-sessions-repository";
import {DeviceAuthSessionsService} from "./domain/device-auth-sessions-service";
import {SecurityDevicesController} from "./routes/security-devices-controller";

import {TimeStampsRepository} from "./repositories/time-stamps-repository";

import {TestingController} from "./routes/testing-controller";

// const blogsRepository = new BlogsRepository()
// const postsRepository = new PostsRepository()
// const commentsRepository = new CommentsRepository()
// const usersRepository = new UsersRepository()
// const likeStatusesRepository = new LikeStatusesRepository()
// const emailConfirmationRepository = new EmailconfirmationRepository()
// const recoveryCodesRepository = new RecoveryCodesRepository()
// const blackTokensRepository = new BlacktokensRepository()
// const deviceAuthSessionsRepository = new DeviceAuthSessionsRepository()
// const timeStampsRepository = new TimeStampsRepository()
//
// const blogsService = new BlogsService(
//     blogsRepository
// )
// const postsService = new PostsService(
//     blogsRepository,
//     postsRepository
// )
// const commentService = new CommentsService(
//     usersRepository,
//     commentsRepository
// )
// const emailAdapter = new EmailAdapter()
// const emailManager = new EmailManager(
//     emailAdapter
// )
// const emailService = new EmailService(
//     emailManager
// )
// const authService = new AuthService(
//     usersRepository,
//     emailConfirmationRepository,
//     recoveryCodesRepository,
//     emailService
// )
// const usersService = new UsersService(
//     usersRepository,
//     authService
// )
// const likesStatusesService = new LikeStatusesService(
//     likeStatusesRepository
// )
// const jwtUtility = new JwtUtility(
//     blackTokensRepository
// )
// const deviceAuthSessionsService = new DeviceAuthSessionsService(
//     deviceAuthSessionsRepository
// )
//
// export const blogsController = new BlogsController(
//     blogsService,
//     postsService
// )
// export const postsController = new PostsController(
//     postsService,
//     commentService
// )
// export const commentsController = new CommentsController(
//     commentService,
//     likesStatusesService
// )
// export const usersController = new UsersController(
//     usersService
// )
// export const authController = new AuthController(
//     usersService,
//     blackTokensRepository,
//     jwtUtility,
//     deviceAuthSessionsService,
//     recoveryCodesRepository,
//     authService
// )
// export const securityDeviceController = new SecurityDevicesController(
//     jwtUtility,
//     blackTokensRepository,
//     deviceAuthSessionsRepository,
//     deviceAuthSessionsService
// )
// export const testingController = new TestingController(
//     blogsRepository,
//     postsRepository,
//     usersRepository,
//     commentsRepository,
//     emailConfirmationRepository,
//     blackTokensRepository,
//     deviceAuthSessionsRepository,
//     timeStampsRepository,
//     recoveryCodesRepository,
//     likeStatusesRepository
// )

export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)

container.bind(LikeStatusesService).to(LikeStatusesService)
container.bind(LikeStatusesRepository).to(LikeStatusesRepository)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)

container.bind(EmailconfirmationRepository).to(EmailconfirmationRepository)
container.bind(RecoveryCodesRepository).to(RecoveryCodesRepository)

container.bind(EmailService).to(EmailService)
container.bind(EmailManager).to(EmailManager)
container.bind(EmailAdapter).to(EmailAdapter)

container.bind(BlacktokensRepository).to(BlacktokensRepository)
container.bind(JwtUtility).to(JwtUtility)

container.bind(DeviceAuthSessionsRepository).to(DeviceAuthSessionsRepository)
container.bind(DeviceAuthSessionsService).to(DeviceAuthSessionsService)
container.bind(SecurityDevicesController).to(SecurityDevicesController)

container.bind(TimeStampsRepository).to(TimeStampsRepository)

container.bind(TestingController).to(TestingController)
