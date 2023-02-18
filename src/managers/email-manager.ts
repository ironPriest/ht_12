import {EmailAdapter} from "../adapters/email-adapter";
import {inject, injectable} from "inversify";

@injectable()
export class EmailManager {

    constructor(
        @inject(EmailAdapter) protected emailAdapter: EmailAdapter
    ) {
    }

    async sendRegistrationCode(email: string, subject: string, code: string) {
        await this.emailAdapter.sendEmail(email, subject, code)
    }

    async passwordRecovery(email: string, subject: string, code: string) {
        await this.emailAdapter.passwordRecovery(email, subject, code)
    }

}