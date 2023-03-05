import {NextFunction, Request, Response} from "express";
import {JwtUtility} from "../application/jwt-utility";
import {UsersService} from "../domain/users-service";
import {BlacktokensRepository} from "../repositories/blacktockens-repository";
import {UsersRepository} from "../repositories/users-repository";
import {EmailconfirmationRepository} from "../repositories/emailconfirmation-repository";
import {RecoveryCodesRepository} from "../repositories/recovery-codes-repository";
import {EmailAdapter} from "../adapters/email-adapter";
import {EmailManager} from "../managers/email-manager";
import {EmailService} from "../domain/email-service";
import {AuthService} from "../domain/auth-service";
import {container} from "../composition-root";

const jwtUtility = container.resolve(JwtUtility)
const usersService = container.resolve(UsersService)


//todo don't put the whole user in req, don't go to service to find user
export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtUtility.getUserIdByToken(token)

    if (userId) {
        req.user = await usersService.findById(userId)
        next()
    } else {
        return res.sendStatus(401)
    }

}