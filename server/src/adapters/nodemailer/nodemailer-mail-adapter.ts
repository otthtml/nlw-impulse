import nodemailer from 'nodemailer';
import { MailAdapter, SendMailData } from "../mail-adapter";

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1f28f6ff7bbb84",
      pass: "484933a1606286"
    }
  });

export class NodemailerMailAdapter implements MailAdapter {

    async sendMail({subject, body}: SendMailData): Promise<void> {
        await transport.sendMail({
            from: 'Equipe Feedget <fake@feedget.com>',
            to: 'Octavio <ott.html@gmail.com>',
            subject: subject,
            html: body
        });  
    }
}