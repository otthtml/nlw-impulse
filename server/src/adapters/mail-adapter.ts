export interface SendMailData {
    subject: string;
    body: string;
}

export interface MailAdapter {
    sendMail(mail: SendMailData): Promise<void>;
}