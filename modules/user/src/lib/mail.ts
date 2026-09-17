import { createTransport } from 'nodemailer';
import Mailgen from 'mailgen'; 'mailgen';
import type { Transporter } from 'nodemailer';
import type { Content } from 'mailgen';

type User = {
    login: string
    name: string
}

type MailParams = {
    intro: string,
    outro?: string,
    action?: {
        instructions: string;
        button: {
            color: string;
            text: string;
            link: string;
        }
    },
    goToAction?: {
        text: string;
        description: string;
        link: string;
    }
}

export class MailService {
    private transporter: Transporter;
    private generator: Mailgen;
    private baseContent: Content

    constructor() {
        this.transporter = createTransport({})
        this.generator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Holder team',
                link: 'holder.com',
            }
        })
        this.baseContent = {
            body: {
                greeting: 'Здравствуйте',
                signature: 'С наилучшими пожеланиями'
            }
        }
    }

    private generate(params: MailParams, subject: string, user: User) {
        const content = {
            body: {
                ...this.baseContent.body,
                name: user.name,
                ...params,
            }
        }

        const html = this.generator.generate(content);
        const text = this.generator.generatePlaintext(content);

        return {
            from: `Holder <${process.env.SMTP_USER}>`,
            to: user.login,
            subject,
            html,
            text,
        };

    }

    async send(params: MailParams, subject: string, user: User) {
        await this.transporter.sendMail(this.generate(params, subject, user))
    }
}