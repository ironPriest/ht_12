import {EmailManager} from "../managers/email-manager";
import {inject, injectable} from "inversify";

@injectable()
export class EmailService {

    constructor(
        @inject(EmailManager) protected emailManager: EmailManager
    ) {
    }

    async register(email: string, subject: string, code: string) {
        await this.emailManager.sendRegistrationCode(email, subject, code)
    }

    async passwordRecovery(email: string, subject: string, code: string) {
        await this.emailManager.passwordRecovery(email, subject, code)
    }

}