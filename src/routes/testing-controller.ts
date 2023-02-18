import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {UsersRepository} from "../repositories/users-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {EmailconfirmationRepository} from "../repositories/emailconfirmation-repository";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";
import {DeviceAuthSessionsRepository} from "../repositories/device-auth-sessions-repository";
import {TimeStampsRepository} from "../repositories/time-stamps-repository";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {LikeStatusesRepository} from "../repositories/like-statuses-repository";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";

@injectable()
export class TestingController {

    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(EmailconfirmationRepository) protected emailConfirmationRepository: EmailconfirmationRepository,
        @inject(BlacktokensRepository) protected blackTokensRepository: BlacktokensRepository,
        @inject(DeviceAuthSessionsRepository) protected deviceAuthSessionsRepository: DeviceAuthSessionsRepository,
        @inject(TimeStampsRepository) protected timeStampsRepository: TimeStampsRepository,
        @inject(RecoveryCodesRepository) protected recoveryCodesRepository: RecoveryCodesRepository,
        @inject(LikeStatusesRepository) protected likeStatusesRepository: LikeStatusesRepository
    ) {
    }

    async delete(req: Request, res: Response) {

        await this.blogsRepository.deleteAll()
        await this.postsRepository.deleteAll()
        await this.usersRepository.deleteAll()
        await this.commentsRepository.deleteAll()
        await this.emailConfirmationRepository.deleteAll()
        await this.blackTokensRepository.deleteAll()
        await this.deviceAuthSessionsRepository.deleteAll()
        await this.timeStampsRepository.deleteAll()
        await this.recoveryCodesRepository.deleteAll()
        await this.likeStatusesRepository.deleteAll()

        res.sendStatus(204)
    }

}